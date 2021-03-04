const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
const { isEmpty, uniq } = require("lodash");
const { FIELD_REQUIRED, FIELD_EXISTS } = require("../config/Message");
const { BE, FE } = require("../config/Constant");
const { convertUnicode, getFullTime } = require("../utils/index");

const fields = {
    type: { type: Number, require: true },
    controller: { type: String, require: true, trim: true }, // name of container in FE
    name: { type: String, require: true },
    list_action: { type: Array, require: true },
    created_at: { type: String },
    updated_at: { type: String }
};
const Controller = mongoose.model('tbl_controllers', fields);

function validateInput(model) {
    let errors = {};

    model.list_action = model.list_action.filter(elm => {
        return !isEmpty(elm.action) && !isEmpty(elm.name);
    });

    for (var field in fields) {
        if (!fields.hasOwnProperty(field)) continue;

        var obj = fields[field];
        for (var condition in obj) {
            if (!obj.hasOwnProperty(condition)) continue;

            if (condition === 'require' &&
                (model[field] === undefined || model[field].toString().trim() === "")) {
                errors[field] = FIELD_REQUIRED;
            }
        }

    }

    if (!model._id) {
        model.created_at = getFullTime();
        model.updated_at = getFullTime();
    } else {
        model.updated_at = getFullTime();
    }

    return isExistsController(model.controller, model.type, model._id).then(is_exists => {
        if (is_exists) errors.controller = FIELD_EXISTS;
        return {
            errors,
            isValid: isEmpty(errors)
        }
    });
}

function isExistsController(controller, type = "", _id = "") {
    let conditions = { controller: controller.trim() };
    if (_id !== "") {
        conditions._id = { $ne: _id };
    }
    if (type !== "") {
        conditions.type = parseInt(type);
    }
    return Controller.findOne(conditions).then(model => {
        if (model) return true;
        return false;
    });
}

function search(data, cb) {
    let conditions = {};
    let sort = { _id: -1 };
    if (data.sort_by && data.sort_by.sort) {
        sort = { [data.sort_by.field]: data.sort_by.sort };
    }
    if (data.name && !isEmpty(data.name)) {
        let name = convertUnicode(data.name);
        name = new RegExp(`${name}`, 'i');
        conditions.$or = [
            { controller: name },
            { name: name },
        ];
    }

    if (data.type && !isEmpty(data.type)) {
        conditions.type = parseInt(data.type);
    }

    let skip = 0;
    const per_page = data.per_page;
    if (data.page) {
        skip = (parseInt(data.page) - 1) * per_page;
    }

    Controller.find(conditions).countDocuments().then(total => {
        Controller.find(conditions).limit(per_page).skip(skip).sort(sort)
            .then(models => cb({ success: true, models, total }));
    });
}

function getControllers(type, cb) {
    let directoryPath;
    if (type === BE) {
        directoryPath = path.join('./routers/admin');
    } else {
        directoryPath = path.join('./routers/frontend');
    }
    const files = fs.readdirSync(directoryPath);
    Promise.all(files.map((file) => {
        const controller = file.replace("Route.js", "");
        return isExistsController(controller).then(is_exists => {
            if (!is_exists) return controller;
        });
    })).then(results => {
        results = uniq(results);
        cb(results.filter(result => result));
    });
}

function getActions(controller, type = FE) {
    return Controller.findOne({ controller, type }, { name: 1, list_action: 1 });
}

module.exports = {
    Controller, validateInput, search, getControllers, getActions
};
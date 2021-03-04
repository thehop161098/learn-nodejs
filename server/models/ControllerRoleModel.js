// Lucjfer
const mongoose = require("mongoose");
const { isEmpty, uniq } = require("lodash");
const { FIELD_REQUIRED } = require("../config/Message");
const { BE, FE } = require("../config/Constant");
const { convertUnicode, getFullTime } = require("../utils/index");
const { Controller } = require('./ControllerModel');

const fields = {
    type: { type: String, require: true, trim: true },
    name: { type: String, require: true, trim: true },
    list_controller: { type: Array, require: true },
    sort: { type: Number },
    created_at: { type: String },
    updated_at: { type: String }
};
const ControllerRole = mongoose.model('tbl_controller_roles', fields, 'tbl_controller_roles');

function validateInput(model) {
    let errors = {};

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

    if (model.type && model.list_controller.length > 0) {
        return Promise.all(model.list_controller.map((controller) => {
            return isExistsController(controller, model.type, model._id).then(is_exists => {
                return is_exists;
            });
        })).then(results => {
            results = uniq(results);
            if (results.indexOf(true) !== -1) return true;
            return false;
        }).then(is_exists => {
            if (is_exists) errors.list_controller = "Controller đã tồn tại";
            return {
                errors,
                isValid: isEmpty(errors)
            }
        });
    } else {
        return new Promise((resolve, reject) => {
            resolve({
                errors,
                isValid: isEmpty(errors)
            });
        });
    }
}

function search(data, cb) {
    let conditions = {};
    let sort = { order_by: 1, _id: -1 };
    if (data.name && !isEmpty(data.name)) {
        let name = convertUnicode(data.name);
        name = new RegExp(`${name}`, 'i');
        conditions.$or = [
            { controller: name },
            { name: name }
        ];
    }

    if (data.type && !isEmpty(data.type)) {
        conditions.type = data.type;
    }

    let skip = 0;
    const per_page = data.per_page;
    if (data.page) {
        skip = (parseInt(data.page) - 1) * per_page;
    }

    ControllerRole.find(conditions).countDocuments().then(total => {
        ControllerRole.find(conditions).limit(per_page).skip(skip).sort(sort)
            .then(models => cb({ success: true, models, total }));
    });
}

// Lucjfer : check controller is exists in each type
function isExistsController(controller, type, _id = null) {
    let conditions = {
        list_controller: { $elemMatch: { $eq: controller } },
        type
    };
    if (_id !== null && _id !== "" && parseInt(_id) !== -1 && _id !== 'undefined') {
        conditions._id = { $ne: _id }
    }
    return ControllerRole.findOne(conditions).then(model => {
        if (model) return true;
        return false;
    });
}

// Lucjfer : get all controller is not exists in db
function getControllers(type, _id) {
    type = parseInt(type);
    let type_site = type === BE ? BE : FE;
    return Controller.find({ type: type_site }, { controller: 1, name: 1 }).then(controllers => {
        if (controllers.length > 0) {
            return Promise.all(controllers.map((controller) => {
                return isExistsController(controller.controller, type, _id).then(is_exists => {
                    if (!is_exists) return controller;
                    return null;
                });
            })).then(results => {
                results = uniq(results);
                results = results.filter(result => result);
                return results;
            });
        }
        return [];
    });
}

// Lucjfer : get all list role controller to set up for each website
function getAll() {
    return ControllerRole.find({}, { name: 1, list_controller: 1, sort: 1 });
}

module.exports = {
    ControllerRole, validateInput, search, getControllers, getAll
};
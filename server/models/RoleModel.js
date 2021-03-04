const mongoose = require('mongoose');
const { isEmpty, merge } = require("lodash");
const { FIELD_REQUIRED, FIELD_UNIQUE } = require('../config/Message');
const { convertUnicode, getFullTime } = require('../utils');
const {
    ROLE_DEFAULT, ROLE_SELL, ROLE_KITCHEN, STATUS_ACTIVE, SITE_FOOD
} = require('../config/Constant');
const { User } = require('./UserModel');
const { setRoleWebite } = require('./RoleAccessModel');
const { getAll } = require("./ControllerRoleModel");
const { getActions } = require("./ControllerModel");

const fields = {
    name: { type: String, require: true, trim: true },
    publish: { type: Number },
    created_at: { type: String },
    updated_at: { type: String }
};
const Role = mongoose.model('tbl_roles', fields);

function validateInput(model) {
    model.type = ROLE_DEFAULT;
    let errors = {};

    for (var field in fields) {
        if (!fields.hasOwnProperty(field)) continue;

        var obj = fields[field];
        for (var condition in obj) {
            if (!obj.hasOwnProperty(condition) || condition !== "require") continue;
            if (condition === 'require' &&
                (model[field] === undefined || model[field].toString().trim() === "")) {
                errors[field] = FIELD_REQUIRED;
            }
        }
    }

    if (isEmpty(model.parent_id)) {
        delete model.parent_id;
    }

    if (!model._id) {
        model.created_at = getFullTime();
        model.updated_at = getFullTime();
    } else {
        model.updated_at = getFullTime();
    }
    return uniqueName(model).then(is_exists => {
        if (is_exists) errors.name = FIELD_UNIQUE;
    }).then(() => {
        return {
            errors,
            isValid: isEmpty(errors)
        }
    });
}

// Lucjfer
function uniqueName(model) {
    if (!isEmpty(model.name)) {
        let condition = { name: model.name, website_id: model.website_id };
        if (!isEmpty(model._id)) {
            condition._id = { $ne: model._id };
        }

        return Role.findOne(condition);
    }

    return new Promise((resolve, reject) => {
        resolve(null);
    });
}

function search(data, cb) {
    let conditions = {};
    let sort = { _id: -1 };
    if (data.sort_by) {
        sort = { [data.sort_by.field]: data.sort_by.sort };
    }
    if (data.name && !isEmpty(data.name)) {
        let name = convertUnicode(data.name.trim());
        name = new RegExp(`${name}`, 'i');
        conditions.name = name;
    }

    let skip = 0;
    let per_page = parseInt(data.per_page);
    if (data.page) {
        skip = (parseInt(data.page) - 1) * per_page;
    }

    let opt = [
        {
            $match: conditions
        },
        {
            $sort: sort
        }
    ];

    opt.push({
        $facet: {
            models: [
                {
                    $skip: skip
                },
                {
                    $limit: per_page
                }
            ],
            total_rows: [
                {
                    $count: 'count'
                }
            ]
        }
    });

    return Role.aggregate(opt).then(results => {
        let models = [];
        let total = 0;
        if (results[0].models.length > 0) {
            models = results[0].models;
            total = results[0].total_rows[0].count;
        }
        return {
            success: true,
            models,
            total
        }
    });
}

// Lucjfer : generata all roles default for website when create new website
function generateRoles(website_id, type_site) {
    deleteRoles(website_id).then(is_del => {
        if (is_del) {
            let data = [{
                website_id: website_id,
                name: "Bán hàng",
                type: ROLE_SELL,
                status: STATUS_ACTIVE,
                created_at: getFullTime(),
                updated_at: getFullTime()
            }];
            if (type_site === SITE_FOOD) {
                data.push({
                    website_id: website_id,
                    name: "Nhà bếp",
                    type: ROLE_KITCHEN,
                    status: STATUS_ACTIVE,
                    created_at: getFullTime(),
                    updated_at: getFullTime()
                });
            }

            Role.insertMany(data, (error, docs) => {
                if (error) throw Error(error);
            });
        }
    });
}

// Lucjfer : delete all roles belong to website
function deleteRoles(website_id) {
    return Role.deleteMany({ website_id }).then(res => {
        if (res.ok) return true;
        return false;
    });
}

// Lucjfer: check id before delete
function checkDelete(_id) {
    return User.countDocuments({ role_id: _id }).then(count => {
        if (count === 0) {
            return Role.findById(_id, "type").then(role => {
                if (role.type === ROLE_DEFAULT) return true;
                return false;
            });
        }
        return false;
    });
}

// Lucjfer: check arr id before delete
function checkArrDelete(arr_id) {
    return Promise.all(arr_id.map(async (_id) => {
        return checkDelete(_id).then(is_del => {
            if (is_del) return _id;
            return null;
        });
    })).then(results => {
        return results;
    });
}

// Lucjfer : delete role of role
function deleteAllData(arr_id) {
    return Role.deleteMany({ role_id: { $in: arr_id } }).then(result => {
        return true;
    });
}

// Lucjfer
function generataRolesWebsite(website_id, type) {
    return getAll(type).then(async roles => {
        await Promise.all(roles.map(async (role) => {
            return await Promise.all(role.list_controller.map((controller) => {
                return getActions(controller).then(model => {
                    if (model) {
                        let temp = [];
                        model.list_action.forEach(action => {
                            temp.push(action.action);
                        });
                        return { [controller]: temp };
                    }
                    return {};
                });
            })).then(results => {
                let temp = {};
                results.forEach(result => {
                    temp = merge(temp, result);
                });
                return temp;
            });
        })).then(results => {
            let roles_website = {};
            results.forEach(result => {
                roles_website = merge(roles_website, result);
            });
            return setRoleWebite(website_id, roles_website);
        })
    });
}

module.exports = {
    Role, generateRoles, deleteRoles, search, validateInput, checkDelete, checkArrDelete, deleteAllData,
    generataRolesWebsite
};
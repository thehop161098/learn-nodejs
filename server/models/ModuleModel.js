const mongoose = require('mongoose');
const { isEmpty, merge } = require("lodash");
const { FIELD_REQUIRED } = require('../config/Message');
const { SITE_ALL, SITE_FOOD, SITE_SHOP, BE } = require('../config/Constant');
const { convertUnicode, getFullTime } = require('../utils/index');
const { RoleAccess } = require('./RoleAccessModel');

const fields = {
    type: { type: Number, require: true },
    position: { type: Number },
    // type_site: { type: String, require: true },
    parent_id: { type: mongoose.Schema.ObjectId },
    title: { type: String },
    name: { type: String, require: true },
    component: { type: String, trim: true },
    icon: { type: String, trim: true },
    link: { type: String, trim: true },
    publish: { type: Number },
    sort: { type: Number },
    created_at: { type: String },
    updated_at: { type: String }
};
const Module = mongoose.model('tbl_modules', fields);

function validateInput(model) {
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
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

function search(data, cb) {
    let conditions = { parent_id: { $exists: false } };
    let sort = { type: -1, sort: 1, _id: -1 };
    if (data.sort_by && data.sort_by.sort) {
        sort = { [data.sort_by.field]: data.sort_by.sort };
    }

    if (data.name && !isEmpty(data.name)) {
        let name = convertUnicode(data.name.trim());
        name = new RegExp(`${name}`, 'i');
        conditions.$or = [{ name: name }, { link: name }];
    }

    if (data.type && !isEmpty(data.type)) {
        let type = parseInt(data.type);
        conditions.type = type;
    }

    let skip = 0;
    let per_page = parseInt(data.per_page);
    if (data.page) {
        skip = (parseInt(data.page) - 1) * per_page;
    }

    let opt = [
        {
            $lookup: {
                from: "tbl_modules",
                let: { id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$parent_id", "$$id"],
                            }
                        }
                    },
                    {
                        $sort: sort
                    }
                ],
                as: "childs"
            }
        },
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

    return Module.aggregate(opt).then(results => {
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

// Lucjfer : get all module has no parent by type
function getModuleParents(type, type_site) {
    let conditions = { parent_id: null, type };
    if (type_site !== -1) {
        if (type_site === SITE_ALL) {
            conditions.type_site = type_site;
        } else if (type_site === SITE_FOOD || type_site === SITE_SHOP) {
            conditions.type_site = { $in: [type_site, SITE_ALL] };
        }
    }
    return Module.find(conditions, { name: 1 });
}

// Lucjfer: get sort max to set to new model
function getSortMax(type, parent_id = null) {
    return Module.find({ type, parent_id }, { sort: 1 }).sort({ sort: -1 });
}

// Lucjfer: check id before delete
function checkDelete(_id) {
    return Module.countDocuments({ parent_id: _id }).then(count => {
        if (count === 0) return true;
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

// Lucjfer: get All module is allow to access by role
async function getAllModules(type, role_id = null) {
    let conditions = { parent_id: null, type };
    let conditions_lookup_childs = {
        $expr: {
            $eq: ["$parent_id", "$$id"],
        }
    };
    let sort = { sort: 1, _id: -1 };

    if (role_id === null) {
        let opt = [
            {
                $lookup: {
                    from: "tbl_modules",
                    let: { id: "$_id" },
                    pipeline: [
                        { $match: conditions_lookup_childs },
                        { $sort: sort }
                    ],
                    as: "childs"
                }
            },
            { $match: conditions },
            { $sort: sort },
            {
                $project: {
                    name: 1,
                    position: 1,
                    icon: 1,
                    component: 1,
                    link: 1,
                    childs: 1,
                    publish: 1,
                    title: 1
                }
            }
        ];
        return Module.aggregate(opt).then(modules => {
            let arr_module = [];
            modules.forEach(row => {
                if (row.childs.length > 0 || row.component !== '') {
                    arr_module.push(row);
                }
            });
            return { modules: arr_module };
        });
    } else if (type === BE) {
        // find role of user
        return RoleAccess.find({}, { list_action: 1, controller: 1 }).then(async (roles) => {
            let results = {};
            if (roles.length > 0) {
                await Promise.all(roles.map(async (role) => {
                    const conditions = { role_id, controller: role.controller };
                    return RoleAccess.findOne(conditions, { list_action: 1, controller: 1 }).then(roles_user => {
                        let list_action = [];
                        if (roles_user) {
                            list_action = roles_user.list_action.filter(action => {
                                if (role.list_action.indexOf(action) !== -1) return true;
                                return false;
                            });
                        }
                        return { [role.controller]: list_action };
                    });
                })).then(roles => {
                    let new_roles = {};
                    roles.forEach(role => {
                        new_roles = merge(new_roles, role);
                    });
                    results.roles = new_roles;
                });

                let arr_controllers = [""];
                for (var controller in results.roles) {
                    if (results.roles.hasOwnProperty(controller)) {
                        if (results.roles[controller].length > 0) {
                            arr_controllers.push(controller);
                        }
                    }
                }
                conditions.component = { $in: arr_controllers };
                // conditions.childs = { $not: { $size: 0 } };
                conditions_lookup_childs.component = { $in: arr_controllers };
            }
            else results.roles = [];

            let opt = [
                {
                    $lookup: {
                        from: "tbl_modules",
                        let: { id: "$_id" },
                        pipeline: [
                            { $match: conditions_lookup_childs },
                            { $sort: sort }
                        ],
                        as: "childs"
                    }
                },
                { $match: conditions },
                { $sort: sort },
                {
                    $project: {
                        name: 1,
                        icon: 1,
                        component: 1,
                        link: 1,
                        childs: 1,
                        publish: 1,
                        title: 1
                    }
                }
            ];
            return Module.aggregate(opt).then(modules => {
                let arr_module = [];
                modules.forEach(row => {
                    if (row.childs.length > 0 || row.component !== '') {
                        arr_module.push(row);
                    }
                });
                results.modules = arr_module;
                return results;
            });
        });
    }
}

module.exports = {
    Module, validateInput, search, getModuleParents, getSortMax, checkArrDelete, getAllModules
};
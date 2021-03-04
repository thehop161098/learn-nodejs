const mongoose = require("mongoose");
const { sortBy } = require("lodash");
const { getFullTime } = require("../utils/index");
const { getAll } = require("./ControllerRoleModel");
const { Controller, getActions } = require("./ControllerModel");
const { BE, FE } = require("../config/Constant");

const fields = {
    role_id: { type: mongoose.Schema.ObjectId, require: true },
    controller: { type: String, require: true, trim: true },
    list_action: { type: Array, require: true },
    created_at: { type: String },
    updated_at: { type: String }
};
const RoleAccess = mongoose.model('tbl_role_access', fields, 'tbl_role_access');

// Lucjfer : get all action for each controller in roles website
function getRoleWebite(role_id, type) {
    return getAll(type).then(async (roles) => {
        if (roles.length > 0) {
            let new_roles = [];
            await Promise.all(roles.map(async (role) => {
                await Promise.all(role.list_controller.map((controller) => {
                    return getActions(controller, BE).then(model => {
                        if (model) {
                            let conditions = { controller, role_id };
                            return RoleAccess.findOne(conditions, { list_action: 1 }).then(role_selected => {
                                return {
                                    controller,
                                    name: model.name,
                                    list_action: model.list_action,
                                    list_action_selected: role_selected ? role_selected.list_action : []
                                };
                            });
                        }
                        return {};
                    });
                })).then(results => {
                    let temp_role = { ...role }._doc;
                    temp_role.controllers = results;
                    delete temp_role.list_controller;
                    new_roles.push(temp_role);
                });
            }));
            return sortBy(new_roles, "sort");
        };
    });
}

// Lucjfer : set role for website by controller
function setRoleWebite(role_id, roles) {
    let data = [];
    for (var controller in roles) {
        if (roles.hasOwnProperty(controller)) {
            var list_action = roles[controller];
            if (list_action.length > 0) {
                let temp = {
                    role_id,
                    controller,
                    list_action,
                    created_at: getFullTime()
                };
                if (role_id !== null) {
                    temp.role_id = role_id;
                }
                data.push(temp);
            }
        }
    }

    return RoleAccess.deleteMany({ role_id }).then(res => {
        if (res.ok) {
            return RoleAccess.insertMany(data).then(results => {
                return true;
            }).catch(err => {
                return false;
            });
        } else {
            return false;
        }
    });
}

// Lucjfer : get controller to set role for user in FE
function getRoles(role_id, website_id) {
    return RoleAccess.find({ website_id, role_id: null }, { list_action: 1, controller: 1 }).then(async (roles) => {
        if (roles.length > 0) {
            return await Promise.all(roles.map(async (role) => {
                return Controller.findOne({ controller: role.controller }, { name: 1, list_action: 1 })
                    .then(control => {
                        if (control) {
                            let list_action = control.list_action.filter(action => {
                                if (role.list_action.indexOf(action.action) !== -1) return true;
                                return false;
                            });
                            let conditions = { role_id, controller: role.controller };
                            return RoleAccess.findOne(conditions, { list_action: 1 }).then(role_selected => {
                                if (role_selected) {
                                    return role_selected.list_action;
                                }
                                return [];
                            }).then(list_action_selected => {
                                return {
                                    controller: role.controller,
                                    name: control.name,
                                    list_action,
                                    list_action_selected,
                                    selected: list_action_selected.length > 0 ? true : false
                                };
                            });
                        }
                        return {};
                    });
            })).then(results => {
                return {
                    success: true,
                    roles: results && results.length > 0 ? results : []
                };
            });
        }
    });
}

function deleteRolesWebsite(website_id) {
    return RoleAccess.deleteMany({ website_id }).then(res => {
        if (res.ok) return true;
        return false;
    });
}

module.exports = {
    RoleAccess, getRoleWebite, setRoleWebite, getRoles, deleteRolesWebsite
};
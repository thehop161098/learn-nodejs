const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isEmpty, size } = require("lodash");
const { FIELD_REQUIRED } = require('../config/Message');
const {
    convertUnicode, getFullTime, convertStringToMongoId, removeFile,
    getRoleUser, getTypeWebsite, getModule
} = require('../utils/index');
const {
    FE, USER_FE, ROLE_SELL, ADMIN_FE, BILL_COMPLETE, STATUS_EXPIRED,
    ROLE_KITCHEN, SITE_SHOP
} = require('../config/Constant');
const { jwt_secret } = require('../config/Config');
const { phoneValidate, emailValidate } = require("../validate/validate");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const config = require("../config/Config");

const fields = {
    role_id: { type: ObjectId },
    username: { type: String, trim: true },
    fullname: { type: String, trim: true, require: true },
    phone: { type: String, trim: true, require: true },
    email: { type: String, trim: true, require: true },
    address: { type: String, trim: true },
    password: { type: String, require: true, trim: true },
    salt: { type: String, require: true, trim: true },
    password_text: { type: String, require: true },
    publish: { type: Number },
    type: { type: Number },
    created_at: { type: String },
    updated_at: { type: String },
};

const User = mongoose.model('tbl_users', fields);

async function validateInput(model) {
    
    let errors = {};

    if (!model.repassword || !model.password) {
        errors.repassword = FIELD_REQUIRED;
    } else {
        if (model.repassword !== model.password) {
            errors.password = 'Mật khẩu không khớp nhau';
        } else {
            let salt = bcrypt.genSaltSync(config.lengthSalt);
            let hash = bcrypt.hashSync(model.password, salt);
            model.salt = salt;
            model.password_text = model.password;
            model.password = hash;
        }
    }

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

        // if (field === "role_id" && !model.is_admin &&
        //     (!model[field] || model[field] === "" || model[field] == null)) {
        //     errors[field] = FIELD_REQUIRED;
        // }
    }

    if (!model._id) {
        model.created_at = getFullTime();
        model.updated_at = getFullTime();
    } else {
        model.updated_at = getFullTime();
    }

    // if (!isEmpty(model.username)) {
    //     let conds_username = { username: model.username };
    //     if (!isEmpty(model._id)) {
    //         conds_username._id = { $ne: convertStringToMongoId(model._id) };
    //     }
    //     let is_username = await User.findOne(conds_username);
    //     if (!isEmpty(is_username)) {
    //         errors.username = 'Tài khoản này đã tồn tại.';
    //     }
    // }

    if (!isEmpty(model.email)) {
        let conds_email = { email: model.email };
        if (!isEmpty(model._id)) {
            conds_email._id = { $ne: convertStringToMongoId(model._id) };
        }
        let is_email = await User.findOne(conds_email);
        if (!emailValidate(model.email)) {
            errors.email = 'Email không đúng định dạng.';
        } else if (!isEmpty(is_email)) {
            errors.email = 'Email này đã tồn tại.';
        }
    }

    if (!isEmpty(model.phone)) {
        let conds_phone = { phone: model.phone };
        if (!isEmpty(model._id)) {
            conds_phone._id = { $ne: convertStringToMongoId(model._id) };
        }
        let is_phone = await User.findOne(conds_phone);
        if (!phoneValidate(model.phone)) {
            errors.phone = 'Số điện thoại không đúng định dạng.';
        } else if (!isEmpty(is_phone)) {
            errors.phone = 'Số điện thoại này đã tồn tại.';
        }
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

function search(data) {
    let conditions = { role_id: { $exists: true } };
    let sort = { _id: -1 };
    if (data.sort_by) {
        sort = { [data.sort_by.field]: data.sort_by.sort };
    }
    if (data.name && !isEmpty(data.name)) {
        let name = convertUnicode(data.name);
        name = new RegExp(`${name}`, 'i');
        conditions.$or = [{ fullname: name }, { phone: name }];
    }

    let skip = 0;
    let per_page = parseInt(data.per_page);
    if (data.page) skip = (parseInt(data.page) - 1) * per_page;

    let opt = [
        { $sort: sort },
        { $match: conditions },
    ];
    let opt_models = [...opt];
    opt_models = opt_models.concat([
        { $skip: skip },
        { $limit: per_page },
        {
            $lookup: {
                from: "tbl_roles",
                let: { role_id: "$role_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$role_id"] } } },
                    { $project: { _id: 0, name: 1 } },
                ],
                as: "role"
            }
        },
    ]);
    let opt_total = [...opt].concat([
        { $count: "count" }
    ]);

    return User.aggregate([
        {
            $facet: {
                models: opt_models,
                total_rows: opt_total
            }
        }
    ]).then(results => {
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

function checkLogin(phone, password, cb) {
    let errors = {};
    if (!phone || isEmpty(phone)) {
        errors.phone = 'Bạn chưa nhập số điện thoại';
    }
    if (!password || isEmpty(password)) {
        errors.password = 'Bạn chưa nhập mật khẩu';
    }

    if (isEmpty(errors)) {
        User.findOne({ "phone": phone }, (err, user) => {
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    const token = jwt.sign({
                        _id: user._id
                    }, jwt_secret);
                    cb({
                        // link: '',
                        success: true,
                        token
                    });
                } else {
                    cb({
                        success: false,
                        errors: { form: "Mật khẩu không đúng!" }
                    });
                }
            } else {
                cb({
                    success: false,
                    errors: { form: "Số điện thoại không tồn tại!" }
                });
            }
        });
    } else {
        cb({
            success: false,
            errors
        });
    }
}

function checkLoginFE(phone, password, cb) {
    let errors = {};
    if (!phone || isEmpty(phone)) {
        errors.phone = 'Bạn chưa nhập số điện thoại';
    }

    if (!password || isEmpty(password)) {
        errors.password = 'Bạn chưa nhập mật khẩu';
    }

    if (isEmpty(errors)) {
        User.findOne({ phone, type: FE }, async (err, user) => {
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    const token = jwt.sign({
                        _id: user._id
                    }, jwt_secret);
                    cb({
                        success: true,
                        // link,
                        user: {
                            fullname: user.fullname,
                            avatar: user.avatar
                        },
                        token
                    });
                } else {
                    cb({
                        success: false,
                        errors: { form: "Mật khẩu không đúng!" }
                    });
                }
            } else {
                cb({
                    success: false,
                    errors: { form: "Số điện thoại không tồn tại!" }
                });
            }
        });
    } else {
        cb({ success: false, errors });
    }
}

// Lucjfer : delete all user is belong to website
function deleteUsers(website_id) {
    return User.deleteMany({ website_id }).then(res => {
        if (res.ok) return true;
        return false;
    });
}

//Delete user Frontend
function checkDeleteFE(_id) {
    return User.countDocuments({ _id: null }).then(count => {
        if (count === 0) return true;
        return false;
    });
}
//DeleteALL user Frontend
function checkArrDeleteFE(arr_id) {
    return Promise.all(arr_id.map(async (_id) => {
        return checkDeleteFE(_id).then(is_del => {
            if (is_del) return _id;
            return null;
        });
    })).then(results => {
        return results;
    });
}
//Remove images
function removeImages(images) {
    removeFile(images);
}
function deleteAllData(arr_id) {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
}
async function deleteAll(arr_id) {
    return await Promise.all(arr_id.map(async (_id) => {
        return User.findByIdAndRemove(_id, { avatar: 1 }).then(model => {
            if (model) {
                removeImages(model.avatar);
            }
        });
    }));
}

module.exports = {
    User, validateInput, search, checkLogin, checkLoginFE, deleteUsers, checkDeleteFE,
    checkArrDeleteFE, removeImages, deleteAllData, deleteAll
};
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const QRCode = require('qrcode')
const isEmpty = require("lodash/isEmpty");
const { FIELD_REQUIRED } = require('../config/Message');
const { EMAIL_UPDATE_INFO } = require('../config/Constant');
const { DOMAIN } = require('../config/Config');
const { getSetting } = require('./SettingModel');
const {
    convertUnicode, getFullTime, convertStringToMongoId, formatNumber, convertDate, strtr
} = require('../utils');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const fields = {
    code: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    description: { type: String, require: true, trim: true },
    params: { type: String, trim: true },
    message: { type: String, require: true, trim: true },
    status: { type: Number },
    created_at: { type: String },
    updated_at: { type: String }
};
const Email = mongoose.model('tbl_email_template', fields, 'tbl_email_template');

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

    return uniqueCode(model).then(result => {
        if (!isEmpty(result)) {
            errors.code = 'Mã đã tồn tại.';
        }
    }).then(result => {
        return {
            errors,
            isValid: isEmpty(errors)
        }
    });
}

function uniqueCode(model) {
    if (!isEmpty(model.code)) {
        let condition = { code: model.code };
        let website_id = null;
        if (model.website_id) {
            website_id = model.website_id;
        }
        condition.website_id = website_id;
        if (!isEmpty(model._id)) {
            condition._id = { $ne: convertStringToMongoId(model._id) };
        }
        return Email.findOne(condition);
    }
    return new Promise((resolve, reject) => {
        resolve(null);
    });
}

function search(data) {
    let conditions = {};
    let sort = { _id: -1 };
    if (data.sort_by && data.sort_by.sort) {
        sort = { [data.sort_by.field]: data.sort_by.sort };
    }
    if (data.name && !isEmpty(data.name)) {
        let name = convertUnicode(data.name);
        name = new RegExp(`${name}`, 'i');
        conditions.$or = [{ name: name }, { code: name }];
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
    ]);
    let opt_total = [...opt].concat([
        { $count: "count" }
    ]);

    return Email.aggregate([
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

// Lucjfer
function generateEmail(website_id) {
    deleteEmail(website_id).then(is_del => {
        if (is_del) {
            Email.find({ website_id: null }).then(results => {
                if (results.length > 0) {
                    let data = [];
                    results.forEach(result => {
                        let temp = { ...result }._doc;
                        delete temp._id;
                        temp.website_id = website_id;
                        temp.created_at = temp.updated_at = getFullTime();
                        data.push(temp);
                    });
                    Email.insertMany(data, (error, docs) => {
                        if (error) throw Error(error);
                    });
                }
            });
        }
    })
}

// Lucjfer
function deleteEmail(website_id) {
    return Email.deleteMany({ website_id }).then(res => {
        if (res.ok) return true;
        return false;
    });
}

function logo(logo, width = '50') {
    if (logo && logo !== "") {
        width = width + 'px';
        const url = `${DOMAIN}/api/getImage?image=${logo}&width=${width}`;
        return `<img src="${url}" />`
    }
    return '';
}

// Lucjfer
function send(subject, message, to, config) {
    var transporter = nodemailer.createTransport({
        pool: true,
        host: config.smtp_host,
        port: 465,
        secure: true,
        auth: {
            user: config.smtp_user,
            pass: config.smtp_pass
        }
    });

    var mailOptions = {
        from: `${config.name} <${config.smtp_user}>`,
        to: to,
        subject: subject,
        html: message
    };
    transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));
    return transporter.sendMail(mailOptions).then(info => {
        return true;
    }).catch(function (err) {
        // console.log(err);
        return false;
    });
}

// Lucjfer
function sendEmail(code, data, to, config) {
    return Email.findOne({ code }).then(email => {
        if (email) {
            let message = strtr(email.message, data);
            if (config.logo && config.logo !== "") {
                message = message.replace("[logo]", config.logo)
            }
            if (config.qrCode && config.qrCode !== "") {
                message = message.replace("[qrCode]", config.qrCode)
            }
            return send(email.name, message, to, config);
        }
        return false;
    });
}

function sendEmailUpdateInfo(email, code) {
    return getSetting().then(setting => {
        if (setting) {
            const { pagesetting, email_config } = setting.values;
            let data = {
                '{CODE}': code,
            };
            const config = { ...email_config, logo: logo(pagesetting.logo) };
            return sendEmail(EMAIL_UPDATE_INFO, data, email, config);
        }
        return [];
    });
}

function sendEmailRegister(email, code) {
    return getSetting().then(setting => {
        if (setting) {
            const { email_config } = setting.values;
            const subject = "Đăng ký tài khoản";
            const message = 'Mã OTP kích hoạt tài khoản của bạn là: ' + code;
            const config = { ...email_config };
            return send(subject, message, email, config);
        }
        return false;
    });
}

function sendEmailForgetPass(email, url) {
    return getSetting().then(setting => {
        if (setting) {
            const { email_config } = setting.values;
            const subject = "Quên mật khẩu";
            const message = 'Nhấn vào link này để cập nhật lại mật khẩu của bạn: ' + url;
            const config = { ...email_config };
            return send(subject, message, email, config);
        }
        return false;
    });
}

module.exports = {
    Email, validateInput, search, generateEmail, deleteEmail, send,
    sendEmailRegister, sendEmailForgetPass, sendEmailUpdateInfo
};
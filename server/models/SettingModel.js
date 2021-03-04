const mongoose = require('mongoose');
const isEmpty = require("lodash/isEmpty");
const { FIELD_REQUIRED } = require('../config/Message');
const { removeFile, convertPrice } = require('../utils/index');

const fields = {
    values: { type: Object, require: true },
};

const settingDefineBE = {
    pagesetting: {
        label: 'Website',
        icon: 'fa fa-globe',
        items: {
            logo: { name: 'Logo', type: 'file', value: '' },
            title_page: { name: 'Tiêu đề trang web', type: 'text', value: '' },
            copyright: { name: 'Copyright', type: 'text', value: '' },
        }
    },
    contact: {
        label: 'Liên hệ',
        icon: 'fa fa-info-circle',
        items: {
            title: { name: 'Tiêu đề', type: 'text', value: '' },
            company: { name: 'Tên công ty', type: 'text', value: '' },
            address: { name: 'Địa chỉ', type: 'text', value: '' },
            email: { name: 'Email', type: 'text', value: '' },
            phone: { name: 'Điện thoại', type: 'text', value: '' },
        }
    },
    social: {
        label: 'Mạng xã hội',
        icon: 'fa fa-list',
        items: {
            facebook: { name: 'Facebook', type: 'text', value: '' },
        }
    },
    email_config: {
        label: 'Email',
        icon: 'fa fa-envelope',
        items: {
            name: { name: 'Tên đại diện', type: 'text', value: '' },
            admin_email: { name: 'Admin email', type: 'text', value: '' },
            protocol: {
                name: 'Giao thức',
                type: 'dropdown',
                value: 'smtp',
                data: [
                    { key: 'smtp', value: 'Smtp' },
                    { key: 'sendmail', value: 'Sendmail' },
                    { key: 'mail', value: 'Mail' }
                ]
            },
            smtp_host: { name: 'SMTP host', type: 'text', value: '' },
            smtp_user: { name: 'SMTP user', type: 'text', value: '' },
            smtp_pass: { name: 'SMTP pass', type: 'password', value: '' },
            smtp_port: { name: 'SMPT port', type: 'text', value: '' },
            smtp_crypto: {
                name: 'SMTP crypto',
                type: 'dropdown',
                value: 'ssl',
                data: [
                    { key: 'ssl', value: 'ssl' },
                    { key: 'tls', value: 'tls' }
                ]
            },
            test_send_mail: { name: 'Kiểm tra gửi email', btn_name: 'Gửi', type: 'button' },
        }
    },
    services: {
        label: 'Dịch vụ',
        icon: 'fa fa-list',
        items: {
            // background_service: { name: 'Background', type: 'file', value: '' },
            right_img_service: { name: 'Hình sidebar', type: 'file', value: '' },
        }
    },
    download: {
        label: 'Download',
        icon: 'fa fa-download',
        items: {
            title: { name: 'Tiêu đề', type: 'text', value: '' },
            des: { name: 'Mô tả', type: 'text', value: '' },
            background: { name: 'Background', type: 'file', value: '' },
            right_img: { name: 'Hình sidebar', type: 'file', value: '' },
            link_android: { name: 'Đường dẫn Android', type: 'text', value: '' },
            img_android: { name: 'Hình Android', type: 'file', value: '' },
            link_ios: { name: 'Đường dẫn ios', type: 'text', value: '' },
            img_ios: { name: 'Hình ios', type: 'file', value: '' }
        }
    }
};

const Setting = mongoose.model('tbl_settings', fields);

async function validateInput(model) {
    let errors = {};
    for (var key in model) {
        if (!model.hasOwnProperty(key)) continue;
        var fields = JSON.parse(model[key]);
        for (const field in fields) {
            const elm = fields[field];
            if (elm.required && !elm.value) {
                errors[field] = FIELD_REQUIRED;
            }
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

function setValues(data, images = {}, arr_logo_old = {}) {
    let result = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const fields = JSON.parse(data[key]);
            result[key] = {};
            for (const field in fields) {
                if (fields.hasOwnProperty(field) && field !== "test_send_mail") {
                    const elm = fields[field];
                    let value = elm.value;
                    if (arr_logo_old[field] !== "" && value === "") {
                        removeImage(arr_logo_old[field]);
                    }
                    if (images[field]) {
                        value = images[field];
                    }
                    if (elm.number) {
                        value = convertPrice(value, elm.format);
                    }
                    result[key][field] = value;
                }
            }
        }
    }
    return { values: result };
}

function removeImage(image) {
    removeFile(image);
}

function search() {
    return Setting.findOne().then(setting => {
        let state_default = { ...settingDefineBE };
        if (setting) {
            const values = setting.values;
            for (const key in state_default) {
                if (state_default.hasOwnProperty(key)) {
                    let fields = state_default[key].items;
                    for (const field in fields) {
                        if (fields.hasOwnProperty(field)) {
                            let elm = fields[field];
                            const model = { ...values[key] };
                            state_default[key].items[field] = { ...elm, value: model[field] }
                        }
                    }
                }
            }
        }

        return state_default;
    });
}

// Lucjfer : delete all data belong to website
function deleteSettings() {
    return Setting.deleteMany().then(res => {
        if (res.ok) return true;
        return false;
    });
}

function getSetting() {
    return Setting.findOne({}, { values: 1 });
}


module.exports = {
    Setting, search, validateInput, deleteSettings, setValues, getSetting
};
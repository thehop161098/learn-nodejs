const mongoose = require("mongoose");
const { isEmpty } = require("lodash");
const { FIELD_REQUIRED } = require("../config/Message");
const {
    getFullTime
} = require("../utils/index");
const { Currency } = require("./CurrencyModel");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const fields = {
    user_id: { type: ObjectId, require: true },
    currency_id: { type: ObjectId, require: true },
    created_at: { type: String },
    updated_at: { type: String }
};
const SetCurrency = mongoose.model('tbl_setting_currencys', fields);

async function validateInput(model) {
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

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

function getSettingCurrency(user_id) {
    return SetCurrency.findOne({ user_id: user_id }).then(unit => {
        if (unit) {
            return Currency.findOne({ _id: unit.currency_id }, { name: 1 })
        }
        return {name:'VND'};
    });
}


module.exports = {
    SetCurrency, validateInput, getSettingCurrency
};
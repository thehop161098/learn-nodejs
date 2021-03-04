const mongoose = require("mongoose");
const { isEmpty } = require("lodash");
const { FIELD_REQUIRED, FIELD_EXISTS } = require("../config/Message");
const {
    convertUnicode, getFullTime, convertStringToMongoId, convertPrice, getRevenue
} = require("../utils/index");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const fields = {
    user_id: { type: ObjectId },
    code: { type: String, require: true },
    name: { type: String, require: true },
    price_first: { type: Number, require: true },
    price_curr: { type: Number, require: true },
    publish: { type: Number },
    created_at: { type: String },
    updated_at: { type: String }
};
const Bank = mongoose.model('tbl_banks', fields);

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
    if (!isEmpty(model.price_first)) {
        let price_first = convertPrice(model.price_first, '');
        if (price_first < 0) {
            errors.price_first = 'Không nhập số âm.';
        }
    }
    if (!isEmpty(model.price_curr)) {
        let price_curr = convertPrice(model.price_curr, '');
        if (price_curr < 0) {
            errors.price_curr = 'Không nhập số âm.';
        }
    }

    if (!model._id) {
        model.created_at = getFullTime();
        model.updated_at = getFullTime();
    } else {
        model.updated_at = getFullTime();
    }
    return uniqueCode(model).then(is_exists => {
        if (is_exists) errors.code = FIELD_EXISTS;
        return {
            errors,
            isValid: isEmpty(errors)
        }
    });
}


function uniqueCode(model) {
    if (!isEmpty(model.code)) {
        let condition = { code: model.code, user_id: model.user_id };
        if (!isEmpty(model._id)) {
            condition._id = { $ne: convertStringToMongoId(model._id) };
        }
        return Bank.findOne(condition);
    }
    return new Promise((resolve, reject) => {
        resolve(null);
    });
}

function search(data) {
    let conditions = { user_id: data.user_id };
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

    return Bank.aggregate([
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

function resetMoney(bank_id, money, typeReven) {
    return Bank.findById(bank_id, { price_curr: 1 }).then(bank => {
        if (bank) {
            let new_current;
            if (typeReven === 'thu') {
                new_current = bank.price_curr - money;
            } else {
                new_current = bank.price_curr + money;
            }
            return Bank.updateOne({ _id: bank._id }, { price_curr: new_current }).then(() => true);
        }
        return false;
    });
}

function calMoney(bank_id, money, typeReven) {
    money = convertPrice(money);
    return Bank.findById(bank_id, { price_curr: 1 }).then(bank => {
        if (bank) {
            let new_current;
            if (typeReven === 'thu') {
                new_current = bank.price_curr + money;
            } else {
                new_current = bank.price_curr - money;
            }
            return Bank.updateOne({ _id: bank._id }, { price_curr: new_current }).then(() => true);
        }
        return false;
    });
}
// Thế Hợp---- trừ cộng tiền
async function calMoneyBank(bank_take, money, bank_move, fee) {
    money = convertPrice(money);
    await Bank.findById(bank_move, { price_curr: 1 }).then(bank_m => {
        if (bank_m) {
            let new_current_m = bank_m.price_curr - money - fee;
            return Bank.updateOne({ _id: bank_m._id }, { price_curr: new_current_m }).then(() => true);
        }
        return false;
    });
    await Bank.findById(bank_take, { price_curr: 1 }).then(bank_t => {
        if (bank_t) {
            let new_current_t = bank_t.price_curr + money;
            return Bank.updateOne({ _id: bank_t._id }, { price_curr: new_current_t }).then(() => true);
        }
        return false;
    });
}
// Thế Hợp---- trừ cộng tiền
async function resetMoneyBank(bank_take, money, bank_move, fee) {
    money = convertPrice(money);
    fee = convertPrice(fee);
    await Bank.findById(bank_move, { price_curr: 1 }).then(bank_m => {
        if (bank_m) {
            let new_current_m = bank_m.price_curr + money + fee;
            return Bank.updateOne({ _id: bank_m._id }, { price_curr: new_current_m }).then(() => true);
        }
        return false;
    });
    await Bank.findById(bank_take, { price_curr: 1 }).then(bank_t => {
        if (bank_t) {
            let new_current_t = bank_t.price_curr - money;
            return Bank.updateOne({ _id: bank_t._id }, { price_curr: new_current_t }).then(() => true);
        }
        return false;
    });
}
async function checkDelete(_id) {
    return getRevenue(_id);
}

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

function deleteOne(_id) {
    return Bank.findByIdAndRemove(_id, { image: 1 }).then(model => {
        if (model) {
            return true;
        }
        return false;
    });
}

async function deleteAll(arr_id) {
    return await Promise.all(arr_id.map(async (_id) => {
        return deleteOne(_id);
    })).then(results => {
        return results.reduce((rst, elm) => {
            return elm ? rst + 1 : rst;
        }, 0);
    });
}

function getAllMoney(user_id) {
    return Bank.aggregate([
        { $match: { user_id } },
        {
            $group: {
                _id: 0,
                total: { $sum: '$price_curr' }
            }
        }
    ]).then(result => {
        if (result[0]) return result[0].total;
        return 0;
    })
}

module.exports = {
    Bank, validateInput, search, resetMoney, calMoney, checkDelete, checkArrDelete,
    deleteOne, deleteAll, getAllMoney, calMoneyBank, resetMoneyBank
};
const mongoose = require("mongoose");
const { isEmpty } = require("lodash");
const { Bank, resetMoney } = require("./BankModel");
const { FIELD_REQUIRED } = require("../config/Message");
const {
    convertUnicode, getFullTime, convertDate, convertDateTo,
    getDateOfMonth, convertStringToMongoId, convertPrice
} = require("../utils/index");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const fields = {
    parent_id: { type: ObjectId },
    user_id: { type: ObjectId },
    name: { type: String, require: true },
    price: { type: Number, require: true },
    typeReven: { type: String, require: true },
    bank_id: { type: ObjectId, require: true },
    publish: { type: Number },
    custome_date: { type: String },
    created_at: { type: String },
    updated_at: { type: String }
};
const Revenue = mongoose.model('tbl_revenue', fields);

async function validateInput(model, old_model = null) {
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
    if (model) {
        let price = convertPrice(model.price);
        if (price <= 0) {
            errors.price = 'Giá phải lớn hơn 0.';
        }
    }
    if (model) {
        model.custome_date = convertDate(model.custome_date, 'YYYY-MM-DD HH:mm:ss');
    }

    if (!model._id) {
        model.created_at = getFullTime();
        model.updated_at = getFullTime();
    } else {
        model.updated_at = getFullTime();
    }

    if (!errors.price && model.typeReven === 'chi') {
        await checkMoney(model, old_model).then(rst => {
            if (!rst.success) {
                errors.price = rst.message;
            }
        })
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

async function checkMoney(model, old_model) {
    if (model.bank_id) {
        return Bank.findById(model.bank_id, { price_curr: 1 }).then(bank => {
            if (bank) {
                let price = convertPrice(model.price);
                let current_bank = bank.price_curr;
                if (old_model) {
                    if (old_model.typeReven === 'chi') {
                        current_bank += old_model.price;
                    } else {
                        current_bank -= old_model.price;
                    }
                }
                if (price > current_bank) {
                    return { success: false, message: 'Ví không đủ tiền' };
                }
                return { success: true };
            }
            return { success: false, message: 'Không tìm thấy ví' };
        });
    }
    return { success: true };
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
        conditions.name = name;
    }
    if (data.typeReven && !isEmpty(data.typeReven)) {
        let name = convertUnicode(data.typeReven);
        name = new RegExp(`${name}`, 'i');
        conditions.typeReven = name;
    }
    if (data.bank_id && data.bank_id !== "") {
        conditions.bank_id = convertStringToMongoId(data.bank_id);
    }
    ////
    let start;
    let end;
    if (data.startDate && !isEmpty(data.startDate) && data.endDate && !isEmpty(data.endDate)) {
        start = convertDateTo(data.startDate, "DD/MM/YYYY", "YYYY-MM-DD 00:00:00");
        end = convertDateTo(data.endDate, "DD/MM/YYYY", "YYYY-MM-DD 23:59:59");
    } else {
        start = getDateOfMonth("YYYY-MM-01 00:00:00");
        end = getDateOfMonth("YYYY-MM-31 23:59:59");
    }
    conditions.custome_date = { $gte: start, $lte: end };
    ///
    let skip = 0;
    let per_page = parseInt(data.per_page);
    if (data.page) skip = (parseInt(data.page) - 1) * per_page;
    let opt = [
        { $sort: sort },
        { $match: conditions },
        // {
        //     $lookup: {
        //         from: 'tbl_banks',
        //         localField: 'bank_id',
        //         foreignField: '_id',
        //         as: 'banks'
        //     }
        // },
        {
            $lookup: {
                from: "tbl_banks",
                let: { bank_id: "$bank_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$bank_id"],
                            }
                        }
                    },
                    { $project: { _id: 0, name: 1 } }
                ],
                as: "banks"
            }
        },
        {
            $unwind: "$banks"
        },
    ];
    ///////
    let opt_models = [...opt];
    opt_models = opt_models.concat([
        { $skip: skip },
        { $limit: per_page },
    ]);
    let opt_total = [...opt].concat([
        { $count: "count" }
    ]);

    return Revenue.aggregate([
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

function searchDashboard(data) {
    let conditions = { user_id: data.user_id };
    let sort = { _id: -1 };
    if (data.sort_by && data.sort_by.sort) {
        sort = { [data.sort_by.field]: data.sort_by.sort };
    }
    if (data.name && !isEmpty(data.name)) {
        let name = convertUnicode(data.name);
        name = new RegExp(`${name}`, 'i');
        conditions.name = name;
    }
    ///
    let skip = 0;
    let per_page = parseInt(data.per_page);
    if (data.page) skip = (parseInt(data.page) - 1) * per_page;
    let opt = [
        { $sort: sort },
        { $match: conditions },
        {
            $lookup: {
                from: "tbl_banks",
                let: { bank_id: "$bank_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$bank_id"],
                            }
                        }
                    },
                    { $project: { _id: 0, name: 1 } }
                ],
                as: "banks"
            }
        },
        {
            $unwind: "$banks"
        },
    ];
    ///////
    let opt_models = [...opt];
    opt_models = opt_models.concat([
        { $skip: skip },
        { $limit: per_page },
    ]);
    let opt_total = [...opt].concat([
        { $count: "count" }
    ]);

    return Revenue.aggregate([
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



function deleteOne(_id) {
    return Revenue.findByIdAndRemove(_id).then(model => {
        if (model) {
            return resetMoney(model.bank_id, model.price, model.typeReven).then(() => {
                return true;
            });
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

module.exports = {
    Revenue, validateInput, search, searchDashboard, deleteAll
};
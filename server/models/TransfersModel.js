const mongoose = require("mongoose");
const { isEmpty } = require("lodash");
const { Bank } = require("./BankModel");
const { FIELD_REQUIRED } = require("../config/Message");
const {
    convertUnicode, getFullTime, convertPrice, convertStringToMongoId, convertDate,
    convertDateTo, getDateOfMonth
} = require("../utils/index");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const fields = {
    user_id: { type: ObjectId },
    bank_take: { type: ObjectId, require: true },
    bank_move: { type: ObjectId, require: true },
    price: { type: Number, require: true },
    fee: { type: Number },
    reason: { type: String },
    custome_date: { type: String },
    created_at: { type: String },
    updated_at: { type: String }
};
const Transfers = mongoose.model('tbl_transfers', fields);

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
    ///Thế Hợp----format ngay
    if (model.custome_date) {
        model.custome_date = convertDate(model.custome_date, 'YYYY-MM-DD HH:mm:ss');
    }
    ///Thế Hợp----format price
    if (model.price) {
        model.price = convertPrice(model.price);
    }
    if (model.price < 0) {
        errors.price = 'Giá không được âm.';
    }
    ///Thế Hợp----check phí
    if (model.fee) {
        model.fee = convertPrice(model.fee);
    }
    if (model.fee < 0) {
        errors.fee = 'Phí không được âm.';
    }
    if (model.fee === '') {
        model.fee = 0;
    }
    ///Thế Hợp----check ví khác nhau
    if (model.bank_take !== "" && model.bank_move !== "" && model.bank_take === model.bank_move) {
        errors.bank_move = 'Vui lòng chọn 2 ví khác nhau';
    }

    if (!model._id) {
        model.created_at = getFullTime();
        model.updated_at = getFullTime();
    } else {
        model.updated_at = getFullTime();
    }

    if (!errors.price) {
        await checkMoney(model).then(rst => {
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
// Thế Hợp----checkmoney
async function checkMoney(model) {
    let model_old = null;
    if (model._id) model_old = await Transfers.findById(model._id);
    if (model.bank_move) {
        return Bank.findById(model.bank_move, { price_curr: 1 }).then(bank_move => {
            if (bank_move) {
                let price = convertPrice(model.price);
                let current_bank_move = bank_move.price_curr;
                if (model_old) {
                    if (model_old.bank_take.toString() === model.bank_move.toString()) {
                        current_bank_move -= model_old.price;
                    } else if (model_old.bank_move.toString() === model.bank_move.toString()) {
                        current_bank_move += model_old.price;
                    }
                }
                if (price > current_bank_move) {
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
        name = name.trim();
        name = new RegExp(`${name}`, 'i');
        conditions.$or = [{ name: name }, { code: name }];
    }
    if (data.bank_take && data.bank_take !== "") {
        conditions.bank_take = convertStringToMongoId(data.bank_take);
    }
    if (data.bank_move && data.bank_move !== "") {
        conditions.bank_move = convertStringToMongoId(data.bank_move);
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
        {
            $lookup: {
                from: "tbl_banks",
                let: { bank_take: "$bank_take" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$bank_take"],
                            }
                        }
                    },
                    { $project: { _id: 0, name: 1 } }
                ],
                as: "bank_take"
            }
        },
        {
            $unwind: "$bank_take"
        },
        {
            $lookup: {
                from: "tbl_banks",
                let: { bank_move: "$bank_move" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$bank_move"],
                            }
                        }
                    },
                    { $project: { _id: 0, name: 1 } }
                ],
                as: "bank_move"
            }
        },
        {
            $unwind: "$bank_move"
        },
    ];
    let opt_models = [...opt];
    opt_models = opt_models.concat([
        { $skip: skip },
        { $limit: per_page },
    ]);
    let opt_total = [...opt].concat([
        { $count: "count" }
    ]);

    return Transfers.aggregate([
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


async function checkDelete(_id) {
    return true;
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
    return Transfers.findByIdAndRemove(_id, { image: 1 }).then(model => {
        if (model) {
            return model;
        }
        return null;
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
    Transfers, validateInput, search,
    deleteOne, deleteAll, checkArrDelete, checkDelete
};
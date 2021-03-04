const mongoose = require("mongoose");
const { isEmpty } = require("lodash");
const { FIELD_REQUIRED, FIELD_EXISTS } = require("../config/Message");
const {
    convertUnicode, getFullTime, convertStringToMongoId
} = require("../utils/index");

const fields = {
    name: { type: String, require: true },
    created_at: { type: String },
    updated_at: { type: String }
};
const Currency = mongoose.model('tbl_currencys', fields);

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
    return uniqueName(model).then(is_exists => {
        if (is_exists) errors.name = FIELD_EXISTS;
        return {
            errors,
            isValid: isEmpty(errors)
        }
    });
}


function uniqueName(model) {
    if (!isEmpty(model.name)) {
        let condition = { name: model.name, user_id: model.user_id };
        if (!isEmpty(model._id)) {
            condition._id = { $ne: convertStringToMongoId(model._id) };
        }
        return Currency.findOne(condition);
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
        name = name.trim();
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

    return Currency.aggregate([
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

function getAllCurrency() {
    return Currency.find();
}



// async function checkDelete(_id) {
//     return getRevenue(_id);
// }

// function checkArrDelete(arr_id) {
//     return Promise.all(arr_id.map(async (_id) => {
//         return checkDelete(_id).then(is_del => {
//             if (is_del) return _id;
//             return null;
//         });
//     })).then(results => {
//         return results;
//     });
// }

// function deleteOne(_id) {
//     return Currency.findByIdAndRemove(_id, { image: 1 }).then(model => {
//         if (model) {
//             return true;
//         }
//         return false;
//     });
// }

// async function deleteAll(arr_id) {
//     return await Promise.all(arr_id.map(async (_id) => {
//         return deleteOne(_id);
//     })).then(results => {
//         return results.reduce((rst, elm) => {
//             return elm ? rst + 1 : rst;
//         }, 0);
//     });
// }


module.exports = {
    Currency, validateInput, search, getAllCurrency
};
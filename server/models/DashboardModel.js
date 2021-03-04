const mongoose = require("mongoose");
const { isEmpty } = require("lodash");
const { Revenue } = require("../models/RevenueModel");
const { Bank } = require("../models/BankModel");

const { getFullTime, convertDate, convertDateTo } = require("../utils/index");

///Tổng thu hôm nay
function getTotalRevenue(user_id, date) {
    var date_new = convertDate(date);
    let start_date = date_new + ' 00:00:00';
    let end_date = date_new + '23:59:59';
    return Revenue.find({
        'typeReven': 'thu',
        'user_id': user_id,
        'custome_date': { $gte: start_date, $lte: end_date }
    });

}
///Tổng chi hôm nay
function getTotalExpenditure(user_id, date) {
    var date_new = convertDate(date);
    let start_date = date_new + ' 00:00:00';
    let end_date = date_new + '23:59:59';
    return Revenue.find({
        'typeReven': 'chi',
        'user_id': user_id,
        'custome_date': { $gte: start_date, $lte: end_date }
    });

}
///Tổng thu tháng này
function getTotalMonthRevenue(user_id, start_date, end_date) {
    let start_date_cv = convertDateTo(start_date, "DD/MM/YYYY", "YYYY-MM-DD");
    let end_date_cv = convertDateTo(end_date, "DD/MM/YYYY", "YYYY-MM-DD");
    let start_date_new = start_date_cv + ' 00:00:00';
    let end_date_new = end_date_cv + ' 23:59:59';
    return Revenue.find({
        'typeReven': 'thu',
        'user_id': user_id,
        'custome_date': { $gte: start_date_new, $lte: end_date_new }
    });

}
///Tổng chi tháng này
function getTotalMonthExpenditure(user_id, start_date, end_date) {
    let start_date_cv = convertDateTo(start_date, "DD/MM/YYYY", "YYYY-MM-DD");
    let end_date_cv = convertDateTo(end_date, "DD/MM/YYYY", "YYYY-MM-DD");
    let start_date_new = start_date_cv + ' 00:00:00';
    let end_date_new = end_date_cv + ' 23:59:59';
    return Revenue.find({
        'typeReven': 'chi',
        'user_id': user_id,
        'custome_date': { $gte: start_date_new, $lte: end_date_new }
    });

}
//Lấy tất cả Bank
function getAllBank(user_id) {
    return Bank.find({
        'user_id': user_id,
    });

}
function getDataChart(user_id) {
    let conditions = {
        custome_date: {
            $gte: getFullTime('YYYY-01-01 00:00:00'),
            $lte: getFullTime('YYYY-12-31 23:59:59')
        },
        user_id
    };
    let opt = [
        { $match: conditions },
        {
            $addFields: {
                month: {
                    $month: { $toDate: "$custome_date" }
                },
            }
        },
        {
            $group: {
                _id: {
                    month: '$month',
                    typeReven: '$typeReven'
                },
                month: { $first: '$month' },
                price: { $sum: '$price' }
            }
        },
        { $sort: { month: 1 } }
    ];

    return Revenue.aggregate(opt);
}
module.exports = {
    getTotalRevenue, getTotalExpenditure, getTotalMonthRevenue,
    getTotalMonthExpenditure, getDataChart, getAllBank
};
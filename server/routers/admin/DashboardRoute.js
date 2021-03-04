const express = require("express");
const { 
    getTotalRevenue, getTotalExpenditure, getTotalMonthRevenue,
    getTotalMonthExpenditure, getDataChart, getAllBank
} = require("../../models/DashboardModel");
const { searchDashboard } = require("../../models/RevenueModel");
// const {
//     MESSAGE_ADD_ERROR, MESSAGE_ADD_SUCCESSFUL, MESSAGE_DATA_EMPTY,
//     MESSAGE_DEL_SUCCESSFUL, MESSAGE_DEL_ERROR, MESSAGE_DEL_EMPTY,
//     MESSAGE_EDIT_SUCCESSFUL, MESSAGE_EDIT_ERROR
// } = require("../../config/Message");

const router = express.Router();
const { authorization } = require("../../utils/index");

router.post('/', authorization, (req, res) => {
    let user_id = req.userCurrent._id;
    const data = req.body;
    data.user_id = user_id;
    searchDashboard(data).then(results => {
        res.send(results);
    });
});

///Tổng thu hôm nay
router.post('/getTotalRevenue', authorization, (req, res) => {
    let data = req.body;
    let user_id = req.userCurrent._id;
    getTotalRevenue(user_id, data.date).then(totals => {
        res.send({ success: true, totals });
    });
});
///Tổng chi hôm nay
router.post('/getTotalExpenditure', authorization, (req, res) => {
    let data = req.body;
    let user_id = req.userCurrent._id;
    getTotalExpenditure(user_id, data.date).then(totals => {
        res.send({ success: true, totals });
    });
});
///Tổng thu tháng này
router.post('/getTotalMonthRevenue', authorization, (req, res) => {
    let data = req.body;
    let user_id = req.userCurrent._id;
    getTotalMonthRevenue(user_id, data.start_date, data.end_date).then(totals => {
        res.send({ success: true, totals });
    });
});
///Tổng chi tháng này
router.post('/getTotalMonthExpenditure', authorization, (req, res) => {
    let data = req.body;
    let user_id = req.userCurrent._id;
    getTotalMonthExpenditure(user_id, data.start_date, data.end_date).then(totals => {
        res.send({ success: true, totals });
    });
});
///Biểu đồ
router.get('/getDataChart', authorization, (req, res) => {
    let user_id = req.userCurrent._id;
    getDataChart(user_id).then(models => {
        res.send({ success: true, models });
    });
});
///Get All Bank
router.get('/getAllBank', authorization, (req, res) => {
    let user_id = req.userCurrent._id;
    getAllBank(user_id).then(models => {
        res.send({ success: true, models });
    });
});

module.exports = router;
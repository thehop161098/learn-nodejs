const express = require("express");
const { isEmpty } = require("lodash");
const { getAllModules } = require("../../models/ModuleModel");
const { getAllCurrency, Currency } = require("../../models/CurrencyModel");
const { authorization, getResizeImg, authorizaFE } = require("../../utils");
const { BE, FE } = require('../../config/Constant');
const { User } = require("../../models/UserModel");
const { SetCurrency, validateInput, getSettingCurrency } = require("../../models/SetCurrencyModel");
const { getAllMoney } = require("../../models/BankModel");
const { getSetting } = require("../../models/SettingModel");
const { MESSAGE_DATA_EMPTY, MESSAGE_EDIT_SUCCESSFUL, MESSAGE_EDIT_ERROR } = require("../../config/Message");
const router = express.Router();

router.get('/getAllModulesBE', authorization, (req, res) => {
    let role_id = req.userCurrent.role_id ? req.userCurrent.role_id : null;
    getAllModules(BE, role_id).then(modules => {
        const is_admin = req.userCurrent.role_id ? false : true;
        const fullname = req.userCurrent.username ? req.userCurrent.username : '';
        getAllMoney(req.userCurrent._id).then(total => {
            getAllCurrency().then(currency => {
                getSettingCurrency(req.userCurrent._id).then(unit => {
                    res.send({ success: true, routers: modules, is_admin, fullname, total, currency, unit: unit.name, unit_id: unit._id });
                });
            });
        });
    });
});

router.get('/getAllModulesFE', authorizaFE, (req, res) => {
    getAllModules(FE).then(modules => {
        getSetting().then(setting_model => {
            let setting = {};
            if (setting_model) setting = setting_model.values;
            res.send({
                success: true,
                routers: modules,
                setting,
                fullname: req.userCurrent ? req.userCurrent.name : '',
            });
        });
    });
});

router.get('/getImage', (req, res) => {
    const { image, width, height } = req.query;
    res.type(`image/png`);
    const height_img = height ? parseInt(height) : null;
    getResizeImg(image, parseInt(width), height_img).pipe(res);
});

router.get('/getListUsers', authorization, (req, res) => {
    User.find({}, { username: 1, fullname: 1 })
        .then(models => res.send({ success: true, models }))
        .catch(error => res.send({ success: false, models: [], message: MESSAGE_DATA_EMPTY }));
});


router.get('/getUser', authorizaFE, (req, res) => {
    if (req.userCurrent) {
        return res.json({ success: true, model: req.userCurrent })
    }
    return res.json({ success: false })
});

// Thế hợp lưu setCurrency
router.post('/add', authorization, (req, res) => {
    let user_id = req.userCurrent._id;
    const data = req.body;
    data.user_id = user_id;
    validateInput(data).then(({ errors, isValid }) => {
        if (isValid) {
            SetCurrency.findOne({ user_id: user_id }).then(rsl => {
                if (isEmpty(rsl)) {
                    const model = new SetCurrency(data);
                    model.save().then(newModel => {
                        if (newModel) {
                            Currency.findOne({ _id: model.currency_id }, { name: 1 }).then(unit => {
                                res.send({ success: true, message: MESSAGE_EDIT_SUCCESSFUL, model: newModel, unit: unit.name, unit_id: unit._id })
                            })
                        }
                    })
                        .catch(error => res.send({ success: false, message: MESSAGE_EDIT_ERROR, errors: error }));
                } else {
                    SetCurrency.findByIdAndUpdate(rsl._id, data, { new: true })
                        .then(model => {
                            if (model) {
                                Currency.findOne({ _id: model.currency_id }, { name: 1 }).then(unit => {
                                    res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL, unit: unit.name, unit_id: unit._id });
                                })
                            }
                        })
                        .catch(error => {
                            res.send({ success: false, message: MESSAGE_EDIT_ERROR });
                        });
                }
            })
        } else {
            res.json({
                success: false,
                errors: errors,
                message: MESSAGE_EDIT_ERROR
            });
        }
    });
});

module.exports = router;
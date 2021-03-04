const express = require("express");
const {
    Transfers, search, validateInput, checkDelete, deleteOne, checkArrDelete,
    deleteAll
} = require("../../models/TransfersModel");
const { Bank, calMoneyBank, resetMoneyBank, getAllMoney } = require("../../models/BankModel");
const { Revenue } = require("../../models/RevenueModel");
const { authorization, getFullTime } = require("../../utils/index");
const {
    MESSAGE_ADD_ERROR, MESSAGE_ADD_SUCCESSFUL,
    MESSAGE_EDIT_SUCCESSFUL, MESSAGE_EDIT_ERROR,
    MESSAGE_DATA_EMPTY, MESSAGE_DEL_EMPTY,
    MESSAGE_DEL_SUCCESSFUL, MESSAGE_DEL_BLOCK
} = require("../../config/Message");

const router = express.Router();

router.post('/', authorization, (req, res) => {
    let user_id = req.userCurrent._id;
    const data = req.body;
    data.user_id = user_id;
    search(data).then(results => {
        res.send(results);
    });
});

//Thế Hợp---- lấy tất cả bank
router.get('/getBanks', authorization, (req, res) => {
    let user_id = req.userCurrent._id;
    Bank.find({ user_id: user_id }).then(banks => {
        res.send({ success: true, banks });
    });
});

router.post('/add', authorization, (req, res) => {
    let user_id = req.userCurrent._id;
    const data = req.body;
    data.user_id = user_id;
    validateInput(data).then(({ errors, isValid }) => {
        if (isValid) {
            delete data._id;
            const model = new Transfers(data);
            model.save().then(async newModel => {
                if (newModel) {
                    if (newModel.fee > 0) {
                        Bank.findById(newModel.bank_move, { name: 1 }).then(name_move => {
                            Bank.findById(newModel.bank_take, { name: 1 }).then(name_take => {
                                if (name_move && name_take) {
                                    let nameMove = name_move.name;
                                    let nameTake = name_take.name;
                                    const revenue_data = {
                                        "name": "Phí chuyển từ ví " + nameMove + " sang " + nameTake,
                                        "price": newModel.fee,
                                        "typeReven": "chi",
                                        "bank_id": newModel.bank_move,
                                        "bank_move": newModel.bank_move,
                                        "custome_date": newModel.custome_date,
                                        "publish": 1,
                                        "parent_id": newModel._id,
                                        "user_id": user_id,
                                        "created_at": getFullTime(),
                                        "updated_at": getFullTime(),
                                    };
                                    new Revenue(revenue_data).save();
                                }
                            });
                        });
                    }
                    await calMoneyBank(newModel.bank_take, newModel.price, newModel.bank_move, newModel.fee);
                    getAllMoney(user_id).then(total => {
                        res.send({ success: true, message: MESSAGE_ADD_SUCCESSFUL, total });
                    });
                }
            }).catch(error => res.send({ success: false, message: MESSAGE_ADD_ERROR }));
        } else {
            res.json({
                success: false,
                errors: errors,
                message: MESSAGE_ADD_ERROR
            });
        }
    });
});

router.get('/:_id', authorization, (req, res) => {
    Transfers.findById(req.params._id)
        .then(model => res.send({ success: true, model }))
        .catch(error => res.send({ success: false, message: MESSAGE_DATA_EMPTY }));
});

router.put('/:_id', authorization, async (req, res) => {
    const data = req.body;
    const old_model = await Transfers.findById(data._id);
    validateInput(data).then(async result => {
        const { errors, isValid } = result;
        if (isValid) {
            delete data._id;
            await resetMoneyBank(old_model.bank_take, old_model.price, old_model.bank_move, old_model.fee);
            Transfers.findByIdAndUpdate(req.params._id, data, { new: true })
                .then(async model => {
                    await calMoneyBank(model.bank_take, model.price, model.bank_move, model.fee);
                    await Revenue.deleteOne({ parent_id: model._id }).then();
                    if (model.fee > 0) {
                        Bank.findById(model.bank_move, { name: 1 }).then(name_move => {
                            Bank.findById(model.bank_take, { name: 1 }).then(name_take => {
                                if (name_move && name_take) {
                                    let nameMove = name_move.name;
                                    let nameTake = name_take.name;
                                    const revenue_data = {
                                        "name": "Phí chuyển từ ví " + nameMove + " sang " + nameTake,
                                        "price": model.fee,
                                        "typeReven": "chi",
                                        "bank_id": model.bank_move,
                                        "bank_move": model.bank_move,
                                        "custome_date": model.custome_date,
                                        "publish": 1,
                                        "parent_id": model._id,
                                        "user_id": req.userCurrent._id,
                                        "created_at": getFullTime(),
                                        "updated_at": getFullTime(),
                                    };
                                    new Revenue(revenue_data).save();
                                }
                            });
                        });
                    }
                    getAllMoney(req.userCurrent._id).then(total => {
                        res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL, total });
                    });
                })
                .catch(error => {
                    res.send({ success: false, message: MESSAGE_EDIT_ERROR });
                });
        } else {
            res.json({
                success: false,
                errors: errors,
                message: MESSAGE_EDIT_ERROR
            });
        }
    });
});

router.delete('/:_id', authorization, (req, res) => {
    //kiểm tra phần tử con trước khi xóa.
    checkDelete(req.params._id).then(is_del => {
        if (is_del) {
            deleteOne(req.params._id).then(async del => {
                if (!del) {
                    return res.json({
                        success: false,
                        message: MESSAGE_DEL_EMPTY
                    });
                } else {
                    await resetMoneyBank(del.bank_take, del.price, del.bank_move, del.fee);
                    await Revenue.deleteOne({ parent_id: del._id }).then();
                    getAllMoney(req.userCurrent._id).then(total => {
                        res.send({
                            success: true,
                            message: MESSAGE_DEL_SUCCESSFUL,
                            total
                        });
                    });
                }
            })
        } else {
            res.send({ success: false, message: MESSAGE_DEL_BLOCK });
        }
    });
});


router.post("/deleteAll", authorization, (req, res) => {
    const data = req.body;
    if (data.length > 0) {
        return checkArrDelete(data).then(arr_id => {
            if (arr_id.length > 0) {
                return deleteAll(arr_id).then(deletedCount => {
                    if (deletedCount === 0) {
                        return res.send({
                            success: false,
                            message: MESSAGE_DEL_EMPTY
                        });
                    } else {
                        return res.send({
                            success: true,
                            message: MESSAGE_DEL_SUCCESSFUL,
                        });
                    }
                });
            }
            return res.send({
                success: false,
                message: MESSAGE_DEL_BLOCK
            });
        });
    }
    res.send({
        success: false,
        message: MESSAGE_DEL_EMPTY
    });
});

router.post("/changeField", authorization, (req, res) => {
    const data = req.body;
    Transfers.findByIdAndUpdate(data._id, { [data.field]: data.value }, { new: true })
        .then(model => {
            res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL });
        })
        .catch(error => res.send({ success: false, message: MESSAGE_EDIT_ERROR }));
});





module.exports = router;
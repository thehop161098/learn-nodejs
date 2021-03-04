const express = require("express");
//const isEmpty = require("lodash/isEmpty");
const { Revenue, validateInput, search, deleteAll } = require("../../models/RevenueModel");
const { Bank, resetMoney, calMoney, getAllMoney } = require("../../models/BankModel");
const {
    MESSAGE_ADD_ERROR, MESSAGE_ADD_SUCCESSFUL, MESSAGE_DATA_EMPTY,
    MESSAGE_DEL_SUCCESSFUL, MESSAGE_DEL_ERROR, MESSAGE_DEL_EMPTY,
    MESSAGE_EDIT_SUCCESSFUL, MESSAGE_EDIT_ERROR
} = require("../../config/Message");

const router = express.Router();
const { authorization, convertPrice, convertUnicode } = require("../../utils/index");

router.post('/', authorization, (req, res) => {
    let user_id = req.userCurrent._id;
    const data = req.body;
    data.user_id = user_id;
    search(data).then(results => {
        res.send(results);
    });
});

router.get('/getBankParents', authorization, (req, res) => {
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
            data.price = convertPrice(data.price, '');
            const model = new Revenue(data);
            model.save().then(async newModel => {
                if (newModel) {
                    await calMoney(newModel.bank_id, newModel.price, newModel.typeReven);
                    getAllMoney(user_id).then(total => {
                        res.send({ success: true, message: MESSAGE_ADD_SUCCESSFUL, total });
                    });
                }
            }).catch(error => res.send({ success: false, message: MESSAGE_ADD_ERROR }));
        } else {
            res.send({
                success: false,
                errors: errors,
                message: MESSAGE_ADD_ERROR
            });
        }
    });
});

router.delete('/:_id', authorization, (req, res) => {
    Revenue.findByIdAndRemove(req.params._id).then(async model => {
        if (!model) {
            res.send({
                success: false,
                message: MESSAGE_DEL_EMPTY
            });
        } else {
            await resetMoney(model.bank_id, model.price, model.typeReven);
            getAllMoney(req.userCurrent._id).then(total => {
                res.send({
                    success: true,
                    total,
                    message: MESSAGE_DEL_SUCCESSFUL
                });
            });
        }
    }).catch(error => res.send({ success: false, message: MESSAGE_DEL_ERROR }));
});

router.get('/:_id', authorization, (req, res) => {
    Revenue.findById(req.params._id)
        .then(model => res.send({ success: true, model }))
        .catch(error => res.send({ success: false, message: MESSAGE_DATA_EMPTY }));;
});

router.put('/:_id', authorization, async (req, res) => {
    const data = req.body;

    const old_model = await Revenue.findById(data._id);
    validateInput(data, old_model).then(async result => {
        const { errors, isValid } = result;

        if (isValid) {
            delete data._id;
            data.price = convertPrice(data.price);
            await resetMoney(old_model.bank_id, old_model.price, old_model.typeReven);
            Revenue.findByIdAndUpdate(req.params._id, data, { new: true })
                .then(async model => {
                    await calMoney(model.bank_id, model.price, model.typeReven);
                    getAllMoney(req.userCurrent._id).then(total => {
                        res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL, total });
                    });
                })
                .catch(error => res.send({ success: false, message: MESSAGE_EDIT_ERROR }));
        } else {
            res.send({
                success: false,
                errors: errors,
                message: MESSAGE_ADD_ERROR
            });
        }
    });
});

router.post('/deleteAll', authorization, (req, res) => {
    const data = req.body;

    if (data.length > 0) {
        return deleteAll(data).then(deletedCount => {
            if (deletedCount === 0) {
                return res.send({
                    success: false,
                    message: MESSAGE_DEL_EMPTY
                });
            }
            getAllMoney(req.userCurrent._id).then(total => {
                res.send({
                    success: true,
                    total,
                    message: MESSAGE_DEL_SUCCESSFUL
                });
            });
        });
    }
});

router.post("/changeField", authorization, (req, res) => {
    const data = req.body;
    Revenue.findByIdAndUpdate(data._id, { [data.field]: data.value }, { new: true })
        .then(model => {
            res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL });
        })
        .catch(error => res.send({ success: false, message: MESSAGE_EDIT_ERROR }));
});

router.post("/getAutoComplete", authorization, (req, res) => {
    const data = req.body;
    let name = convertUnicode(data.value.trim());
    name = new RegExp(`${name}`, 'i');
    Revenue.distinct('name', { name }).then(autocompletes => {
        res.send({ success: true, autocompletes });
    });
});


module.exports = router;
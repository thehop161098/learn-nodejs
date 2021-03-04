const express = require("express");
const {
    Bank, validateInput, search, checkDelete, checkArrDelete, deleteOne, deleteAll, getAllMoney
} = require("../../models/BankModel");
const {
    MESSAGE_ADD_ERROR, MESSAGE_ADD_SUCCESSFUL, MESSAGE_DATA_EMPTY,
    MESSAGE_DEL_SUCCESSFUL, MESSAGE_DEL_EMPTY,
    MESSAGE_EDIT_SUCCESSFUL, MESSAGE_EDIT_ERROR, MESSAGE_DEL_BLOCK
} = require("../../config/Message");

const router = express.Router();
const { authorization, convertPrice } = require("../../utils/index");

router.post('/', authorization, (req, res) => {
    let user_id = req.userCurrent._id;
    const data = req.body;
    data.user_id = user_id;
    search(data).then(results => {
        res.send(results);
    });
});

router.post('/add', authorization, (req, res) => {
    let user_id = req.userCurrent._id;
    const data = req.body;
    data.user_id = user_id;
    validateInput(data).then(result => {
        const { errors, isValid } = result;
        if (isValid) {
            delete data._id;
            data.price_first = convertPrice(data.price_first, '');
            data.price_curr = data.price_first;
            const model = new Bank(data);
            model.save().then(newModel => {
                if (newModel) {
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
    //kiểm tra phần tử con trước khi xóa.
    checkDelete(req.params._id).then(is_del => {
        if (is_del) {
            deleteOne(req.params._id).then(del => {
                if (!del) {
                    return res.json({
                        success: false,
                        message: MESSAGE_DEL_EMPTY
                    });
                }
                getAllMoney(req.userCurrent._id).then(total => {
                    return res.json({
                        success: true,
                        message: MESSAGE_DEL_SUCCESSFUL,
                        total
                    });
                });

            })
        } else {
            res.send({ success: false, message: MESSAGE_DEL_BLOCK });
        }
    });
});

router.get('/:_id', authorization, (req, res) => {
    Bank.findById(req.params._id)
        .then(model => res.send({ success: true, model }))
        .catch(error => res.send({ success: false, message: MESSAGE_DATA_EMPTY }));;
});

router.put('/:_id', authorization, (req, res) => {
    const data = req.body;

    validateInput(data).then(result => {
        const { errors, isValid } = result;

        if (isValid) {
            delete data._id;
            data.price_curr = convertPrice(data.price_curr);
            Bank.findByIdAndUpdate(req.params._id, data, { new: true })
                .then(model => {
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
                    }
                    getAllMoney(req.userCurrent._id).then(total => {
                        return res.send({
                            success: true,
                            message: MESSAGE_DEL_SUCCESSFUL,
                            total
                        });
                    });
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
    Bank.findByIdAndUpdate(data._id, { [data.field]: data.value }, { new: true })
        .then(model => {
            res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL });
        })
        .catch(error => res.send({ success: false, message: MESSAGE_EDIT_ERROR }));
});

module.exports = router;
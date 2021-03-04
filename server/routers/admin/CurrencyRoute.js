const express = require("express");
const {
    Currency, search, validateInput
} = require("../../models/CurrencyModel");
const { authorization } = require("../../utils/index");
const {
    MESSAGE_ADD_ERROR, MESSAGE_ADD_SUCCESSFUL,
    MESSAGE_EDIT_SUCCESSFUL, MESSAGE_EDIT_ERROR,
    MESSAGE_DATA_EMPTY, MESSAGE_DEL_EMPTY,
    MESSAGE_DEL_SUCCESSFUL, MESSAGE_DEL_ERROR
} = require("../../config/Message");

const router = express.Router();

router.post('/', authorization, (req, res) => {
    const data = req.body;
    search(data).then(results => {
        res.send(results);
    });
});

router.post('/add', authorization, (req, res) => {
    const data = req.body;
    validateInput(data).then(({ errors, isValid }) => {
        if (isValid) {
            delete data._id;
            const model = new Currency(data);
            model.save()
                .then(newModel => res.send({ success: true, message: MESSAGE_ADD_SUCCESSFUL, model: newModel }))
                .catch(error => res.send({ success: false, message: MESSAGE_ADD_ERROR, errors: error }));
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
    Currency.findById(req.params._id)
        .then(model => res.send({ success: true, model }))
        .catch(error => res.send({ success: false, message: MESSAGE_DATA_EMPTY }));
});

router.put('/:_id', authorization, (req, res) => {
    const data = req.body;
    validateInput(data).then(({ errors, isValid }) => {
        if (isValid) {
            delete data._id;
            Currency.findByIdAndUpdate(req.params._id, data, { new: true })
                .then(model => {
                    res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL });
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
    Currency.findByIdAndRemove(req.params._id).then(model => {
        if (!model) {
            res.send({
                success: false,
                message: MESSAGE_DEL_EMPTY
            });
        } else {
            res.send({
                success: true,
                message: MESSAGE_DEL_SUCCESSFUL
            });
        }
    }).catch(error => res.send({ success: false, message: MESSAGE_DEL_ERROR }));
});



router.post('/deleteAll', authorization, (req, res) => {
    const data = req.body;

    if (data.length > 0) {
        Currency.deleteMany({ _id: { $in: data } }).then(result => {
            if (result.deletedCount === 0) {
                res.send({
                    success: false,
                    message: MESSAGE_DEL_EMPTY
                });
            } else {
                res.send({
                    success: true,
                    message: MESSAGE_DEL_SUCCESSFUL
                });
            }
        }).catch(error => res.send({ success: false, message: MESSAGE_DEL_ERROR }));
    } else {
        res.send({
            success: false,
            message: MESSAGE_DEL_EMPTY
        });
    }
});

router.post("/changeField", authorization, (req, res) => {
    const data = req.body;
    Currency.findByIdAndUpdate(data._id, { [data.field]: data.value }, { new: true })
        .then(model => {
            res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL });
        })
        .catch(error => res.send({ success: false, message: MESSAGE_EDIT_ERROR }));
});

module.exports = router;
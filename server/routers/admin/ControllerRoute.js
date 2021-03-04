const express = require("express");
const isEmpty = require("lodash/isEmpty");
const {
    Controller, validateInput, search, getControllers
} = require("../../models/ControllerModel");
const {
    MESSAGE_ADD_ERROR, MESSAGE_ADD_SUCCESSFUL, MESSAGE_DATA_EMPTY,
    MESSAGE_DEL_SUCCESSFUL, MESSAGE_DEL_ERROR, MESSAGE_DEL_EMPTY, MESSAGE_DEL_BLOCK,
    MESSAGE_EDIT_SUCCESSFUL, MESSAGE_EDIT_ERROR
} = require("../../config/Message");

const router = express.Router();
const { convertStringToMongoId, authorization } = require("../../utils/index");

router.post('/', authorization, (req, res) => {
    const data = req.body;
    search(data, (results) => {
        res.send(results);
    });
});

router.get('/getControllers/:type', authorization, (req, res) => {
    const { type } = req.params;
    if (type) {
        getControllers(parseInt(type), controllers => {
            res.send({ success: true, controllers });
        });
    } else {
        res.send({ success: false, message: MESSAGE_DATA_EMPTY });
    }
});

router.post('/add', authorization, (req, res) => {
    const data = req.body;
    validateInput(data).then(result => {
        const { errors, isValid } = result;
        if (isValid) {
            delete data._id;
            const model = new Controller(data);
            model.save().then(newModel => {
                if (newModel) {
                    res.send({ success: true, message: MESSAGE_ADD_SUCCESSFUL });
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
    Controller.findByIdAndRemove(req.params._id).then(model => {
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

router.get('/:_id', authorization, (req, res) => {
    Controller.findById(req.params._id)
        .then(model => res.send({ success: true, model }))
        .catch(error => res.send({ success: false, message: MESSAGE_DATA_EMPTY }));;
});

router.put('/:_id', authorization, (req, res) => {
    const data = req.body;

    validateInput(data).then(result => {
        const { errors, isValid } = result;

        if (isValid) {
            delete data._id;
            Controller.findByIdAndUpdate(req.params._id, data, { new: true })
                .then(model => {
                    res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL });
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
        Controller.deleteMany({ _id: { $in: data } }).then(result => {
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

module.exports = router;
const express = require("express");
const isEmpty = require("lodash/isEmpty");
const {
    Module, validateInput, search, getModuleParents, checkArrDelete
} = require("../../models/ModuleModel");
const { Controller } = require("../../models/ControllerModel");
const {
    MESSAGE_ADD_ERROR, MESSAGE_ADD_SUCCESSFUL, MESSAGE_DATA_EMPTY,
    MESSAGE_DEL_SUCCESSFUL, MESSAGE_DEL_ERROR, MESSAGE_DEL_EMPTY,
    MESSAGE_EDIT_SUCCESSFUL, MESSAGE_EDIT_ERROR, MESSAGE_DEL_BLOCK
} = require("../../config/Message");
const { authorization } = require("../../utils/index");

const router = express.Router();

router.post('/', authorization, (req, res) => {
    const data = req.body;
    search(data).then(results => {
        res.send(results);
    });
});

router.get("/getModuleParents/:type/:type_site", authorization, (req, res) => {
    const { type, type_site } = req.params;

    if (type && type_site) {
        getModuleParents(parseInt(type), type_site).then(parents => {
            if (!parents) {
                parents = [];
            }
            res.send({ success: true, parents });
        }).catch(error => res.send({ success: false }));
    } else {
        res.json({ success: true, message: MESSAGE_DATA_EMPTY });
    }
});

router.get('/getControllers/:type', authorization, (req, res) => {
    const { type } = req.params;
    Controller.find({ type: parseInt(type) }, { controller: 1, name: 1 }).then(controllers => {
        res.send({ success: true, controllers });
    });
});

router.post('/add', authorization, (req, res) => {
    const data = req.body;
    const { errors, isValid } = validateInput(data)
    if (isValid) {
        delete data._id;
        const model = new Module(data);

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

router.delete('/:_id', authorization, (req, res) => {
    //kiểm tra phần tử con trước khi xóa.
    Module.countDocuments({ parent_id: req.params._id }).then(count => {
        if (count === 0) {
            Module.findByIdAndRemove(req.params._id)
                .then(model => {
                    if (!model) {
                        res.json({
                            success: false,
                            message: MESSAGE_DEL_EMPTY
                        });
                    }
                    res.json({
                        success: true,
                        message: MESSAGE_DEL_SUCCESSFUL
                    });
                })
                .catch(error => res.send({ success: false, message: MESSAGE_DEL_ERROR }));
        } else {
            res.send({ success: false, message: MESSAGE_DEL_ERROR });
        }
    });
});

router.get('/:_id', authorization, (req, res) => {
    Module.findById(req.params._id)
        .then(model => res.send({ success: true, model }))
        .catch(error => res.send({ success: false, message: MESSAGE_DATA_EMPTY }));;
});

router.put('/:_id', authorization, (req, res) => {
    const data = req.body;
    const { errors, isValid } = validateInput(data);

    if (isValid) {
        delete data._id;
        if (isEmpty(data.parent_id)) {
            data.$unset = { parent_id: "" };
        }
        Module.findByIdAndUpdate(req.params._id, data, { new: true })
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

router.post("/deleteAll", authorization, (req, res) => {
    const data = req.body;
    if (data.length > 0) {
        checkArrDelete(data).then(arr_id => {
            if (arr_id.length > 0) {
                Module.deleteMany({ _id: { $in: arr_id } }).then(result => {
                    if (result.deletedCount === 0) {
                        res.send({
                            success: false,
                            message: MESSAGE_DEL_EMPTY
                        });
                    }
                    res.send({
                        success: true,
                        message: MESSAGE_DEL_SUCCESSFUL
                    });
                }).catch(error => res.send({ success: false, message: MESSAGE_DEL_ERROR }));
            } else {
                res.send({
                    success: false,
                    message: MESSAGE_DEL_BLOCK
                });
            }
        });
    } else {
        res.send({
            success: false,
            message: MESSAGE_DEL_EMPTY
        });
    }
});

router.post("/changeField", authorization, (req, res) => {
    const data = req.body;
    Module.findByIdAndUpdate(data._id, { [data.field]: data.value }, { new: true })
        .then(model => {
            res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL });
        })
        .catch(error => res.send({ success: false, message: MESSAGE_EDIT_ERROR }));
});

module.exports = router;
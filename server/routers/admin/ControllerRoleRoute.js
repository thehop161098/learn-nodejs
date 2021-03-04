const express = require("express");
const {
    ControllerRole, validateInput, search, getControllers
} = require("../../models/ControllerRoleModel");
const {
    MESSAGE_ADD_ERROR, MESSAGE_ADD_SUCCESSFUL, MESSAGE_DATA_EMPTY,
    MESSAGE_DEL_SUCCESSFUL, MESSAGE_DEL_ERROR, MESSAGE_DEL_EMPTY,
    MESSAGE_EDIT_SUCCESSFUL, MESSAGE_EDIT_ERROR
} = require("../../config/Message");

const router = express.Router();
const { authorization } = require("../../utils/index");

router.post('/', authorization, (req, res) => {
    const data = req.body;
    search(data, (results) => {
        res.send(results);
    });
});

router.get('/getControllers/:type/:_id', authorization, (req, res) => {
    const { type, _id } = req.params;
    getControllers(type, _id).then(controllers => {
        res.send({ success: true, controllers });
    });
});

router.post('/add', authorization, (req, res) => {
    const data = req.body;
    validateInput(data).then(result => {
        const { errors, isValid } = result;
        if (isValid) {
            delete data._id;
            const model = new ControllerRole(data);
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
    ControllerRole.findByIdAndRemove(req.params._id).then(model => {
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
    ControllerRole.findById(req.params._id)
        .then(model => res.send({ success: true, model }))
        .catch(error => res.send({ success: false, message: MESSAGE_DATA_EMPTY }));;
});

router.put('/:_id', authorization, (req, res) => {
    const data = req.body;

    validateInput(data).then(result => {
        const { errors, isValid } = result;

        if (isValid) {
            delete data._id;
            ControllerRole.findByIdAndUpdate(req.params._id, data, { new: true })
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
        ControllerRole.deleteMany({ _id: { $in: data } }).then(result => {
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

router.get('/changeOrder/:_id/:sort', authorization, (req, res) => {
    const { _id, sort } = req.params;
    if (_id && sort !== undefined) {
        ControllerRole.findByIdAndUpdate(_id, { sort }, { new: true })
            .then(model => res.send({ success: true, message: MESSAGE_EDIT_SUCCESSFUL, model }))
            .catch(error => res.send({ success: false, message: MESSAGE_DATA_EMPTY }));
    } else {
        res.send({ success: false, message: MESSAGE_DATA_EMPTY })
    }
});

module.exports = router;
const express = require("express");
const isEmpty = require("lodash/isEmpty");
const { User, validateInput, search } = require("../../models/UserModel");
const {
    MESSAGE_ADD_ERROR, MESSAGE_ADD_SUCCESSFUL, MESSAGE_DATA_EMPTY,
    MESSAGE_DEL_SUCCESSFUL, MESSAGE_DEL_ERROR, MESSAGE_DEL_EMPTY,
    MESSAGE_EDIT_SUCCESSFUL, MESSAGE_EDIT_ERROR
} = require("../../config/Message");
const { ADMIN_FE } = require("../../config/Constant");
const { Role } = require("../../models/RoleModel");
const { authorization } = require("../../utils/index");
const router = express.Router();

router.post('/', (req, res) => {
    const data = req.body;
    search(data).then(results => {
        res.send(results);
    });
});

router.post('/add', authorization, (req, res) => {
    let data = { ...req.body };
    data.is_admin = false;
    validateInput(data).then(result => {
        const { errors, isValid } = result;
        if (isValid) {
            delete data._id;
            delete data.repassword;

            if (!data.area_id) {
                delete data.area_id;
            } else {
                var arrayArea = data.area_id.split('-');
                data.area_id = arrayArea[0];
            }
            if (!data.ward_id) { delete data.ward_id; }
            const model = new User(data);
            model.save()
                .then(newModel => res.send({ success: true, message: MESSAGE_ADD_SUCCESSFUL, model: newModel }))
                .catch(error => res.send({ success: false, message: MESSAGE_ADD_ERROR }));
        } else {
            res.json({
                success: false, errors: errors, message: MESSAGE_ADD_ERROR
            });
        }
    });
});

router.get('/getRoles', authorization, (req, res) => {
    Role.find({}, { name: 1 }).then(model => res.json({ success: true, model }))
        .catch(error => res.send({ success: false, message: MESSAGE_DATA_EMPTY }));
});

router.get('/getUser', authorization, (req, res) => {
    if (req.userCurrent)
        return res.json({ success: true, model: req.userCurrent });
    return res.json({ success: false, message: MESSAGE_DATA_EMPTY });
});

router.delete('/:_id', authorization, (req, res) => {
    User.findByIdAndRemove(req.params._id)
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
});

router.get('/:_id', authorization, (req, res) => {
    User.findById(req.params._id)
        .then(model => res.send({ success: true, model }))
        .catch(error => res.send({ success: false, message: MESSAGE_DATA_EMPTY }));
});
router.get('/getByCode/:code', authorization, (req, res) => {
    User.find({ code: req.params.code })
        .then(model => res.send({ success: true, model }))
        .catch(error => res.send({ success: false, message: MESSAGE_DATA_EMPTY }));
});

router.put('/:_id', authorization, (req, res) => {
    let data = { ...req.body };
    data.is_admin = false;

    if (req.userCurrent.type && req.userCurrent._id.toString() === data._id) {
        data.is_admin = true;
        delete data.role_id;
    }

    validateInput(data).then(result => {
        const { errors, isValid } = result;
        if (isValid) {
            delete data._id;
            User.findByIdAndUpdate(req.params._id, data, { new: true })
                .then(model => {
                    res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL });
                })
                .catch(error => res.send({ success: false, message: MESSAGE_EDIT_ERROR }));
        } else {
            res.json({
                success: false,
                errors: errors,
                message: MESSAGE_EDIT_ERROR
            });
        }
    });
});

router.put('/status/:_id/:status', authorization, (req, res) => {
    var status = req.params.status == 1 ? 0 : 1;
    User.findByIdAndUpdate(req.params._id, { $set: { status: status } }, { new: true })
        .then(model => {
            res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL });
        })
        .catch(error => res.send({ success: false, message: MESSAGE_EDIT_ERROR }));
});

router.post('/deleteAll', authorization, (req, res) => {
    const data = req.body;

    if (data.length > 0) {
        User.deleteMany({ _id: { $in: data } })
            .then(result => {
                if (result.deletedCount === 0) {
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
        res.json({
            success: true,
            message: MESSAGE_DEL_EMPTY
        });
    }
});

router.post("/changeField", authorization, (req, res) => {
    const data = req.body;
    User.findByIdAndUpdate(data._id, { [data.field]: data.value }, { new: true })
        .then(model => res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL }))
        .catch(error => res.send({ success: false, message: MESSAGE_EDIT_ERROR }));
});

module.exports = router;
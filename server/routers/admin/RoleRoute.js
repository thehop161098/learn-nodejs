const express = require("express");
const {
    Role, validateInput, search, checkDelete, checkArrDelete, deleteAllData
} = require("../../models/RoleModel");
const { getRoleWebite, setRoleWebite } = require("../../models/RoleAccessModel");

const {
    MESSAGE_ADD_ERROR, MESSAGE_ADD_SUCCESSFUL, MESSAGE_DATA_EMPTY,
    MESSAGE_DEL_SUCCESSFUL, MESSAGE_DEL_ERROR, MESSAGE_DEL_EMPTY,
    MESSAGE_EDIT_SUCCESSFUL, MESSAGE_EDIT_ERROR, MESSAGE_DEL_BLOCK,
    MESSAGE_SET_ROLE_SUCCESSFUL, MESSAGE_SET_ROLE_ERROR
} = require("../../config/Message");
const router = express.Router();
const { authorization } = require("../../utils/index");

router.post('/', authorization, (req, res) => {
    const data = req.body;
    search(data).then(results => {
        res.send(results);
    });
});

router.post('/add', authorization, (req, res) => {
    let data = { ...req.body };
    validateInput(data).then(results => {
        const { errors, isValid } = results;

        if (isValid) {
            delete data._id;
            const model = new Role(data);
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

router.delete('/:_id', authorization, (req, res) => {
    //kiểm tra phần tử con trước khi xóa.
    checkDelete(req.params._id).then(is_del => {
        if (is_del) {
            deleteAllData([req.params._id]).then(is_done => {
                if (is_done) {
                    Role.findByIdAndRemove(req.params._id).then(model => {
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
                    }).catch(error => res.send({ success: false, message: MESSAGE_DEL_ERROR }));
                }
            });
        } else {
            res.send({ success: false, message: MESSAGE_DEL_ERROR });
        }
    });
});

router.get('/:_id', authorization, (req, res) => {
    Role.findById(req.params._id)
        .then(model => res.send({ success: true, model }))
        .catch(error => res.send({ success: false, message: MESSAGE_DATA_EMPTY }));;
});

router.put('/:_id', authorization, (req, res) => {
    const data = req.body;
    validateInput(data).then(results => {
        const { errors, isValid } = results;

        if (isValid) {
            delete data._id;
            Role.findByIdAndUpdate(req.params._id, data).then(model => {
                res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL });
            }).catch(error => {
                res.send({ success: false, message: MESSAGE_EDIT_ERROR });
            });
        } else {
            res.json({
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
        checkArrDelete(data).then(arr_id => {
            if (arr_id.length > 0) {
                deleteAllData(arr_id).then(is_done => {
                    Role.deleteMany({ _id: { $in: arr_id } }).then(result => {
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
                });
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
    Role.findByIdAndUpdate(data._id, { [data.field]: data.value }, { new: true })
        .then(model => res.send({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL }))
        .catch(error => res.send({ success: false, message: MESSAGE_EDIT_ERROR }));
});

router.get('/getRoles/:_id', authorization, (req, res) => {
    getRoleWebite(req.params._id).then(results => {
        const role_website = results ? results : [];
        res.send({ success: true, role_website });
    });
});

router.post('/setRoles', authorization, (req, res) => {
    const { _id, roles } = req.body;
    setRoleWebite(_id, roles).then(results => {
        if (results) {
            res.send({ success: true, message: MESSAGE_SET_ROLE_SUCCESSFUL })
        }
    }).catch(error => res.send({ success: false, message: MESSAGE_SET_ROLE_ERROR }));
});


module.exports = router;
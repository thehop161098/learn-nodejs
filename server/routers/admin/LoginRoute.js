const express = require("express");
const { checkLogin } = require("../../models/UserModel");
const {
    User, validateInput
} = require("../../models/UserModel");
const {
    MESSAGE_ADD_ERROR, MESSAGE_ADD_SUCCESSFUL
} = require("../../config/Message");
// const config = require("../../config/Config");
const router = express.Router();

router.post('/login', (req, res) => {
    // let salt = bcrypt.genSaltSync(config.lengthSalt);
    // let hash = bcrypt.hashSync("Midvn1234$", salt);

    const { phone, password } = req.body;
    checkLogin(phone, password, (result) => {
        res.json(result);
    });
});

router.post('/register', (req, res) => {
    const data = req.body;
    validateInput(data).then(result => {
        const { errors, isValid } = result;
        if (isValid) {
            delete data._id;
            const model = new User(data);
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
module.exports = router;
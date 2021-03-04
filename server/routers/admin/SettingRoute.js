const express = require("express");
const {
    Setting, search, validateInput, deleteSettings, setValues
} = require("../../models/SettingModel");
const { authorization } = require("../../utils");
const { MESSAGE_ADD_ERROR } = require("../../config/Message");
const { uploadFiles } = require("../../utils/index");
const { send } = require("../../models/EmailModel");
const router = express.Router();

router.get('/', authorization, (req, res) => {
    search().then(model => {
        res.send({ success: true, model });
    });
});

router.post('/add', (req, res) => {
    const data = req.body;
    delete data.logo;
    delete data.background;
    delete data.right_img;
    delete data.img_android;
    delete data.img_ios;
    delete data.background_service;
    delete data.right_img_service;
    validateInput(data).then(results => {
        const { errors, isValid } = results;
        if (isValid) {
            deleteSettings().then(async is_del => {
                if (is_del) {
                    const logo = req.files && req.files.logo ? req.files.logo : null;
                    const background = req.files && req.files.background ? req.files.background : null;
                    const right_img = req.files && req.files.right_img ? req.files.right_img : null;
                    const img_android = req.files && req.files.img_android ? req.files.img_android : null;
                    const img_ios = req.files && req.files.img_ios ? req.files.img_ios : null;
                    const background_service = req.files && req.files.background_service ? req.files.background_service : null;
                    const right_img_service = req.files && req.files.right_img_service ? req.files.right_img_service : null;
                    const arr_logo = await uploadFiles(req, 'settings', logo);
                    const arr_background = await uploadFiles(req, 'settings', background);
                    const arr_right_img = await uploadFiles(req, 'settings', right_img);
                    const arr_img_android = await uploadFiles(req, 'settings', img_android);
                    const arr_img_ios = await uploadFiles(req, 'settings', img_ios);
                    const arr_background_service = await uploadFiles(req, 'settings', background_service);
                    const arr_right_img_service = await uploadFiles(req, 'settings', right_img_service);
                    let images = {};
                    if (arr_logo.length > 0) images.logo = arr_logo[0];
                    if (arr_background.length > 0) images.background = arr_background[0];
                    if (arr_right_img.length > 0) images.right_img = arr_right_img[0];
                    if (arr_img_android.length > 0) images.img_android = arr_img_android[0];
                    if (arr_img_ios.length > 0) images.img_ios = arr_img_ios[0];
                    if (arr_background_service.length > 0) images.background_service = arr_background_service[0];
                    if (arr_right_img_service.length > 0) images.right_img_service = arr_right_img_service[0];
                    const model = new Setting(setValues(data, images));
                    model.save()
                        .then(newModel => res.send({ success: true, message: "Thành công" }))
                        .catch(error => res.send({ success: false, message: MESSAGE_ADD_ERROR }));
                } else {
                    res.send({ success: false, message: MESSAGE_ADD_ERROR });
                }
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

router.post('/sendEmail', authorization, (req, res) => {
    const { email_config } = req.body;
    if (email_config) {
        let config = {};
        for (const key in email_config) {
            if (email_config.hasOwnProperty(key)) {
                const obj = email_config[key];
                config[key] = obj.value;
            }
        }
        send("Kiểm tra gửi email", "Kiểm tra gửi email", config.admin_email, config)
            .then(is_send => {
                if (is_send) {
                    res.send({ success: true, message: "Gửi thành công" });
                } else {
                    res.send({ success: false, message: "Gửi không thành công" });
                }
            });
    } else {
        res.send({ success: false, message: "Gửi không thành công" });
    }
});

module.exports = router;
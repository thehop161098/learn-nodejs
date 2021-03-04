// getFullTime //
const moment = require('moment');
// end getFullTime //
// convertStringToMongoId //
const mongoose = require('mongoose');
// end convertStringToMongoId //
// authorization //
const { MESSAGE_FAILED_AUTH, MESSAGE_INVALID_AUTH, ERR_LIMIT_LINE_EXCEL, FILE_EMPTY
} = require("../config/Message");
const { LIMIT_LINE_EXCEL, BE, FE } = require("../config/Constant");
const { jwt_secret, API_URL } = require("../config/Config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// end authorization//
// uploadImg //
const fs = require('fs');
const sharp = require('sharp');
const fs_extra = require('fs-extra');
// end uploadImg //

const rimraf = require("rimraf");

var numeral = require('numeral');

const callApi = require('./apiCaller');

const Utils = {
    convertNameFile(string) {
        string = string.trim();
        string = string.replace(/\s+/g, "");
        string = string.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        string = string.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        string = string.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        string = string.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        string = string.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        string = string.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        string = string.replace(/đ/g, "d");
        string = string.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        string = string.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        string = string.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        string = string.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        string = string.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        string = string.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        string = string.replace(/Đ/g, "D");
        string = string.replace("/", "");
        string = string.replace(":", "");
        string = string.replace("!", "");
        string = string.replace("(", "");
        string = string.replace(")", "");
        string = string.replace(" ", "-");
        string = string.replace("%", "");
        string = string.replace("+", "");
        string = string.replace("'", "");
        string = string.replace("“", "");
        string = string.replace("”", "");
        string = string.replace(",", "");
        string = string.replace("’", "");
        string = string.replace('"', "");
        string = string.replace('\\', "");
        string = string.replace('//', "");
        string = string.replace('?', "");
        string = string.replace('&', "");
        string = string.replace(/ /g, "_");
        return string;
    },
    removeUnicode(string, is_toLowerCase = true) {
        string = string.trim();
        string = string.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        string = string.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        string = string.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        string = string.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        string = string.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        string = string.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        string = string.replace(/đ/g, "d");
        string = string.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        string = string.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        string = string.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        string = string.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        string = string.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        string = string.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        string = string.replace(/Đ/g, "D");
        if (is_toLowerCase) {
            return string.toLowerCase();
        }
        return string;
    },
    convertUnicode(string) {
        const lang_vn_a = ["à", "á", "ạ", "ả", "ã", "â", "ầ", "ấ", "ậ", "ẩ", "ẫ", "ă", "ằ", "ắ", "ặ", "ẳ", "ẵ",
            "À", "Á", "Ạ", "Ả", "Ã", "Â", "Ầ", "Ấ", "Ậ", "Ẩ", "Ẫ", "Ă", "Ằ", "Ắ", "Ặ", "Ẳ", "Ẵ"
        ];
        const lang_vn_e = ["è", "é", "ẹ", "ẻ", "ẽ", "ê", "ề", "ế", "ệ", "ể", "ễ",
            "È", "É", "Ẹ", "Ẻ", "Ẽ", "Ê", "Ề", "Ế", "Ệ", "Ể", "Ễ"
        ];
        const lang_vn_o = ["ò", "ó", "ọ", "ỏ", "õ", "ô", "ồ", "ố", "ộ", "ổ", "ỗ", "ơ", "ờ", "ớ", "ợ", "ở", "ỡ",
            "Ò", "Ó", "Ọ", "Ỏ", "Õ", "Ô", "Ồ", "Ố", "Ộ", "Ổ", "Ỗ", "Ơ", "Ờ", "Ớ", "Ợ", "Ở", "Ỡ"
        ];
        const lang_vn_u = ["ù", "ú", "ụ", "ủ", "ũ", "ư", "ừ", "ứ", "ự", "ử", "ữ",
            "Ù", "Ú", "Ụ", "Ủ", "Ũ", "Ư", "Ừ", "Ứ", "Ự", "Ử", "Ữ"
        ];
        const lang_vn_y = ["ỳ", "ý", "ỵ", "ỷ", "ỹ",
            "Ỳ", "Ý", "Ỵ", "Ỷ", "Ỹ"
        ];
        const lang_vn_d = ["đ", "Đ"];

        let newString = "";
        for (var i = 0; i < string.length; i++) {
            let character = string.charAt(i);
            if (character === "a" || character === "A") {
                character = "(" + lang_vn_a.join("|") + "|a)";
            } else if (character === "e" || character === "E") {
                character = "(" + lang_vn_e.join("|") + "|e)";
            } else if (character === "o" || character === "O") {
                character = "(" + lang_vn_o.join("|") + "|o)";
            } else if (character === "u" || character === "U") {
                character = "(" + lang_vn_u.join("|") + "|u)";
            } else if (character === "y" || character === "Y") {
                character = "(" + lang_vn_y.join("|") + "|y)";
            } else if (character === "d" || character === "D") {
                character = "(" + lang_vn_d.join("|") + "|d)";
            } else if (character === "(") {
                character = "\\(";
            } else if (character === ")") {
                character = "\\)";
            }
            newString += character;
        }
        return newString;
    },
    getFullTime(format = "YYYY-MM-DD HH:mm:ss") {
        return moment().format(format);
    },
    plusTime(date, time, unit = "hours", format = "YYYY-MM-DD HH:mm:ss") {
        return moment(date).add(time, unit).format(format);
    },
    minusTime(date, time, unit = "hours", format = "YYYY-MM-DD HH:mm:ss") {
        return moment(date).subtract(time, unit).format(format);
    },
    convertStringToMongoId(str) {
        if (mongoose.Types.ObjectId.isValid(str)) {
            return mongoose.Types.ObjectId(str);
        }
        return null;
    },
    convertDate(date, format = "YYYY-MM-DD") {
        if (date && date !== "") {
            let date_convert = moment(new Date(date));
            if (date_convert.isValid()) {
                return date_convert.format(format);
            }
        }
        return "";
    },
    convertDateTo(date, formatForm = "DD-MM-YYYY", formatTo = "YYYY-MM-DD") {
        if (date && date !== "") {
            let date_convert = moment(date, formatForm).format(formatTo);
            return date_convert;
        }
        return "";
    },
    getDateOfMonth(format, month = 'month') {
        if (format && format !== "") {
            return moment().startOf(month).format(format);
        }
        return "";
    },
    getEndOfMonth(format = 'DD') {
        return moment().endOf('month').format(format);
    },
    authorization(req, res, next) {
        const { User } = require("../models/UserModel");
        const authorizationHeader = req.headers['authorization'];
        let token;
        if (authorizationHeader) {
            token = authorizationHeader.split(' ')[1];
        }

        if (token) {
            jwt.verify(token, jwt_secret, (err, decoded) => {
                if (err) {
                    res.status(403).json({
                        success: false,
                        message: MESSAGE_FAILED_AUTH
                    });
                } else {
                    User.findOne({ _id: decoded }).then(user => {
                        if (!user) {
                            return res.status(403).json({
                                success: false,
                                message: MESSAGE_INVALID_AUTH
                            });
                        }
                        req.userCurrent = user;
                        next();
                    });
                }
            });
        } else {
            res.status(403).json({
                success: false,
                message: MESSAGE_FAILED_AUTH
            });
        }
    },
    async authorizaFE(req, res, next) {
        const authorizationHeader = req.headers['authorization'];
        let token;
        if (authorizationHeader) {
            token = authorizationHeader.split(' ')[1];
        }

        if (token) {
            jwt.verify(token, jwt_secret, (err, decoded) => {
                if (err) {
                    res.status(403).json({
                        success: false,
                        message: MESSAGE_FAILED_AUTH
                    });
                } else {
                    callApi('apiClientRouter/checkCustomer', 'POST', decoded).then(rest => {
                        if (rest && rest.data) {
                            let result = rest.data;
                            if (result.success) {
                                req.userCurrent = result.model;
                                next();
                            } else {
                                res.status(403).json({
                                    success: false,
                                    message: MESSAGE_FAILED_AUTH
                                });
                            }
                        }
                    })
                }
            });
        } else {
            next();
        }
    },
    isDir(dir) {
        var folders = dir.split("/");
        let path = ".";
        folders.forEach(folder => {
            if (folder !== "." && folder !== "") {
                path += `/${folder}`;
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                }
            }
        });
    },
    removeFolder(dir) {
        rimraf.sync(dir);
    },
    removeFile(path) {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    },
    async uploadFiles(req, folder, files) {
        if (files) {
            if (files[0] === undefined) {
                files = [files];
            }

            const website_name = req.websiteCurrent ? req.websiteCurrent.name : "admin";
            let dir = `./uploads/${website_name}/${folder}`;
            Utils.isDir(dir);
            return await Promise.all(files.map(async (file) => {
                const file_name = Utils.convertNameFile(`${Date.now()}_${file.name}`);
                return await file.mv(`${dir}/${file_name}`).then(() => {
                    return `${dir}/${file_name}`;
                });
            }));
        } else {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        }
    },
    resizeImg(name, path, width, height, format = "png") {
        sharp(path + name)
            .resize(width, height, {
                kernel: sharp.kernel.nearest,
                fit: 'contain',
                position: sharp.strategy.entropy,
                background: { r: 255, g: 255, b: 255, alpha: 0.5 }
            })
            .toFile(`${path}${name}.${format}`);
    },
    getResizeImg(path, width, height, format = "png") {
        if (!fs.existsSync(path)) {
            path = "./uploads/images/no_image.png";
        }
        const readStream = fs.createReadStream(path)
        let transform = sharp();
        if (format) {
            transform = transform.toFormat(format);
        }
        if (width || height) {
            transform = transform.resize(width, height);
        }
        return readStream.pipe(transform);
    },
    convertPrice(price, type = 'int') {
        if (price && price !== "") {
            price = price.toString();
            price = price.replace(/,/g, '');
            if (type === 'int') {
                return parseInt(price);
            } else if (type === 'double') {
                return parseFloat(price);
            }
        }

        return price
    },
    escapeValues(value) {
        if (value !== null && value !== undefined) {
            value = value.toString();
            value = value.trim();
            value = value.replace(/(<([^>]+)>)/ig, "");
            value = value.replace(/'/g, "''");
        } else {
            value = "";
        }
        return value;
    },
    convertType(value, type) {
        value = Utils.escapeValues(value);
        if (value !== "") {
            switch (type) {
                case "int":
                    return parseInt(value);
                case "double":
                    return parseFloat(value);
                case "expression":
                    return Utils.removeUnicode(value);
                case "date":
                    return Utils.parseDateExcel(value);
                default:
                    return value;
            }
        }
        return value;
    },
    formatNumber(num, format = '0,0') {
        return numeral(num).format(format);
    },
    deleteObjectProps(obj, array) {
        for (const item of array) {
            (item in obj) && (delete obj[item]);
        }
    },
    isEmptyStr(value = '') {
        let str = value.replace(/ /g, '');
        if (str === null || str === undefined || str === '')
            return true;
        return false;
    },
    checkTime(time) {
        const now = Utils.getFullTime();
        let time_check = Utils.getFullTime('YYYY-MM-DD 12:00:00');
        let start;
        let end;
        if (now >= time_check) {
            start = time_check;
            end = Utils.plusTime(time_check, 12);
        } else {
            start = Utils.minusTime(time_check, 12);
            end = Utils.plusTime(time_check, 12);
        }
        if (start <= time && time < end) {
            return true;
        }
        return false;
    },
    getDetailDate(date, type = "") {
        date = date.toString();
        let arr_date = date.split("-");

        if (type === "month") {
            return parseInt(arr_date[1]);
        } else if (type === "day") {
            return parseInt(arr_date[2]);
        } else if (type === "full") {
            return arr_date[0];
        }

        return `${arr_date[0]}-${parseInt(arr_date[1])}-${parseInt(arr_date[2])}`;
    },
    async authorizationFE(req, res, next) {
        const authorizationHeader = req.headers['authorization'];
        let token;
        if (authorizationHeader) {
            token = authorizationHeader.split(' ')[1];
        }

        if (token) {
            jwt.verify(token, jwt_secret, (err, decoded) => {
                if (err) {
                    res.status(403).json({
                        success: false,
                        message: 'Vui lòng đăng nhập để thực hiện giao dịch'
                    });
                } else {
                    callApi('apiClientRouter/checkCustomer', 'POST', decoded).then(res => {
                        if (res && res.data) {
                            let result = res.data;
                            if (result.success) {
                                req.userCurrent = result.model;
                                next();
                            } else {
                                res.status(403).json({
                                    success: false,
                                    message: MESSAGE_INVALID_AUTH
                                });
                            }
                        }
                    }).catch(() => {
                        res.status(403).json({
                            success: false,
                            message: MESSAGE_INVALID_AUTH
                        });
                    });
                }
            });
        } else {
            res.status(403).json({
                success: false,
                message: 'Vui lòng đăng nhập để thực hiện giao dịch'
            });
        }
    },
    strtr(s, p, r) {
        return !!s && {
            2: function () {
                for (var i in p) {
                    s = Utils.strtr(s, i, p[i]);
                }
                return s;
            },
            3: function () {
                return s.replace(RegExp(p, 'g'), r);
            },
            0: function () {
                return;
            }
        }[arguments.length]();
    },
    getRevenue(bank_id) {
        const { Revenue } = require("../models/RevenueModel");
        return Revenue.countDocuments({ bank_id }).then(count => {
            if (count > 0) return false;
            return true;
        })
    },
}

module.exports = Utils;
const mongoose = require('mongoose');
const validate = require('validator');

const mValidate = {};

mValidate.emailValidate = function(email) {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}

mValidate.phoneValidate = function(phone) {
    const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    return phoneRegex.test(phone);
}


//validate password.
// Có tối thiểu 8 ký tự
// Có ít nhất một kí tự viết thường (a-z)
//Có ít nhất một kí tự viết hoa (A-Z)
//Có ít nhất một chữ số (0-9)
//Có ít nhất một ký tự đặc biệt (!@#\$%\^&)
mValidate.passwordValidate = function(password) {
    const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;
    return isStrongPassword.test(password);
}



module.exports = mValidate;




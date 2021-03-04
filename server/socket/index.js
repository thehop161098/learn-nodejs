const { merge, isEmpty } = require("lodash");
const {
    GameTransaction, validateInput, search, checkDelete
} = require("../models/GameTransactionModel");
const { Bank } = require("../models/BankModel");
const { Game } = require("../models/GameModel");
const BankCustomerModel = require("../models/BankCustomerModel");
const { BankCustomer } = require("../models/BankCustomerModel");
const { saveBankAccountModel } = require("../models/BankAccountModel");
const { plusPoint, subPoint } = require('../models/TransactionPointModel');
const {
    MESSAGE_ADD_ERROR, MESSAGE_ADD_SUCCESSFUL, MESSAGE_DEL_SUCCESSFUL,
    MESSAGE_DEL_ERROR, MESSAGE_DEL_EMPTY, MESSAGE_EDIT_SUCCESSFUL, MESSAGE_EDIT_ERROR,
    MESSAGE_DEL_BLOCK, MESSAGE_EDIT_BLOCK, MESSAGE_NOT_ENOUGH_DATA, MESSAGE_TIME_GREAT_THAN,
    MESSAGE_STATUS_COMPLETE, MESSAGE_ERR_CONNECT
} = require("../config/Message");
const {
    SELL, BUY, STATUS_PENDING, STATUS_COMPLETE, STATUS_LEND, STATUS_CANCEL, STATUS_DEBT,
    STATUS_INVALID_BANK, STATUS_INVALID_INFO, STATUS_ERROR_INFO, STATUS_CHANGE_MONEY
} = require("../config/Constant");
const { authorizationSocket, convertPrice, getFullTime } = require("../utils");

function runSocket(io) {
    io.on('connection', (socket) => handleSocket(socket, io));
}

async function add(data) {
    let { _id, name, bank_name, account, ...data_transaction } = data;
    const data_bank = { ...data };
    if (!data_transaction.status) data_transaction.status = STATUS_PENDING;
    let rest_transaction = await validateInput(data_transaction);
    let rst_bank = { errors: {}, isValid: true };
    if (!data_transaction.bank_from && data.openAddBank) {
        if (rest_transaction.errors.bank_from) {
            delete rest_transaction.errors.bank_from;
            rest_transaction.isValid = isEmpty(rest_transaction.errors);
        }
        rst_bank = await BankCustomerModel.validateInput(data_bank);
    }

    if (data.status !== STATUS_LEND && (data.money_bank === "" || data.money_bank == null)) {
        rest_transaction.errors.money_bank = 'Trường bắt buộc';
        rest_transaction.isValid = false;
    }

    if (data.is_stt_change_money) {
        if (data.game_id_to === "") {
            rest_transaction.errors.game_id_to = "Trường bắt buộc";
            rest_transaction.isValid = false;
        }
        if (data.game_account_id_to === "") {
            rest_transaction.errors.game_account_id_to = "Trường bắt buộc";
            rest_transaction.isValid = false;
        }
    }

    if (rest_transaction.isValid && rst_bank.isValid) {
        delete data._id;
        if (data.money_bank) {
            if (data.bank_id && data.type === SELL) {
                Bank.findByIdAndUpdate(data.bank_id, { money: convertPrice(data.money_bank) }).then();
            } else if (data.game_id && data.type === BUY) {
                Game.findByIdAndUpdate(data.game_id, { money: convertPrice(data.money_bank) }).then();
            }
        }
        if (!data_transaction.bank_from && data.openAddBank) {
            data_transaction.bank_from = await BankCustomerModel.saveBankCustomer(data_bank)
                .then(rst => rst._id);
        }

        if (parseInt(data_transaction.status) === STATUS_LEND) {
            data_transaction = {
                user_id: data.user_id,
                type: data.type,
                money_game: data_transaction.money_game,
                game_id: data_transaction.game_id,
                game_account_id: data_transaction.game_account_id,
                status: STATUS_PENDING,
                status_other: STATUS_LEND,
                created_at: data_transaction.created_at,
                updated_at: data_transaction.updated_at,
            };
        }

        const model = new GameTransaction(data_transaction);
        if (model.status === STATUS_COMPLETE) {
            model.date_status = getFullTime();
        } else if (model.status === STATUS_CHANGE_MONEY) {
            model.status_other = STATUS_CHANGE_MONEY;
            model.status = STATUS_PENDING;
        }
        return model.save()
            .then(newModel => {
                if (newModel._id && data.is_stt_change_money) {
                    let data_transaction_sell = {
                        buy_id: newModel._id,
                        user_id: data.user_id,
                        type: SELL,
                        money_game: data_transaction.money_game,
                        game_id: data.game_id_to,
                        game_account_id: data.game_account_id_to,
                        status: STATUS_PENDING,
                        status_other: STATUS_CHANGE_MONEY,
                        created_at: data_transaction.created_at,
                        updated_at: data_transaction.updated_at,
                    };
                    new GameTransaction(data_transaction_sell).save();
                }

                if (newModel.game_account_id && newModel.bank_from) {
                    saveBankAccountModel({
                        bank_customer_id: newModel.bank_from,
                        game_account_id: newModel.game_account_id
                    });
                }

                // if (newModel.game_account_id && data.openAddBank) {
                //     GameAccountModel.GameAccount.findById(newModel.game_account_id, { customer_id: 1 })
                //         .then(acc => {
                //             if (acc && acc.customer_id) {
                //                 BankCustomerModel.BankCustomer.updateOne(
                //                     { _id: data_transaction.bank_from },
                //                     { customer_id: acc.customer_id }
                //                 ).then();
                //             }
                //         })
                // }
                return { success: true, message: MESSAGE_ADD_SUCCESSFUL, model: newModel }
            })
            .catch(error => ({ success: false, message: MESSAGE_ADD_ERROR, errors: error }));
    } else {
        let errors = merge(rest_transaction.errors, rst_bank.errors);
        return {
            success: false,
            errors: errors,
            message: MESSAGE_ADD_ERROR
        };
    }
}

async function deleteOne(_id, user_id, role_id) {
    return checkDelete(_id, user_id, role_id).then(is_del => {
        if (is_del) {
            return GameTransaction.findByIdAndRemove(_id)
                .then(model => {
                    if (!model) {
                        return {
                            success: false,
                            message: MESSAGE_DEL_EMPTY
                        };
                    }
                    return {
                        success: true,
                        model,
                        message: MESSAGE_DEL_SUCCESSFUL
                    };
                })
                .catch(error => ({ success: false, message: MESSAGE_DEL_ERROR }));
        } else {
            return { success: false, message: MESSAGE_DEL_BLOCK };
        }
    });
}

async function edit(data, user_id, role_id) {
    let check_status = await GameTransaction.findById(data._id, { status: 1, status_other: 1 });
    if (check_status.status === STATUS_COMPLETE) {
        return { success: false, message: MESSAGE_STATUS_COMPLETE };
    }
    const _id_update = data._id;
    return checkDelete(data._id, user_id, role_id).then(async is_update => {
        if (is_update) {
            let { _id, name, bank_name, account, ...data_transaction } = data;
            const data_bank = { ...data };
            let rest_transaction = await validateInput(data_transaction);
            let rst_bank = { errors: {}, isValid: true };
            if (!data_transaction.bank_from && data.openAddBank) {
                if (rest_transaction.errors.bank_from) {
                    delete rest_transaction.errors.bank_from;
                    rest_transaction.isValid = isEmpty(rest_transaction.errors);
                }
                rst_bank = await BankCustomerModel.validateInput(data_bank);
            }

            if (rest_transaction.isValid && rst_bank.isValid) {
                delete data._id;
                if (data.money_bank) {
                    if (data.type === SELL) {
                        Bank.findByIdAndUpdate(data.bank_id, {
                            money: convertPrice(data.money_bank)
                        }).then();
                    } else {
                        Game.findByIdAndUpdate(data.game_id, {
                            money: convertPrice(data.money_bank)
                        }).then();
                    }
                }
                if (!data_transaction.bank_id && data.type === SELL) {
                    data_transaction.$unset = { bank_id: '' };
                }
                if (!data_transaction.game_id) {
                    if (!data_transaction.$unset) data_transaction.$unset = {};
                    data_transaction.$unset.game_id = '';
                }
                if (!data_transaction.game_id || !data_transaction.game_account_id) {
                    if (!data_transaction.$unset) data_transaction.$unset = {};
                    data_transaction.$unset.game_account_id = '';
                }

                if (!data_transaction.bank_from) {
                    if (data.openAddBank) {
                        data_transaction.bank_from = await BankCustomerModel.saveBankCustomer(data_bank)
                            .then(rst => rst._id);
                    } else {
                        if (!data_transaction.$unset) data_transaction.$unset = {};
                        data_transaction.$unset.bank_from = '';
                    }
                }

                if (parseInt(data_transaction.status) === STATUS_LEND) {
                    data_transaction = {
                        money_game: data_transaction.money_game,
                        game_id: data_transaction.game_id,
                        game_account_id: data_transaction.game_account_id,
                        status: data_transaction.status,
                        $unset: { bank_id: '', bank_from: '', money: '' }
                    };
                }
                return GameTransaction.findByIdAndUpdate(_id_update, data_transaction, { new: true })
                    .then(model => {
                        if (model.game_account_id && model.bank_from) {
                            saveBankAccountModel({
                                bank_customer_id: model.bank_from,
                                game_account_id: model.game_account_id
                            });
                        }
                        return { success: true, model, message: MESSAGE_EDIT_SUCCESSFUL };
                    })
                    .catch(error => {
                        return { success: false, message: MESSAGE_EDIT_ERROR };
                    });
            } else {
                let errors = merge(rest_transaction.errors, rst_bank.errors);
                return {
                    success: false,
                    errors: errors,
                    message: MESSAGE_EDIT_ERROR
                };
            }
        } else {
            return {
                success: false,
                message: MESSAGE_EDIT_BLOCK
            };
        }
    });
}

async function changeField(data, user) {
    return GameTransaction.findById(data._id).then(async rest => {
        let date_now = getFullTime();
        let time_check = getFullTime("YYYY-MM-DD 12:00:00");
        let start;
        let is_change = false;

        if (date_now < time_check) {
            start = getFullTime("YYYY-MM-DD 00:00:00");
        } else {
            start = getFullTime("YYYY-MM-DD 12:00:00");
        }
        if (rest.created_at >= start) {
            is_change = true;
        }
        if ((!is_change && rest.status !== STATUS_PENDING)) {
            return { success: false, message: MESSAGE_TIME_GREAT_THAN };
        }

        if (data.type === SELL) {
            let is_subPoint = false;
            if (rest.parent_id) {
                let data_update = {
                    status: data.value,
                }
                if (data_update.status === STATUS_PENDING) {
                    data_update.$unset = { date_status: "" };
                    data_update.$unset = { assertor_id: "" };
                } else if (data_update.status === STATUS_COMPLETE) {
                    data_update.date_status = getFullTime();
                    data_update.assertor_id = user._id;
                } else {
                    return { success: false, message: MESSAGE_EDIT_ERROR };
                }
                return GameTransaction.findByIdAndUpdate(data._id, data_update, { new: true })
                    .then(model => ({
                        success: true, model, message: MESSAGE_EDIT_SUCCESSFUL
                    })).catch(error => ({
                        success: false, message: MESSAGE_EDIT_ERROR
                    }));
            } else if (rest.status_other) {
                let is_update = true;
                let data_update = {
                    status: data.value,
                }
                if (data_update.status === STATUS_PENDING) {
                    data_update.$unset = { date_status: "" };
                    data_update.$unset = { assertor_id: "" };
                } else if (data_update.status === STATUS_COMPLETE) {
                    data_update.date_status = getFullTime();
                    data_update.assertor_id = user._id;
                } else {
                    data_update.date_status = getFullTime();
                    data_update.assertor_id = user._id;
                    data_update.status_other = 0;
                    if (!rest.bank_id || !rest.money) {
                        is_update = false;
                    }
                }
                if (is_update) {
                    return GameTransaction.findByIdAndUpdate(data._id, data_update, { new: true })
                        .then(model => ({
                            success: true, model, message: MESSAGE_EDIT_SUCCESSFUL
                        })).catch(error => ({
                            success: false, message: MESSAGE_EDIT_ERROR, error
                        }));
                } else {
                    return { success: false, message: MESSAGE_NOT_ENOUGH_DATA };
                }
            } else {
                let data_update = {
                    status: data.value,
                }
                if (rest.status === STATUS_PENDING) {
                    if ([STATUS_COMPLETE, STATUS_CANCEL, STATUS_DEBT, STATUS_ERROR_INFO].includes(data.value)) {
                        if (rest.bank_id && rest.money && rest.game_id && rest.game_account_id) {
                            data_update.date_status = getFullTime();
                            data_update.assertor_id = user._id;

                            if (data_update.status === STATUS_COMPLETE) {
                                plusPoint(data.type, rest._id, rest.game_account_id, rest.money);
                            } else {
                                is_subPoint = await subPoint(rest._id);
                                if (!is_subPoint) {
                                    return { success: false, message: MESSAGE_EDIT_BLOCK };
                                }
                            }
                        } else {
                            return { success: false, message: MESSAGE_NOT_ENOUGH_DATA };
                        }
                    } else if (data.value === STATUS_LEND) {
                        data_update.status = STATUS_PENDING;
                        data_update.status_other = STATUS_LEND;
                        data_update.$unset = { date_status: "" };
                        data_update.$unset = { assertor_id: "" };
                        if (!rest.money || !rest.game_id || !rest.game_account_id) {
                            return { success: false, message: MESSAGE_NOT_ENOUGH_DATA };
                        }
                    } else {
                        return { success: false, message: MESSAGE_EDIT_ERROR };
                    }
                    return GameTransaction.findByIdAndUpdate(data._id, data_update, { new: true })
                        .then(model => ({
                            success: true, model, message: MESSAGE_EDIT_SUCCESSFUL
                        })).catch(error => ({
                            success: false, message: MESSAGE_EDIT_ERROR, error
                        }));
                } else {
                    if (data.value === STATUS_PENDING) {
                        data_update.$unset = { date_status: "" };
                        data_update.$unset = { assertor_id: "" };
                    } else if (data.value === STATUS_LEND) {
                        data_update.status = STATUS_PENDING;
                        data_update.status_other = STATUS_LEND;
                        data_update.$unset = { date_status: "" };
                        data_update.$unset = { assertor_id: "" };
                    } else {
                        data_update.date_status = getFullTime();
                        data_update.assertor_id = user._id;
                    }

                    if (rest.status === STATUS_COMPLETE) {
                        plusPoint(data.type, rest._id, rest.game_account_id, rest.money);
                    } else {
                        is_subPoint = await subPoint(rest._id);
                        if (!is_subPoint) {
                            return { success: false, message: MESSAGE_EDIT_BLOCK };
                        }
                    }

                    return GameTransaction.findByIdAndUpdate(data._id, data_update, { new: true })
                        .then(model => ({
                            success: true, model, message: MESSAGE_EDIT_SUCCESSFUL
                        })).catch(error => ({
                            success: false, message: MESSAGE_EDIT_ERROR
                        }));
                }
            }
        } else {
            let is_subPoint = true;
            let data_update = { status: data.value };
            if (rest.status_other === STATUS_CHANGE_MONEY) {
                data_update.date_status = getFullTime();
                data_update.assertor_id = user._id;
            } else if (data.value === STATUS_COMPLETE) {
                data_update.date_status = getFullTime();
                data_update.assertor_id = user._id;
                if (!rest.game_id || !rest.money_game || !rest.money || !rest.bank_id || !rest.bank_from) {
                    return { success: false, message: MESSAGE_NOT_ENOUGH_DATA };
                }
            } else if (data.value === STATUS_INVALID_BANK) {
                data_update.date_status = getFullTime();
                data_update.assertor_id = user._id;
                if (!rest.money_game || !rest.money) {
                    return { success: false, message: MESSAGE_NOT_ENOUGH_DATA };
                }
            } else if (data.value === STATUS_INVALID_INFO) {
                data_update.date_status = getFullTime();
                data_update.assertor_id = user._id;
                if (!rest.game_id && (!rest.money_game || !rest.money)) {
                    return { success: false, message: MESSAGE_NOT_ENOUGH_DATA };
                }
            } else {
                data_update.$unset = { date_status: "" };
                data_update.$unset = { assertor_id: "" };
            }

            if (!rest.status_other) {
                if (data.value === STATUS_COMPLETE) {
                    plusPoint(data.type, rest._id, rest.game_account_id, rest.money);
                } else {
                    is_subPoint = await subPoint(rest._id);
                    if (!is_subPoint) {
                        return { success: false, message: MESSAGE_EDIT_BLOCK };
                    }
                }
            }

            return GameTransaction.findByIdAndUpdate(data._id, data_update, { new: true })
                .then(model => ({
                    success: true, model, message: MESSAGE_EDIT_SUCCESSFUL
                })).catch(error => ({
                    success: false, message: MESSAGE_EDIT_ERROR, error
                }));
        }
    })
}

async function changeBank(data) {
    return GameTransaction.findById(data._id).then(rest => {
        if (rest.status !== STATUS_PENDING) {
            return { success: false, message: MESSAGE_EDIT_ERROR };
        }
        let data_update = {};
        if (!data.selected._id) {
            data_update.$unset = { bank_id: "" };
        } else {
            data_update.bank_id = data.selected._id;
        }
        return GameTransaction.findByIdAndUpdate(data._id, data_update, { new: true })
            .then(model => ({ success: true, model, message: MESSAGE_EDIT_SUCCESSFUL }))
            .catch(error => ({ success: false, message: MESSAGE_EDIT_ERROR, error }));
    });
}

function handleSocket(socket, io) {
    let token = socket.handshake.query.token ? socket.handshake.query.token : '';
    authorizationSocket(token, (rst) => {
        if (rst.success) {
            socket.userCurrent = rst.user;
            socket.join(socket.userCurrent._id.toString());
            let page = socket.handshake.query.page ? socket.handshake.query.page : '';
            socket.page = page;
            socket.join(page);
        }
    });

    socket.on('/', (data, cb) => {
        search(data).then(results => {
            if (data.is_refresh) {
                io.to(socket.page).emit('/', results);
            } else {
                cb(results);
            }
        });
    });

    socket.on('ADD', (data, cb) => {
        if (socket.userCurrent) {
            let data_insert = { ...data, user_id: socket.userCurrent._id };
            add(data_insert).then(rst => {
                if (rst.success) {
                    if (data.openAddBank) {
                        BankCustomer.find({}, { created_at: 0, updated_at: 0 }).then(banks_from => {
                            io.to(socket.page).emit('GET_BANKS_FROM', banks_from);
                        });
                    }
                    if (rst.model.status_other === STATUS_CHANGE_MONEY) {
                        io.to('Sell').emit('STATUS_CHANGE_MONEY');
                    }
                }
                cb(rst);
            });
        } else {
            cb({ success: false, message: MESSAGE_ERR_CONNECT })
        }
    });

    socket.on('EDIT', (data, cb) => {
        if (socket.userCurrent) {
            edit(data, socket.userCurrent._id, socket.userCurrent.role_id).then(rst => {
                cb(rst);
            });
        } else {
            cb({ success: false, message: MESSAGE_ERR_CONNECT })
        }
    });

    socket.on('DELETE', (_id, cb) => {
        if (socket.userCurrent) {
            const user_id = socket.userCurrent._id;
            const role_id = socket.userCurrent.role_id;
            deleteOne(_id, user_id, role_id).then(rst => {
                if (rst.success && rst.model.status_other === STATUS_CHANGE_MONEY) {
                    io.to('Sell').emit('STATUS_CHANGE_MONEY');
                }
                cb(rst);
            });
        } else {
            cb({ success: false, message: MESSAGE_ERR_CONNECT })
        }
    });

    socket.on('CHANGE_FIELD', (data, cb) => {
        if (socket.userCurrent) {
            changeField(data, socket.userCurrent).then(rst => {
                let result = { ...rst, field: data.field };
                if (rst.success) {
                    io.to(socket.page).emit('CHANGE_FIELD', result);
                }
                cb(result);
            });
        } else {
            cb({ success: false, message: MESSAGE_ERR_CONNECT })
        }
    });

    socket.on('CHANGE_BANK', (data, cb) => {
        if (socket.userCurrent) {
            changeBank(data).then(rst => {
                let result = { ...rst, field: data.field };
                if (rst.success) {
                    io.to(socket.page).emit('CHANGE_BANK', result);
                }
                cb(result);
            });
        } else {
            cb({ success: false, message: MESSAGE_ERR_CONNECT })
        }
    });
}

module.exports = runSocket;
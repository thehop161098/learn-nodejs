const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const { database } = require('./config/Config');


const loginRoute = require("./routers/admin/LoginRoute");
const roleRoute = require("./routers/admin/RoleRoute");
const moduleRoute = require('./routers/admin/ModuleRoute');
const controllerRoute = require('./routers/admin/ControllerRoute');
const controllerRoleRoute = require('./routers/admin/ControllerRoleRoute');
const settingRoute = require('./routers/admin/SettingRoute');
const userRoute = require('./routers/admin/UserRoute');
const bankRoute = require('./routers/admin/BankRoute');
const revenueRoute = require('./routers/admin/RevenueRoute');
const dashboardRoute = require('./routers/admin/DashboardRoute');
const currencyRoute = require('./routers/admin/CurrencyRoute');
const transfersRoute = require('./routers/admin/TransfersRoute');


/////
const apiRoute = require('./routers/api/ApiRoute');

mongoose.connect(`mongodb://${database.ip}/${database.name}`, database.options).then(() => {
    console.log('Mongo connection successful')
}).catch(err => {
    console.error('Mongo connection error')
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    }
    next();
});

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({
    safeFileNames: true,
    preserveExtension: 4
}));

// router for admin page
app.use('/admin/auth', loginRoute);
app.use('/admin/role', roleRoute);
app.use("/admin/module", moduleRoute);
app.use("/admin/controller", controllerRoute);
app.use("/admin/controllerRole", controllerRoleRoute);
app.use("/admin/setting", settingRoute);
app.use("/admin/user", userRoute);
app.use("/admin/bank", bankRoute);
app.use("/admin/revenue", revenueRoute);
app.use("/admin/dashboard", dashboardRoute);
app.use("/admin/currency", currencyRoute);
app.use("/admin/transfers", transfersRoute);

// api for all page
app.use("/api", apiRoute);

module.exports = app;
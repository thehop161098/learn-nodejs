import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from './components/login';
import { ForgetPassword } from './components/login';
import { Register } from './components/login';
import { HeaderDashboard } from './components/dashboard';
import { FooterDashboard } from './components/dashboard';
import { Breadcrumb } from './components/dashboard';
import { Dashboard } from './components/dashboard';
import { RevenueManager } from './components/revenue';
import { RevenueResult } from './components/revenue';
import { WalletManager } from './components/wallet';
import { WalletResult } from './components/wallet';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
                <Route path="/forget-password">
                    <ForgetPassword />
                </Route>
                <div className="wrapper">
                    <HeaderDashboard />
                    <div className="content-wrapper">
                        <Route path="/dashboard">
                            <Breadcrumb/>
                            <Dashboard />
                        </Route>
                        <Route path="/revenue">
                            <Breadcrumb title="> Quản Lí Thu Chi"/>
                            <RevenueManager />
                            <RevenueResult />
                        </Route>
                        <Route path="/wallet">
                            <Breadcrumb title="> Quản Lí Ví"/>
                            <WalletManager />
                            <WalletResult />
                        </Route>
                    </div>
                    <FooterDashboard />
                </div>
            </Switch>
        </Router>
    )
}
export default App;
 
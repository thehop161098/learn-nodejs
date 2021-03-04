import React, { Component } from 'react';
import Header from '../../components/admin/layout/Header';
import Sidebar from '../../components/admin/layout/Sidebar';
import { Breadcrumb } from '../../common';

class IndexAdminPage extends Component {

    render() {
        const { history, onLogout, getModules, routes, title_page, auth,
             currency, onSetCurrency } = this.props;

        return (
            <div id="wrapper">
                <div className="topDashboard">
                    <div className="menuDashboard">
                        <div className="row customRow">
                            <Sidebar getModules={getModules} />
                            <Header
                                onLogout={onLogout} history={history} auth={auth}
                                currency={currency} onSetCurrency={onSetCurrency}
                            />
                        </div>
                    </div>
                </div>

                <div className="content-wrapper">
                    {title_page !== null && <Breadcrumb title_page={title_page} />}
                    {routes}
                </div>
                <div className="footerDashboard">
                    <span>OPTECH.VN</span>
                </div>
            </div>
        );
    }
}

export default IndexAdminPage;
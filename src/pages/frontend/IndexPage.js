import React, { Component } from 'react';
import { Header, Footer } from '../../components/frontend/layout';
import MenuMobile from '../../components/frontend/layout/MenuMobile';

class IndexAdminPage extends Component {

    render() {
        const {
            history, onLogout, getModules, routes, title_page, auth, setting, getModulesBottom
        } = this.props;
        return (
            <div>
                <MenuMobile getModules={getModules} />
                <div className="wrapper" id="page-wrap">
                    <Header
                        onLogout={onLogout}
                        getModules={getModules}
                        logo={setting.pagesetting.logo}
                        auth={auth}
                        history={history}
                    />
                    {routes}
                    <Footer getModulesBottom={getModulesBottom} setting={setting} />
                </div>
            </div>
        );
    }
}

export default IndexAdminPage;
import React, { Component } from 'react';
import {
    Slideshow, MainHeader, SaleHome, Services, DownApp
} from '../../components/frontend/home';

class IndexAdminPage extends Component {

    render() {
        const { news } = this.props;
        const { download, services } = this.props.setting;

        return (
            <>
                <Slideshow {...this.props} />
                <MainHeader {...this.props} />
                <SaleHome news={news} />
                <Services services={services} lists={this.props.services} />
                <DownApp download={download} />
            </>
        );
    }
}

export default IndexAdminPage;
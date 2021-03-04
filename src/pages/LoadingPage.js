import React, { Component } from 'react';

export default class LoadingPage extends Component {
    render() {
        const { error, is_fullpage } = this.props;
        let styles = is_fullpage ? { height: '100vh' } : {};
        if (error) {
            return (
                <div className="page-error tile">
                    <h1><i className="fa fa-exclamation-circle"></i> Không thể lấy dữ liệu.</h1>
                </div>
            );
        }
        return (
            <div className="page-error tile" style={styles}>
                <h4><i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i></h4>
                <h3>Đang kiểm tra dữ liệu...</h3>
            </div>
        );
    }
}
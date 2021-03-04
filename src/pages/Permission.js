import React, { Component } from 'react';

export default class Permission extends Component {
    render() {
        return (
            <div className="page-error tile">
                <h1><i className="fa fa-exclamation-circle"></i> Error 401: Page permission</h1>
            </div>
        );
    }
}
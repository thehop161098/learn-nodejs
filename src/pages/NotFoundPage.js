import React, { Component } from 'react';

export default class NotFoundPage extends Component {
    render() {
        return (
            <div className="page-error tile">
                <h1><i className="fa fa-exclamation-circle"></i> Error 404: Page not found</h1>
                <p>The page you have requested is not found.</p>
                {/* <p><a className="btn btn-primary" href="javascript:window.history.back();">Go Back</a></p> */}
            </div>
        );
    }
}
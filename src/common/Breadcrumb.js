import React, { Component } from 'react';

export default class Breadcrumb extends Component {
    render() {
        const { title_page } = this.props;

        return (
            <div className="breadCrumb">
                <span>{title_page}</span>
            </div>
        );
    }
}
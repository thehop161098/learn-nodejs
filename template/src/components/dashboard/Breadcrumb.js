import React, { Component } from 'react';
export default class HeaderDashboard extends Component {
    render() {
        return (
            <div className="breadCrumb">
                <span>Dashboard {this.props.title}</span>
            </div>
        )
    }
}
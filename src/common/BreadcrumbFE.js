import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class BreadcrumbFE extends Component {
    render() {
        const { title, cate } = this.props;
        return (
            <div className="app-new-header">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="app-breadcrumb">
                                <nav>
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Trang chủ</Link>
                                        </li>
                                        {cate &&
                                            <li className="breadcrumb-item">
                                                <Link to={`/${cate.alias}`}>{cate.name}</Link>
                                            </li>
                                        }
                                        <li className="breadcrumb-item active">{title}</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
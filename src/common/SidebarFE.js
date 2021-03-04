import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { getImageFE } from '../utils';

export default class SidebarFE extends Component {

    render() {
        const { ads, cats } = this.props;

        return (
            <div className="col-md-4">
                <div className="sidebar">
                    {ads.length > 0 && ads.map((model, index) => {
                        return (
                            <div key={index} className="banner">
                                <Link to={model.link}>
                                    <img
                                        src={getImageFE(model.image, 0)}
                                        className="img-fluid"
                                        alt={model.name}
                                    />
                                </Link>
                            </div>
                        );
                    })}

                    {cats.length > 0 &&
                        <div className="cate-news">
                            <h5>Danh mục</h5>
                            <ul>
                                {cats.map((model, index) => {
                                    return (
                                        <li key={index}>
                                            <img src={getImageFE(model.image, 0)} alt={model.name} width={100} />
                                            <Link to={model.alias}>{model.name}</Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

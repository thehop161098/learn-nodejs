import React, { Component } from 'react'
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import Pagination from "react-js-pagination";
import { SidebarFE, BreadcrumbFE } from '../../common'
import icon_clock from '../../assets/frontend/images/icon/icon-clock.png';
import { getImageFE } from '../../utils';

export default class CatNewsPage extends Component {

    getPagination = () => {
        const { models, search, onChangePage } = this.props;
        let pagination = null;
        if (models.length > 0) {
            pagination = <Pagination
                activePage={search.page}
                itemsCountPerPage={search.per_page}
                totalItemsCount={search.total}
                onChange={onChangePage}
                activeLinkClass="active"
                itemClass="page-item"
                linkClass="page-link"
            />
        }
        return pagination;
    }

    render() {
        const { cate_name, models, search, ads, cats } = this.props;

        return (
            <div className="main-news">
                <BreadcrumbFE title={cate_name} />

                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            {models.map((model, index) => {
                                return (
                                    <div key={index} className="item">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="img-item">
                                                    <Link to={`${model.cat.alias}/${model.alias}`}>
                                                        <img
                                                            alt={model.name}
                                                            src={getImageFE(model.image, 0)}
                                                            className="img-fluid"
                                                        />
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="content-item">
                                                    <div className="title">
                                                        <Link to={`${model.cat.alias}/${model.alias}`}>{model.name}</Link>
                                                    </div>
                                                    <div className="date_user-post">
                                                        <div className="date-post">
                                                            <img src={icon_clock} alt="icon clock" />
                                                            <Moment format="DD/MM/YYYY HH:mm" add={{ hours: 8 }}>{model.created_at}</Moment>
                                                        </div>
                                                    </div>
                                                    <div className="des">{model.des}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="page-number">
                                <h6 className="page-count">
                                    <a href="# " onClick={(e) => { e.preventDefault() }}>
                                        Từ <span className="pageFrom">{search.total === 0 ? 0 : 1}</span> đến <span className="pageTo">{Math.ceil(search.total / search.per_page)}</span> trong tổng số <span className="pageAll">{search.total}</span>
                                    </a>
                                </h6>
                                <nav>
                                    {this.getPagination()}
                                </nav>
                            </div>
                        </div>
                        <SidebarFE ads={ads} cats={cats} />
                    </div>
                </div>
            </div>
        );
    }
}

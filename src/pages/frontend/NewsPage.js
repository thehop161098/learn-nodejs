import React, { Component } from 'react'
import { SidebarFE, BreadcrumbFE } from '../../common';
import { getImageFE } from '../../utils';
import Moment from 'react-moment';
import { Link } from "react-router-dom";
import icon_clock from '../../assets/frontend/images/icon/icon-clock.png';

export default class NewsPage extends Component {

    render() {
        const { cate, related_news, cats, ads, model } = this.props;

        return (
            <div className="detail-news">
                <BreadcrumbFE title={model.name} cate={cate} />

                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <h4 className="title">{model.name}</h4>
                            <div className="content-news">
                                <div dangerouslySetInnerHTML={{ __html: model.content }}></div>
                            </div>

                            {related_news.length > 0 &&
                                <div className="news-related">
                                    {related_news.map((row, index) =>
                                        <div className="item" key={index}>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="img-item">
                                                        <Link to={`/${cate.alias}/${row.alias}`}>
                                                            <img
                                                                alt={row.name}
                                                                src={getImageFE(row.image, 0)}
                                                                className="img-fluid"
                                                            />
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="content-item">
                                                        <div className="title">
                                                            <Link to={`/${cate.alias}/${row.alias}`}>
                                                                {row.name}
                                                            </Link>
                                                        </div>
                                                        <div className="date_user-post">
                                                            <div className="date-post">
                                                                <img src={icon_clock} alt="icon clock" />
                                                                <Moment format="DD/MM/YYYY HH:mm" add={{ hours: 8 }}>{row.updated_at}</Moment>
                                                            </div>
                                                            {/* <div className="user-post">
                                                                <img src="images/icon/icon-user-post.png" />
                                                                admin
                                                            </div> */}
                                                        </div>
                                                        <div className="des">{row.des}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            }
                        </div>

                        <SidebarFE ads={ads} cats={cats} />
                    </div>
                </div>
            </div>
        )
    }
}

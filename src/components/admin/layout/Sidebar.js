import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import logo from "../../../assets/images/logo-optech2.png";
import { Link } from "react-router-dom";

export default class Sidebar extends Component {

    showSettings(event) {
        event.preventDefault();
    }

    render() {
        const { getModules } = this.props;

        return (
            <div className="col-xl-1 col-lg-1 col-md-6 col-sm-6 col-3">
                <Menu>
                    <Link to="/admin">
                        <img src={logo} className="imgLogoMenu" alt="Logo" />
                    </Link>

                    <div id="accordion">

                        {getModules()}

                        {/* <div className="card not-child">
                            <a href="/admin">
                                <div className="card-header">
                                    <h5 className="mb-0">Dashboard</h5>
                                </div>
                            </a>
                        </div> */}

                        {/* <div className="card">
                            <a href="# " className="collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                <div className="card-header" id="headingTwo">
                                    <h5 className="mb-0">
                                        Quản lí
                                    </h5>
                                </div>
                            </a>

                            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                                <div className="card-body">
                                    <div className="list-group">
                                        <Link to="/revenue" className="list-group-item list-group-item-action">Quản lí thu chi</Link>
                                        <Link to="/wallet" className="list-group-item list-group-item-action">Quản lí ví</Link>
                                    </div>
                                </div>
                            </div>

                        </div> */}
                    </div>
                    {/* <a onClick={this.showSettings} className="menu-item--small" href=""></a> */}
                </Menu>
            </div>

            // <>
            //     <div className="app-sidebar__overlay" data-toggle="sidebar"></div>
            //     <aside className="app-sidebar">
            //         <ul className="app-menu">
            //             {getModules()}
            //         </ul>
            //     </aside>
            // </>
        );
    }
}
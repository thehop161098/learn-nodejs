import React, { Component } from 'react';
import { ARR_LIMIT_PAGE } from '../../../constants/Config';

const defaultState = {
    name: ""
}

export default class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = defaultState;
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSearch = () => {
        this.props.onSearch(this.state, 'search');
    }

    onReset = () => {
        this.setState(defaultState);
        this.props.onSearch();
    }
    onGetDataSearch = () => {
        this.props.searchModel().then(mData => {
            this.setState({
                models: mData.resluts
            });
        });
    }

    render() {

        const { name } = this.state;
        const { onChangeLimitPage } = this.props;

        let arr_limit_page = null;
        if (ARR_LIMIT_PAGE.length > 0) {
            arr_limit_page = ARR_LIMIT_PAGE.map((limit, index) => {
                return (<option value={limit} key={index}>{limit}</option>);
            });
        }

        return (
            <div className="wpSidebar">
                <div className="boxSearch">
                    <div className="titleSearch">Tìm kiếm</div>
                    <div className="content">
                        <div className="itemSearch">
                            <input
                                placeholder="Tìm mã, tên..."
                                type="text"
                                name="name"
                                value={name}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="itemSearch">
                            <select
                                onChange={onChangeLimitPage}
                            >
                                {arr_limit_page}
                            </select>
                        </div>
                        <div className="itemInput">
                            <button className="btnTP" onClick={this.onSearch}>Tìm</button>
                            <button className="btnTP" onClick={this.onReset}><i className="fas fa-sync-alt"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
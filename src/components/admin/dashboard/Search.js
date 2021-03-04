import React, { Component } from 'react';

const defaultState = {
    name: "",
}

export default class Search extends Component {

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
    onReset = (e) => {
        e.preventDefault();
        this.setState(defaultState);
        this.props.onSearch();
    }

    render() {

        const { name } = this.state;
        return (
            <>
                <div className="formSearchDashboard">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-6">
                            <div className="formSearch">
                                <input
                                    placeholder="Tìm kiếm..."
                                    type="text"
                                    autoComplete="off"
                                    name="name"
                                    value={name}
                                    onChange={this.onChange}
                                />
                                <i className="fa fa-search" onClick={this.onSearch}></i>
                                <a onClick={this.onReset} href="# "><i className="fa fa-times-circle"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}
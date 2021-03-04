import React, { Component } from 'react';

const defaultState = {
    name: ""
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

    onReset = () => {
        this.setState(defaultState);
        this.props.onSearch();
    }

    render() {
        const { name } = this.state;

        return (
            <div className="col-12 col-md-9">

                <div className="tile-search">
                    <div className="form-row">
                        <div className="col-12 col-md-3">
                            <input
                                className="form-control"
                                placeholder="Tìm kiếm nhóm quyền..."
                                type="text"
                                name="name"
                                value={name}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="col-12 col-md-3">
                            <button className="btn btn-primary mr-1" onClick={this.onSearch}>
                                <i className="fa fa-search"></i>
                            </button>
                            <button className="btn btn-info" onClick={this.onReset}>
                                <i className="fa fa-refresh"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
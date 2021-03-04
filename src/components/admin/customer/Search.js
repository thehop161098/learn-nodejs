import React, { Component } from 'react';
import { MALE, FEMALE } from '../../../constants/Params';

const defaultState = {
    name: "",
    sex: ""
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
        const { name, sex } = this.state;

        return (
            <div className="col-12 col-md-9">
                <div className="tile-search">
                    <div className="form-row">
                        <div className="col-12 col-md-3">
                            <input
                                className="form-control"
                                placeholder="Tìm theo tên, sdt, email ..."
                                type="text"
                                name="name"
                                value={name}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="col-12 col-md-3">
                            <select
                                className="form-control"
                                name="sex"
                                value={sex}
                                onChange={this.onChange}
                            >
                                <option value="">---- Giới tính ----</option>
                                <option value={MALE}>Nam</option>
                                <option value={FEMALE}>Nữ</option>
                            </select>
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
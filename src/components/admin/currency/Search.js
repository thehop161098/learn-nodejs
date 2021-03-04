import React, { Component } from 'react';

const defaultState = {
    name: "",
}

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = { ...defaultState };
        this.state.parents = [];
    }



    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSearch = () => {
        const { parents, ...data } = this.state;
        this.props.onSearch(data, 'search');
    }

    onReset = () => {
        this.setState(defaultState);
        this.props.onSearch();
    }
    


    render() {
        const { name } = this.state;

        return (
            <>
                <div className="col-lg-2 col-md-6 input-col-custom">
                    <div className="workPay">
                        <input
                            className="form-control"
                            placeholder="Nhập tên"
                            name="name"
                            value={name}
                            onChange={this.onChange}
                        />
                    </div>
                </div>
                <div className="col-lg-2 col-md-2 col-5 input-col-custom">
                    <div className="buttonSearchSubmit text-left">
                        <button className="btn btn-primary searchResult" onClick={this.onSearch}>
                            <i className="fa fa-search"></i>
                        </button>
                        <button className="btn btn-info refreshResult" onClick={this.onReset}>
                            <i className="fa fa-refresh"></i>
                        </button>
                    </div>
                </div>
            </>
        );
    }
}
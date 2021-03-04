import React, { Component } from 'react';
import moment from 'moment';
import DateRangePicker from '../../DateRangePicker/Index';
import { locale, ranges } from '../../DateRangePicker/config';

const defaultState = {
    name: "",
    typeReven: "",
    bank_id: "",
    startDate: moment().startOf('month').format('DD/MM/YYYY'),
    endDate: moment().endOf('month').format('DD/MM/YYYY'),
}

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = { ...defaultState };
        this.state.parents = [];
    }

    componentDidMount() {
        this.props.onGetWalletParent().then(parents => {
            this.setState({ parents });
        });
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
    ///show all ví
    getParents() {
        const { parents, _id } = this.state;
        let results = null;
        if (parents.length > 0) {
            results = parents.map((parent, index) => {
                if (parent._id === _id) return null;
                return <option value={parent._id} key={index}>{parent.name}</option>
            });
        }
        return results;
    }

    getValueDate = (e, { startDate, endDate }) => {
        this.setState({
            startDate: startDate.format("DD/MM/YYYY"),
            endDate: endDate.format("DD/MM/YYYY")
        })
    }

    render() {
        const { name, typeReven, bank_id } = this.state;

        return (
            <>
                <div className="col-lg-2 col-md-6 input-col-custom">
                    <div className="workPay">
                        <input
                            className="form-control"
                            placeholder="Nhập việc cần thu chi"
                            name="name"
                            value={name}
                            onChange={this.onChange}
                        />
                    </div>
                </div>
                <div className="col-lg-2 col-md-6 input-col-custom">
                    <div className="typePay">
                        <select
                            className="form-control"
                            name="typeReven"
                            value={typeReven}
                            onChange={this.onChange}
                        >
                            <option value="">Chọn Loại Thu/Chi</option>
                            <option value="thu">Thu</option>
                            <option value="chi">Chi</option>
                        </select>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 input-col-custom">
                    <div className="form-group">
                        <DateRangePicker
                            onApply={this.getValueDate}
                            alwaysShowCalendars={true}
                            showCustomRangeLabel={false}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            ranges={ranges}
                            locale={locale}
                        >
                            <input type="text" readOnly className="form-control-plaintext"
                                value={`${this.state.startDate} - ${this.state.endDate}`} />
                        </DateRangePicker>
                    </div>
                </div>

                <div className="col-lg-2 col-md-6 input-col-custom">
                    <div className="typePayment">
                        <select
                            className="form-control"
                            name="bank_id"
                            value={bank_id}
                            onChange={this.onChange}
                        >
                            <option value="">Chọn loại thanh toán</option>
                            {this.getParents()}
                        </select>
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
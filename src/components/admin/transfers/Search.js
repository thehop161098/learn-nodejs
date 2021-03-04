import React, { Component } from 'react';
import moment from 'moment';
import DateRangePicker from '../../DateRangePicker/Index';
import { locale, ranges } from '../../DateRangePicker/config';

const defaultState = {
    bank_take: "",
    bank_move: "",
    startDate: moment().startOf('month').format('DD/MM/YYYY'),
    endDate: moment().endOf('month').format('DD/MM/YYYY'),
}

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = { ...defaultState };
        this.state.banks = [];
    }
    componentDidMount() {
        this.props.onGetAllBank().then(banks => {
            this.setState({ banks });
        });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSearch = () => {
        const { banks, ...data } = this.state;
        this.props.onSearch(data, 'search');
    }

    onReset = () => {
        this.setState(defaultState);
        this.props.onSearch();
    }
    ///show all ví
    getBanks() {
        const { banks, _id } = this.state;
        let results = null;
        if (banks.length > 0) {
            results = banks.map((bank, index) => {
                if (bank._id === _id) return null;
                return <option value={bank._id} key={index}>{bank.name}</option>
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
        const { bank_take, bank_move } = this.state;

        return (
            <>
                <div className="col-lg-2 col-md-6 input-col-custom">
                    <div className="typePay">
                        <select
                            className="form-control"
                            name="bank_take"
                            value={bank_take}
                            onChange={this.onChange}
                        >
                            <option value="">Chọn ví nhận</option>
                            {this.getBanks()}
                        </select>
                    </div>
                </div>
                <div className="col-lg-2 col-md-6 input-col-custom">
                    <div className="typePay">
                        <select
                            className="form-control"
                            name="bank_move"
                            value={bank_move}
                            onChange={this.onChange}
                        >
                            <option value="">Chọn ví chuyển</option>
                            {this.getBanks()}
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
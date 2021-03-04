import React, { Component } from 'react';
import income from "../../../assets/images/icon-income.png";
import inspend from "../../../assets/images/icon-spend.png";
import incomemonth from "../../../assets/images/icon-month-income.png";
import inspendmonth from "../../../assets/images/icon-month-spend.png";
import NumberFormat from 'react-number-format';
import { convertDate, getFullTime } from "../../../utils/index";
import DateRangePicker from '../../DateRangePicker/Index';
import { locale, ranges } from '../../DateRangePicker/config';
import 'moment/locale/it.js';
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import moment from 'moment';

export default class Statistical extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalRevenue: [],
            totalExpenditure: [],
            totalMonthRevenue: [],
            totalMonthExpenditure: [],
            custome_date: new Date(),
            startDate: moment().startOf('month').format('DD/MM/YYYY'),
            endDate: moment().endOf('month').format('DD/MM/YYYY'),
            date: convertDate(getFullTime(), "MM/YYYY")
        };
    }

    componentDidMount() {
        this.props.onGetTotalRevenue(new Date()).then(totalRevenue => {
            this.setState({ totalRevenue: totalRevenue });
        });
        this.props.onGetTotalExpenditure(new Date()).then(totalExpenditure => {
            this.setState({ totalExpenditure: totalExpenditure });
        });
        this.props.onGetTotalMonthRevenue(this.state.startDate, this.state.endDate)
        .then(totalMonthRevenue => {
            this.setState({ totalMonthRevenue });
        });
        this.props.onGetTotalMonthExpenditure(this.state.startDate, this.state.endDate)
        .then(totalMonthExpenditure => {
            this.setState({ totalMonthExpenditure });
        });
    }
    //Tổng Thu hôm nay
    getPriceTotalRevenue = () => {
        const { totalRevenue } = this.state;
        var sum = 0;
        if (totalRevenue.length > 0) {
            for (var i = 0; i < totalRevenue.length; i++) {
                sum += totalRevenue[i].price;
            }
        }
        return sum;
    }
    //Tổng Chi hôm nay
    getPriceTotalExpenditure = () => {
        const { totalExpenditure } = this.state;
        var sum = 0;
        if (totalExpenditure.length > 0) {
            for (var i = 0; i < totalExpenditure.length; i++) {
                sum += totalExpenditure[i].price;
            }
        }
        return sum;
    }
    //Tổng thu tháng này
    getPriceTotalMonthRevenue = () => {
        const { totalMonthRevenue } = this.state;
        var sum = 0;
        if (totalMonthRevenue.length > 0) {
            for (var i = 0; i < totalMonthRevenue.length; i++) {
                sum += totalMonthRevenue[i].price;
            }
        }
        return sum;
    }
    //Tổng Chi tháng này
    getPriceTotalMonthExpenditure = () => {
        const { totalMonthExpenditure } = this.state;
        var sum = 0;
        if (totalMonthExpenditure.length > 0) {
            for (var i = 0; i < totalMonthExpenditure.length; i++) {
                sum += totalMonthExpenditure[i].price;
            }
        }
        return sum;
    }


    onChangeDate = (jsDate, dateString) => {
        this.props.onGetTotalRevenue(dateString).then(totalRevenue => {
            this.setState({
                totalRevenue: totalRevenue,
                custome_date: dateString
            });
        });
        this.props.onGetTotalExpenditure(dateString).then(totalExpenditure => {
            this.setState({
                totalExpenditure: totalExpenditure,
                custome_date: dateString
            });
        });
    }
    getValueDate = (e, { startDate, endDate }) => {
        this.props.onGetTotalMonthRevenue(startDate.format("DD/MM/YYYY"), endDate.format("DD/MM/YYYY"))
            .then(totalMonthRevenue => {
                this.setState({
                    totalMonthRevenue: totalMonthRevenue,
                    startDate: startDate.format("DD/MM/YYYY"),
                    endDate: endDate.format("DD/MM/YYYY"),
                    date: startDate.format("DD/MM") + '-' + endDate.format("DD/MM")
                });
            });
        this.props.onGetTotalMonthExpenditure(startDate.format("DD/MM/YYYY"), endDate.format("DD/MM/YYYY"))
            .then(totalMonthExpenditure => {
                this.setState({
                    totalMonthExpenditure: totalMonthExpenditure,
                    startDate: startDate.format("DD/MM/YYYY"),
                    endDate: endDate.format("DD/MM/YYYY"),
                    date: startDate.format("DD/MM") + '-' + endDate.format("DD/MM")
                });
            });
    }


    render() {
        const { custome_date, date } = this.state;
        return (
            <>
                <div className="income__spend">
                    <div className="row searchCustomer">
                        <div className="col-lg-6 col-md-6 todayCus">
                            <DatePickerInput
                                onChange={this.onChangeDate}
                                displayFormat='DD/MM/YYYY'
                                readOnly
                                className='my-react-component'
                                value={custome_date}
                            />
                        </div>
                        <div className="col-lg-6 col-md-6 monthCus">
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
                    <div className="row customRow">
                        <div className="col5">
                            <div className="incomeToday">
                                <div className="row">
                                    <div className="col-lg-12 col-md-4 col-4">
                                        <div className="imgIncome">
                                            <img src={income} alt="total_revenue" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-8 col-8">
                                        <div className="infoIncome">
                                            <div className="titleIncome">
                                                <p>{`Tổng Thu ${convertDate(custome_date, "DD-MM")}`}</p>
                                            </div>
                                            <div className="countIncome">
                                                <p>
                                                    <NumberFormat
                                                        value={this.getPriceTotalRevenue()}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                    /> {this.props.auth.unit}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col5">
                            <div className="spendToday">
                                <div className="row">
                                    <div className="col-lg-12 col-md-4 col-4">
                                        <div className="imgSpend">
                                            <img src={inspend} alt="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-8 col-8">
                                        <div className="infoSpend">
                                            <div className="titleSpend">
                                                <p>{`Tổng Chi ${convertDate(custome_date, "DD-MM")}`}</p>
                                            </div>
                                            <div className="countSpend">
                                                <p>
                                                    <NumberFormat
                                                        value={this.getPriceTotalExpenditure()}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                    /> {this.props.auth.unit}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col5">
                            <div className="incomeThisMonth">
                                <div className="row">
                                    <div className="col-lg-12 col-md-4 col-4">
                                        <div className="imgIncome">
                                            <img src={incomemonth} alt="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-8 col-8">
                                        <div className="infoIncome">
                                            <div className="titleIncome">
                                                <p>{`Tổng Thu Tháng ${date}`}</p>
                                            </div>
                                            <div className="countIncome">
                                                <p>
                                                    <NumberFormat
                                                        value={this.getPriceTotalMonthRevenue()}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                    /> {this.props.auth.unit}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col5">
                            <div className="spendThisMonth">
                                <div className="row">
                                    <div className="col-lg-12 col-md-4 col-4">
                                        <div className="imgSpend">
                                            <img src={inspendmonth} alt="" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-8 col-8">
                                        <div className="infoSpend">
                                            <div className="titleSpend">
                                                <p>{`Tổng Chi Tháng ${date}`}</p>
                                            </div>
                                            <div className="countSpend">
                                                <p>
                                                    <NumberFormat
                                                        value={this.getPriceTotalMonthExpenditure()}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                    /> {this.props.auth.unit}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col5">
                            <div className="incomeTotal">
                                <div className="row">
                                    <div className="col-lg-12 col-md-4 col-4">
                                        <div className="imgInTotal">
                                            <img src={income} alt="total_revenue" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-8 col-8">
                                        <div className="infoIncome">
                                            <div className="titleIncome">
                                                <p>Tổng tiền</p>
                                            </div>
                                            <div className="countIncome">
                                                <p>
                                                    <NumberFormat
                                                        value={this.props.auth.total}
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                    /> {this.props.auth.unit}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
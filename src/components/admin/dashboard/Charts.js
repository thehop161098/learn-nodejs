import React, { Component } from 'react';
import Chart from "react-apexcharts";

export default class Charts extends Component {

    constructor(props) {
        super(props);
        let that = this;
        this.state = {
            options: {
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '70%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                },
                yaxis: {
                    title: {
                        text: this.props.auth.unit,
                    },
                    labels: {
                        formatter: function (val) {
                            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                    }
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ' + that.props.auth.unit
                        }
                    }
                }
            },
            series: [{
                name: 'Tổng Thu',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }, {
                name: 'Tổng Chi',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }],
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.series) {
            this.setState({ series: nextProps.series });
        }
    }

    render() {
        return (
            <>
                <div id="chart" className="chartDashboard">
                    <Chart
                        options={this.state.options}
                        series={this.state.series} type="bar" height="350" />
                </div>
            </>

        );
    }
}
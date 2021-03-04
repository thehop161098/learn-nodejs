import React, { Component } from 'react';
import { Statistical, Charts, Search, List, ListBank } from '../../components/admin/dashboard';

export default class DashboardPage extends Component {

    render() {
        const {
            onGetAllBank,
            onGetTotalRevenue,
            onGetTotalExpenditure,
            onGetTotalMonthRevenue,
            onGetTotalMonthExpenditure,
            onSearch, onSortBy,
            series,
            auth
        } = this.props;
        return (
            <div className="mainDashboard">
                <Statistical
                    onGetTotalRevenue={onGetTotalRevenue}
                    onGetTotalExpenditure={onGetTotalExpenditure}
                    onGetTotalMonthRevenue={onGetTotalMonthRevenue}
                    onGetTotalMonthExpenditure={onGetTotalMonthExpenditure}
                    auth={auth}
                />
                <Charts series={series} auth={auth} />
                <ListBank auth={auth} onGetAllBank={onGetAllBank} onSortBy={onSortBy} />
                <Search onSearch={onSearch} />
                <List
                    {...this.props}
                />
            </div>

        )
    }
}
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actDashboard from '../../actions/admin/actDashboard';
import {
    openForm, closeForm,
    actChangePage, actLimitPage, actSearch, actSearchRefresh, actCheckAllList, actCheckBtnAll
} from '../../actions/index';

import DashboardPage from '../../pages/admin/DashboardPage';

import { merge } from 'lodash';

class DashboardContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            roles_access: [],
            series: null
        };
    }

    componentDidMount() {
        document.title = this.props.title_page;
        let roles_access = this.props.roles['DashboardContainer'] ? this.props.roles['DashboardContainer'] : [];
        this.setState({ roles_access });
        this.onGetAll(this.props.search);
        this.onGetChartData();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.search.page !== this.props.search.page ||
            nextProps.search.per_page !== this.props.search.per_page) {
            this.onGetAll(nextProps.search);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((this.state.is_loading && !nextState.is_loading) ||
            (nextProps.isForm !== this.props.isForm) || (nextState.series) ||
            (nextProps.listChecked.list.length !== this.props.listChecked.list.length)) {
            return true;
        }
        return false;
    }

    onGetAll = (search) => {
        this.setState({ is_loading: true });
        this.props.actGetAllRequest(search).then(res => {
            this.setState({ is_loading: false });
        });
    }

    onGetChartData = () => {
        this.props.actgetDataChart().then(res => {
            if (res.length > 0) {
                let thu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let chi = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                res.forEach(elm => {
                    if (elm._id) {
                        if (elm._id.typeReven === 'thu') {
                            thu[elm.month - 1] = elm.price;
                        } else {
                            chi[elm.month - 1] = elm.price;
                        }
                    }
                });
                this.setState({
                    series: [
                        {
                            name: 'Tổng Thu',
                            data: thu
                        },
                        {
                            name: 'Tổng Chi',
                            data: chi
                        }
                    ],
                });
            }
        });
    }

    onSearch = (data = {}, type = 'refresh') => {
        if (type === 'search') {
            this.props.actSearch(data);
        } else {
            this.props.actSearchRefresh();
        }
        if (this.props.search.page === 1) {
            const { search } = this.props;
            data.per_page = search.per_page;
            this.onGetAll(data);
        }
    }

    onSortBy = (sort_by) => {
        const search = { ...this.props.search, sort_by };
        this.onSearch(search, 'search');
    }

    onChangePage = (page) => {
        this.props.actChangePage(page);
    }

    onChangeLimitPage = (e) => {
        let per_page = parseInt(e.target.value);
        this.props.actLimitPage(per_page);
    }
    onGetTotalRevenue = (data) => {
        return this.props.actTotalRevenue(data);
    }
    onGetTotalExpenditure = (data) => {
        return this.props.actTotalExpenditure(data);
    }
    onGetTotalMonthRevenue = (start, end) => {
        return this.props.actTotalMonthRevenue(start, end);
    }
    onGetTotalMonthExpenditure = (start, end) => {
        return this.props.actTotalMonthExpenditure(start, end);
    }

    render() {
        return (
            <DashboardPage
                {...this.state}
                {...this.props}
                onGetAllBank={this.props.actGetAllBankRequest}
                onGetTotalRevenue={this.onGetTotalRevenue}
                onGetTotalExpenditure={this.onGetTotalExpenditure}
                onGetTotalMonthRevenue={this.onGetTotalMonthRevenue}
                onGetTotalMonthExpenditure={this.onGetTotalMonthExpenditure}
                onSortBy={this.onSortBy}
                onSearch={this.onSearch}
                onChangePage={this.onChangePage}
                onChangeLimitPage={this.onChangeLimitPage}
            />
        );
    }
}

const mapState = state => ({
    isForm: state.formReducer,
    models: state.dataReducer,
    modelEdit: state.dataEditReducer,
    search: state.searchReducer,
    listChecked: state.listCheckedReducer,
    auth: state.authReducer
});

const actIndex = {
    openForm, closeForm,
    actChangePage, actLimitPage, actSearch, actSearchRefresh, actCheckAllList, actCheckBtnAll
};
const mapProps = merge(actDashboard, actIndex);
export default connect(mapState, mapProps)(DashboardContainer);
import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { connect } from 'react-redux';
import * as actController from '../../actions/admin/actController';
import {
    openForm, closeForm,
    actChangePage, actLimitPage, actSearch, actSearchRefresh, actCheckAllList, actCheckBtnAll
} from '../../actions/index';

import ControllerPage from '../../pages/admin/ControllerPage';
import { showToast } from '../../utils';

import { EMPTY_DEL_ALL } from '../../constants/Params';
import { merge } from 'lodash';

class ControllerContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: true
        };
    }

    componentDidMount() {
        document.title = this.props.title_page;
        this.onGetAll(this.props.search);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.search.page !== this.props.search.page ||
            nextProps.search.per_page !== this.props.search.per_page) {
            this.onGetAll(nextProps.search);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((this.state.is_loading && !nextState.is_loading) ||
            (nextProps.isForm !== this.props.isForm) ||
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

    onDelete = (_id) => {
        confirmAlert({
            title: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn xóa',
            buttons: [
                {
                    label: 'Có',
                    onClick: () => {
                        this.props.actDelRequest(_id).then(res => {
                            if (res.success) {
                                showToast(res.message);
                                if (this.props.models.length === 1 && this.props.search.page > 1) {
                                    let setNewPage = this.props.search.page - 1;
                                    this.onChangePage(setNewPage);
                                } else {
                                    this.onGetAll(this.props.search);
                                }
                            } else {
                                showToast(res.message, 'error');
                            }
                        });
                    }
                },
                {
                    label: 'Không'
                }
            ]
        });
    }

    onDeleteAll = () => {
        const { listChecked } = this.props;
        if (listChecked.list.length > 0) {
            confirmAlert({
                title: 'Xác nhận',
                message: 'Bạn có chắc chắn muốn xóa',
                buttons: [
                    {
                        label: 'Có',
                        onClick: () => {
                            this.props.actDelAllRequest(listChecked.list).then(res => {
                                if (res.success) {
                                    showToast(res.message);
                                    if (this.props.models.length === 1 && this.props.search.page > 1) {
                                        let setNewPage = this.props.search.page - 1;
                                        this.onChangePage(setNewPage);
                                    } else {
                                        this.onGetAll(this.props.search);
                                    }
                                } else {
                                    showToast(res.message, 'error');
                                }
                            });
                        }
                    },
                    {
                        label: 'Không'
                    }
                ]
            });
        } else {
            showToast(EMPTY_DEL_ALL, 'error');
        }
    }

    onGetEdit = (_id) => {
        this.props.actGetRequest(_id).then(res => {
            this.props.openForm();
        });
    }

    onSubmit = (data) => {
        if (data._id === "") {
            return this.props.actAddRequest(data);
        }
        return this.props.actEditRequest(data);
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

    onCheckedAll = (e) => {
        const { checked } = e.target;
        const { models, actCheckAllList } = this.props;
        let list = [];
        if (checked) {
            models.map((model, index) => {
                return list.push(model._id)
            });
        }
        actCheckAllList(checked, list);
    }

    onChecked = (e) => {
        const { value, checked } = e.target;
        const { models, listChecked, actCheckBtnAll } = this.props;

        let newList = [];
        let isCheckAll = false;
        if (checked) {
            if (listChecked.list.indexOf(value) === -1) {
                newList = [...listChecked.list];
                newList.push(value);
            }
            if (newList.length >= models.length) {
                isCheckAll = true;
            }
        } else {
            newList = listChecked.list.filter(item => {
                return item !== value
            });
            if (newList.length < models.length) {
                isCheckAll = false;
            }
        }

        actCheckBtnAll(isCheckAll, newList);
    }

    render() {
        return (
            <ControllerPage
                {...this.state}
                {...this.props}
                onGetAll={this.onGetAll}
                onSubmit={this.onSubmit}
                onDelete={this.onDelete}
                onGetEdit={this.onGetEdit}
                onSearch={this.onSearch}
                onSortBy={this.onSortBy}
                onChangePage={this.onChangePage}
                onDeleteAll={this.onDeleteAll}
                onCheckedAll={this.onCheckedAll}
                onChecked={this.onChecked}
            />
        );
    }
}

const mapState = state => ({
    isForm: state.formReducer,
    models: state.dataReducer,
    modelEdit: state.dataEditReducer,
    search: state.searchReducer,
    listChecked: state.listCheckedReducer
});

const actIndex = {
    openForm, closeForm,
    actChangePage, actLimitPage, actSearch, actSearchRefresh, actCheckAllList, actCheckBtnAll
};
const mapProps = merge(actController, actIndex);
export default connect(mapState, mapProps)(ControllerContainer);
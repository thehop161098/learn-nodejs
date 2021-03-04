import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { connect } from 'react-redux';
import * as actRole from '../../actions/admin/actRole';
import {
    openForm, closeForm, openFormCustom, closeFormCustom,
    actChangePage, actLimitPage, actSearch, actSearchRefresh, actCheckAllList, actCheckBtnAll
} from '../../actions/index';

import RolePage from '../../pages/admin/RolePage';
import { showToast, checkPermission } from '../../utils';
import { EMPTY_DEL_ALL } from '../../constants/Params';
import { merge } from 'lodash';

class RoleContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            roles_access: []
        };
    }

    componentDidMount() {
        document.title = this.props.title_page;
        let roles_access = this.props.roles['RoleContainer'] ? this.props.roles['RoleContainer'] : [];
        this.setState({ roles_access });
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
            (nextProps.listChecked.list.length !== this.props.listChecked.list.length) ||
            (nextProps.formCustom.length !== this.props.formCustom.length)) {
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
        if (!checkPermission(this.state.roles_access, 'delete')) return;
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
                { label: 'Không' }
            ]
        });
    }

    onDeleteAll = () => {
        if (!checkPermission(this.state.roles_access, 'delete_all')) return;
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
                    { label: 'Không' }
                ]
            });
        } else {
            showToast(EMPTY_DEL_ALL, 'error');
        }
    }

    onGetEdit = (_id) => {
        if (!checkPermission(this.state.roles_access, 'update')) return;
        this.props.actGetRequest(_id).then(res => {
            this.props.openForm();
        });
    }

    onSubmit = (data) => {
        if (data._id === "") {
            if (!checkPermission(this.state.roles_access, 'create'))
                return new Promise((resolve, reject) => {
                    resolve({ success: false });
                });
            return this.props.actAddRequest(data);
        } else {
            if (!checkPermission(this.state.roles_access, 'update'))
                return new Promise((resolve, reject) => {
                    resolve({ success: false });
                });
            return this.props.actEditRequest(data);
        }
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

    onOpenRole = (_id) => {
        this.props.actGetRoleRequest(_id).then(res => {
            if (res.role_website && res.role_website.length > 0) {
                this.props.openFormCustom('form_role');
            } else {
                showToast("Chưa thiết lập chức năng cho nhóm quyền", 'warn');
            }
        });
    }

    onSetRole = (roles) => {
        if (!checkPermission(this.state.roles_access, 'index_action')) return;
        const { modelEdit } = this.props;
        return this.props.actSetRoleRequest(modelEdit._id, roles);
    }

    onChangeField = (data) => {
        this.setState({ is_loading: true });
        return this.props.actChangeFieldRequest(data).then(res => {
            this.setState({ is_loading: false });
            return res;
        })
    }

    render() {
        return (
            <RolePage
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
                onOpenRole={this.onOpenRole}
                onSetRole={this.onSetRole}
                onChangeField={this.onChangeField}
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
    formCustom: state.formCustomReducer
});
const actIndex = {
    openForm, closeForm, openFormCustom, closeFormCustom,
    actChangePage, actLimitPage, actSearch, actSearchRefresh, actCheckAllList, actCheckBtnAll
};
const mapProps = merge(actRole, actIndex);
export default connect(mapState, mapProps)(RoleContainer);
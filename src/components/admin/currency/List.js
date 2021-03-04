import React, { Component } from 'react';
import ListItem from './ListItem';
import Pagination from "react-js-pagination";
import { NONE, ASC, DESC } from '../../../constants/Params';
import { Loading } from '../../../common';

const defaultState = {
    name: { name: 'Tên', sort: NONE },
    created_at: { name: 'Ngày', sort: NONE },
    tool: { name: 'Công cụ' }
}
export default class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: { ...defaultState }
        };
    }

    getTrTable = () => {
        const { fields } = this.state;
        let results = [];
        for (const field in fields) {
            if (fields.hasOwnProperty(field)) {
                let class_name = "text-center";
                let class_sort = '';
                const temp = fields[field];
                const sort = temp.sort;
                switch (sort) {
                    case NONE:
                        class_sort = 'fa fa-sort';
                        break;
                    case DESC:
                        class_sort = 'fa fa-sort-asc';
                        break;
                    case ASC:
                        class_sort = 'fa fa-sort-desc';
                        break;
                    default:
                        break;
                }
                results.push(
                    <th
                        className={`${class_name} ${class_sort !== '' ? "cursor" : ''}`}
                        key={field}
                        onClick={() => this.onSortBy(field)}>
                        {temp.name} <i className={class_sort}></i>
                    </th>
                )
            }
        }
        return results;
    }

    onSortBy = (field) => {
        let fields = { ...this.state.fields };
        const elm = fields[field];
        if (elm && elm.sort !== undefined) {
            let sort;
            switch (elm.sort) {
                case NONE:
                    sort = ASC;
                    break;
                case ASC:
                    sort = DESC;
                    break;
                default:
                    sort = NONE;
                    break;
            }
            this.setState({ fields: { ...defaultState, [field]: { ...elm, sort } } });
            this.props.onSortBy({ field, sort });
        }
    }

    getAll = (models) => {
        const { is_loading, onDelete, onGetEdit, listChecked, onChecked, onChangeField } = this.props;
        var results = null;
        const colSpan = Object.keys(this.state.fields).length + 1;

        if (!is_loading && models.length > 0) {
            results = models.map((model, index) => {
                let result = [<ListItem
                    key={index}
                    index={index}
                    model={model}
                    onDelete={onDelete}
                    onGetEdit={onGetEdit}
                    listChecked={listChecked.list}
                    onChecked={onChecked}
                    onChangeField={onChangeField}
                    colSpan={colSpan}
                />];
                return result;
            });
            return results;
        } else {
            return (<ListItem isNull={true} colSpan={colSpan} />);
        }
    }

    getPagination = () => {
        const { models, search, onChangePage } = this.props;
        let pagination = null;
        if (models.length > 0) {
            pagination = <Pagination
                activePage={search.page}
                itemsCountPerPage={search.per_page}
                totalItemsCount={search.total}
                onChange={onChangePage}
                activeLinkClass="active"
                itemClass="page-item"
                linkClass="page-link"
            />
        }
        return pagination;
    }

    render() {
        const { is_loading, models, onCheckedAll, listChecked } = this.props;
        return (
            <>
                {is_loading && <Loading />}

                <div className="revenueResult table-responsive mt-3 mb-3">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="text-center">
                                    <div className="custom-control custom-checkbox ckb-custom">
                                        <input
                                            className="custom-control-input"
                                            id="customCheckAll"
                                            type="checkbox"
                                            value={true}
                                            onChange={onCheckedAll}
                                            checked={listChecked.isCheckAll}
                                        />
                                        <label className="custom-control-label" htmlFor="customCheckAll"></label>
                                    </div>
                                </th>
                                {this.getTrTable()}
                            </tr>
                        </thead>
                        <tbody>
                            {this.getAll(models)}
                        </tbody>
                    </table>
                </div>
                {this.getPagination()}
            </>
        );
    }
}
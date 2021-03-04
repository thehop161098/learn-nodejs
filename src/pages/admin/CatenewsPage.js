import React, { Component, Fragment } from 'react';
import { Search, List, Form } from '../../components/admin/catenews';
import { Buttons } from '../../common';

export default class CatenewsPage extends Component {

    getForm = () => {
        let elmForm = null;
        if (this.props.isForm) {
            elmForm = <Form {...this.props} />
        }
        return elmForm;
    }

    getButtons = () => {
        const { openForm, onDeleteAll } = this.props;
        return [
            {
                class: 'btn-primary mr-1',
                click: openForm,
                name: 'Thêm mới',
                icon: 'fa fa-plus'
            },
            {
                class: 'btn-danger',
                click: onDeleteAll,
                name: 'Xóa tất cả',
                icon: 'fa fa-trash'
            }
        ];
    }

    render() {
        const { onSearch } = this.props;
        return (
            <Fragment>
                {this.getForm()}
                <div className="row">
                    <div className="col-12">
                        <div className="tile">
                            <div className="row mb-4">
                                <Search onSearch={onSearch} />
                                <Buttons buttons={this.getButtons()} />
                            </div>
                            <List {...this.props} />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}
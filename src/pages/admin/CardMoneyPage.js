import React, { Component, Fragment } from 'react';
import { Search, List, Form } from '../../components/admin/cardMoney';
import { Buttons, Breadcrumb } from '../../common';

export default class CardMoneyPage extends Component {

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
        const { onSearch, title_breadcrumb, modules_props } = this.props;
        return (
            <Fragment>
                <Breadcrumb title_page={title_breadcrumb} />
                {this.getForm()}
                <div className="row">
                    <div className="col-12">
                        <div className="tile">
                            <div className="row mb-4">
                                <Search onSearch={onSearch} modules_props={modules_props} />
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
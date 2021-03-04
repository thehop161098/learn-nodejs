import React, { Component, Fragment } from 'react'
import { Search, List, Form, Role } from '../../components/admin/role';
import { Buttons } from '../../common';

export default class RolePage extends Component {

    getForm = () => {
        let elmForm = null;
        if (this.props.isForm) {
            elmForm = <Form {...this.props} />
        } else if (this.props.formCustom.indexOf("form_role") !== -1) {
            elmForm = <Role
                closeFormCustom={this.props.closeFormCustom}
                modelEdit={this.props.modelEdit}
                onSetRole={this.props.onSetRole}
            />
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
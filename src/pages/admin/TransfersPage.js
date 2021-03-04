import React, { Component, Fragment } from 'react';
import { Search, List, Form } from '../../components/admin/transfers';
import { Buttons } from '../../common';

export default class TransfersPage extends Component {

    getForm = () => {
        let elmForm = null;
        if (this.props.isForm) {
            elmForm = <Form {...this.props} />
        }
        return elmForm;
    }

    getButtons = () => {
        const { openForm } = this.props;
        return [
            {
                class: 'btn-success addItemRevenue',
                click: openForm,
                name: 'Thêm mới',
                icon: 'fa fa-plus-circle'
            },
            // {
            //     class: 'btn-danger delAllItem',
            //     click: onDeleteAll,
            //     name: 'Xóa tất cả',
            //     icon: 'fa fa-times-circle-o'
            // }
        ];
    }

    render() {
        const { onSearch, onGetAllBank } = this.props;
        return (
            <Fragment>
                {this.getForm()}

                <div className="revenueManager">
                    <div className="searchRevernue">
                        <div className="row customRow">
                            <Search onSearch={onSearch} onGetAllBank={onGetAllBank} />
                            <Buttons buttons={this.getButtons()} />
                            <List {...this.props} />
                        </div>
                    </div>
                </div>

            </Fragment>
        );
    }
}
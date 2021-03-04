import React, { Component, Fragment } from 'react';
import RoleItem from './RoleItem';
import { merge } from 'lodash';
import { showToast } from '../../../utils';
import { Loading } from '../../../common';

export default class Role extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_overlay: false,
            roles_checked: {}
        };
    }

    componentWillMount() {
        const { data } = this.props.modelEdit;
        let roles_checked = {};
        data.forEach(elm => {
            elm.controllers.forEach(controller => {
                roles_checked[controller.controller] = controller.list_action_selected;
            });
        });
        this.setState({ roles_checked });
    }

    onChange = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onChecked = (data) => {
        const roles_checked = { ...this.state.roles_checked };
        for (var controller in data) {
            if (!data.hasOwnProperty(controller)) continue;
            delete roles_checked[controller];
        }
        this.setState({ roles_checked: merge(roles_checked, data) });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({ is_overlay: true });
        this.props.onSetRole(this.state.roles_checked).then(res => {
            if (res) {
                if (res.success) {
                    this.props.closeFormCustom('form_role');
                    showToast(res.message);
                } else {
                    if (res.message) {
                        showToast(res.message, 'error');
                    }
                    this.setState({ is_overlay: false });
                }
            }
        });
    }

    showRoles = () => {
        const { data } = this.props.modelEdit;
        let results = null;
        results = data.map((role, index) => {
            return (
                <Fragment key={index}>
                    <RoleItem
                        role={role}
                        onReceiveChecked={this.onChecked}
                    />
                    {index !== data.length - 1 && <hr />}
                </Fragment>
            );
        });
        return results;
    }

    render() {
        const { is_overlay } = this.state;
        return (
            <div className="wrapper-form form-lg">
                {is_overlay && <Loading />}

                <h3 className="title-form">Thiết lập chức năng</h3>
                <div className="box-form">
                    <form onSubmit={this.onSubmit}>
                        {this.showRoles()}
                        <div className="tile-footer">
                            <button className="btn btn-primary mr-1" type="submit">
                                <i className="fa fa-fw fa-lg fa-check-circle"></i>Lưu
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => this.props.closeFormCustom('form_role')}>
                                <i className="fa fa-fw fa-lg fa-times-circle"></i> Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
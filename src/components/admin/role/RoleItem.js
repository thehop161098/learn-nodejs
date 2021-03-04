import React, { Component } from 'react';

export default class RoleItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_check_all: false,
            roles_checked: {}
        };
    }

    componentDidMount() {
        const { role } = this.props;
        let roles_checked = {};
        role.controllers.forEach(controller => {
            roles_checked[controller.controller] = controller.list_action_selected;
        });
        this.setState({ roles_checked });
        this.props.onReceiveChecked(roles_checked);
    }

    onChecked = (e, controller) => {
        const { roles_checked } = this.state;
        let control_checked = [];
        if (roles_checked[controller]) {
            control_checked = [...roles_checked[controller]];
        }
        let { value, checked } = e.target;
        if (checked) {
            control_checked.push(value);
        } else {
            control_checked = control_checked.filter(elm => {
                if (elm !== value) return true;
                return false;
            });
        }
        let new_roles_checked = { ...roles_checked };
        new_roles_checked[controller] = control_checked;
        this.setState({ roles_checked: new_roles_checked });
        this.props.onReceiveChecked(new_roles_checked);
    }

    showActions = (controller, list_action) => {
        console.log(controller)
        console.log('---------------------')
        console.log(list_action)

        const { roles_checked } = this.state;
        let results = null;
        results = list_action.map((action, index) => {
            let checked = false;
            if (roles_checked[controller] !== undefined &&
                roles_checked[controller].indexOf(action.action) !== -1) {
                checked = true;
            }
            return (
                <div className="col-md-4 col-lg-4" key={index}>
                    <div className="animated-checkbox">
                        <label className="">
                            <input type="checkbox"
                                value={action.action}
                                checked={checked}
                                onChange={(e) => this.onChecked(e, controller)}
                            />
                            <span className="label-text">{action.name}</span>
                        </label>
                    </div>
                </div>
            );
        });
        return results;
    }

    showControllers = (controllers) => {
        let results = null;
        if (controllers.length > 0 && controllers[0].controller) {
            results = controllers.map((controller, index) => {
                return (
                    <div className="col-sm-12" key={index}>
                        <div className="form-group">
                            <label>{controller.name}</label>
                            <div className="row">
                                {this.showActions(controller.controller, controller.list_action)}
                            </div>
                        </div>
                        {index !== controllers.length - 1 && <hr />}
                    </div>
                );
            });
        }

        return results;
    }

    onChange = (e) => {
        let { role } = this.props;
        let { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            let roles_checked = {};
            if (checked) {
                value = true;
                role.controllers.forEach(controller => {
                    roles_checked[controller.controller] = controller.list_action.map(action => {
                        return action.action;
                    });
                });
                this.setState({ roles_checked });
            } else {
                value = false;
                this.setState({ roles_checked });
            }
            this.props.onReceiveChecked(roles_checked);
        }
        this.setState({ [name]: value });
    }

    render() {
        const { is_check_all } = this.state;
        const { role } = this.props;
        return (
            <div className="row">
                <div className="col-md-3 col-lg-3">
                    <div className="form-group">
                        <label>{role.name}</label>
                        <div className="animated-checkbox">
                            <label className="mb-0">
                                <input
                                    type="checkbox"
                                    name="is_check_all"
                                    value={is_check_all}
                                    onChange={this.onChange}
                                />
                                <span className="label-text">Chọn tất cả</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="col-md-9 col-lg-9">
                    {this.showControllers(role.controllers)}
                </div>
            </div>
        );
    }
}
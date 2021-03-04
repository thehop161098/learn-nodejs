import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actSetting from '../../actions/admin/actSetting';

import SettingPage from '../../pages/admin/SettingPage';
import { showToast } from '../../utils';

class SettingContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        };
    }

    componentDidMount() {
        document.title = this.props.title_page;
        this.props.actGetAllRequest().then(res => {
            if (res.model) {
                let default_state = {};
                for (const key in res.model) {
                    if (res.model.hasOwnProperty(key)) {
                        const element = res.model[key];
                        default_state[key] = element.items
                        for (const field in element.items) {
                            if (element.items.hasOwnProperty(field)) {
                                const elm = element.items[field];
                                if (elm.type === 'file') {
                                    default_state[field] = "";
                                }
                            }
                        }
                    }
                }
                this.setState(default_state);
            }
        });
    }

    onChange = (key, field, value) => {
        if (key === "") {
            this.setState({ [field]: value });
        } else {
            const state = { ...this.state };
            const new_field = { ...state[key][field], value };
            const items = { ...state[key], [field]: new_field };
            const new_state = { ...state, [key]: items };
            this.setState(new_state);
        }
    }

    onSendEmail = () => {
        const { errors, ...data } = this.state;
        this.props.actSendEmailRequest(data).then(res => {
            if (res.success) {
                showToast(res.message);
            } else {
                showToast(res.message, 'error');
            }
        });
    }


    onSubmit = () => {
        this.setState({ errors: {} });
        const { errors, ...data } = this.state;
        return this.props.actAddRequest(data).then(res => {
            if (res.success) {
                showToast(res.message);
            } else {
                if (res.errors) {
                    this.setState({ errors: res.errors })
                }
                if (res.message) {
                    showToast(res.message, 'error');
                }
            }
        })
    }

    render() {
        const { modelEdit } = this.props;
        return (
            <SettingPage
                modelEdit={modelEdit}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
                onSendEmail={this.onSendEmail}
            >
                {this.state}
            </SettingPage>
        );
    }
}

const mapState = state => ({
    modelEdit: state.dataEditReducer,
});

export default connect(mapState, actSetting)(SettingContainer);
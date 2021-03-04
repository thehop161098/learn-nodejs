import React, { Component, Fragment } from 'react'
import List from '../../components/admin/setting/List';

export default class SettingPage extends Component {
    render() {
        const { modelEdit, onChange, onSubmit, onSendEmail } = this.props;

        return (
            <Fragment>
                <div className="row">
                    <div className="col-12">
                        <div className="tile">
                            <List
                                modelEdit={modelEdit}
                                onChange={onChange}
                                onSubmit={onSubmit}
                                onSendEmail={onSendEmail}
                            >{this.props.children}</List>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}
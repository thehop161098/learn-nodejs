import React, { Component } from 'react';
import Form from './Form';

export default class List extends Component {

    getTab = () => {
        const { modelEdit } = this.props;
        let results = null;
        for (const tab in modelEdit) {
            if (modelEdit.hasOwnProperty(tab)) {
                const elm = modelEdit[tab];
                let class_name = "nav-link";
                if (results === null) {
                    results = [];
                    class_name += ' active';
                }
                results.push(
                    <li className="nav-item" key={tab}>
                        <a className={class_name} data-toggle="tab" href={`#${tab}`}>
                            <i className={elm.icon}></i> {elm.label}
                        </a>
                    </li>
                );
            }
        }
        return results;
    }

    getFields = () => {
        const { onChange, onSendEmail } = this.props;
        const tabs = { ...this.props.children };
        let results = null;
        for (const tab in tabs) {
            if (tabs.hasOwnProperty(tab) && tab !== 'errors') {
                const elm = tabs[tab];
                let class_name = "tab-pane container fade";
                if (results === null) {
                    results = [];
                    class_name = 'tab-pane container active';
                }
                results.push(
                    <div key={tab} className={class_name} id={`${tab}`}>
                        <Form
                            tab={tab}
                            fields={elm}
                            errors={tabs.errors}
                            onChange={onChange}
                            onSendEmail={onSendEmail}
                        />
                    </div>
                );
            }
        }
        return results;
    }

    render() {
        const { onSubmit } = this.props;

        return (
            <form>
                <ul className="nav nav-tabs">
                    {this.getTab()}
                </ul>
                <div className="tab-content" style={{ marginTop: "10px" }}>
                    {this.getFields()}
                </div>
                <div className="boxTool text-right">
                    <button type="button" className="btn btn-primary mr-1" onClick={() => onSubmit()}>
                        <i className="fa fa-fw fa-lg fa-check-circle"></i>Lưu
                    </button>
                </div>
            </form>
        );
    }
}
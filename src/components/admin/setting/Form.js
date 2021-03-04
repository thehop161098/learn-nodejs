import React, { Component, Fragment } from 'react';
import classnames from "classnames";
import NumberFormat from 'react-number-format';
import { TYPE_FORMAT_IMAGE, FILE_IMAGE_LESS_THAN, MESG_FORMAT_IMAGE } from '../../../constants/Params';
import { showToast, getImageFE } from '../../../utils';


export default class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    onChange = (e) => {
        const { tab } = this.props;
        const { value, name } = e.target;
        this.props.onChange(tab, name, value);
    }

    onChangeFile = (e, field) => {
        const target = e.target;
        if (target.type === "file") {
            let reader = new FileReader();
            let files = e.target.files[0];
            var FileSize = files.size / 1024 / 1024;

            if (!TYPE_FORMAT_IMAGE.every(type => files.type !== type)) {
                if (FileSize <= FILE_IMAGE_LESS_THAN) {
                    reader.onloadend = () => {
                        this.setState({ [field]: [reader.result] });
                        this.props.onChange('', field, files);
                    }
                    reader.readAsDataURL(files)
                } else {
                    showToast('Kích thước ảnh quá lớn, đề nghị <= ' + FILE_IMAGE_LESS_THAN + ' MB', 'warn');
                }
            } else {
                showToast(MESG_FORMAT_IMAGE, 'warn');
            }
        }
    }

    onRemoveImg = (field) => {
        const { tab } = this.props;
        this.setState({ [field]: null });
        this.props.onChange(tab, field, '');
    }

    showFields = () => {
        let results = [];
        const { fields, errors, onSendEmail } = this.props;

        for (const field in fields) {
            if (fields.hasOwnProperty(field)) {
                const elm = fields[field];
                let field_input;
                const decimalScale = elm.decimalScale ? elm.decimalScale : 0;
                if (elm.type === 'number') {
                    field_input = <NumberFormat
                        className="form-control text-right"
                        autoComplete="off"
                        thousandSeparator={true}
                        prefix={''}
                        name={field}
                        value={elm.value}
                        onChange={this.onChange}
                        decimalScale={decimalScale}
                    />
                } else if (elm.type === 'file') {
                    let imagePreview = null;
                    const image = getImageFE(elm.value, 0);
                    if (image) {
                        imagePreview = <img src={image} alt={elm.name} />
                    }
                    if (this.state[field]) {
                        imagePreview = <img src={this.state[field]} alt={elm.name} />;
                    }
                    field_input = (<div className="box_input_img">
                        <div className="box-imgProfile">
                            {(elm.value || this.state[field]) &&
                                <button type="button" className="close icon_remove"
                                    onClick={() => this.onRemoveImg(field)}
                                ><span>x</span></button>
                            }
                        </div>
                        <div className='btn-upload'>
                            <label htmlFor={`${field}-img`} className="input_file">Chọn ảnh</label>
                            <span className="d-none">
                                <input type='file' id={`${field}-img`} className="file-input"
                                    onChange={(e) => this.onChangeFile(e, field)}
                                />
                            </span>
                            {imagePreview}
                        </div>
                    </div>);
                } else if (elm.type === 'dropdown') {
                    field_input = <select
                        className="form-control"
                        name={field}
                        value={elm.value}
                        onChange={this.onChange}
                    >
                        {elm.data.map((data, index) => {
                            return (<option key={index} value={data.key}>{data.value}</option>)
                        })}
                    </select>
                } else if (elm.type === 'button') {
                    field_input = <button
                        type="button"
                        className="btn btn-primary mr-2"
                        onClick={onSendEmail}
                    >
                        {elm.btn_name}
                    </button>
                } else {
                    field_input = <input
                        type={elm.type}
                        className="form-control"
                        name={field}
                        value={elm.value}
                        onChange={this.onChange}
                        autoComplete="new-password"
                    />
                }

                results.push(
                    <div key={field} className={classnames('form-group row', { 'has-error': errors[field] })}>
                        <label className="col-sm-4 control-label">{elm.name}</label>
                        <div className="col-sm-8">
                            {field_input}
                            {errors[field] && <small className="error">{errors[field]}</small>}
                        </div>
                    </div>
                );
            }
        }
        return results;
    }

    render() {
        return (
            <Fragment>
                {this.showFields()}
            </Fragment>
        );
    }
}
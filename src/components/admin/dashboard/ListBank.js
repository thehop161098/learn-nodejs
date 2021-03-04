import React, { Component } from 'react';
import ListBankItem from './ListBankItem';
import { NONE, ASC, DESC } from '../../../constants/Params';

const defaultState = {
    code: { name: 'Mã' },
    name: { name: 'Tên' },
    price_first: { name: 'Số dư ban đầu' },
    price_curr: { name: 'Số dư hiện tại' },
}
export default class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: { ...defaultState },
            banks: []
        };
    }

    componentDidMount() {
        this.props.onGetAllBank().then(modelBanks => {
            this.setState({ banks: modelBanks });
        });
    }

    getTrTable = () => {
        const { fields } = this.state;
        let results = [];
        for (const field in fields) {
            if (fields.hasOwnProperty(field)) {
                let class_name = "text-center";
                let class_sort = '';
                const temp = fields[field];
                const sort = temp.sort;
                switch (sort) {
                    case NONE:
                        class_sort = 'fa fa-sort';
                        break;
                    case DESC:
                        class_sort = 'fa fa-sort-asc';
                        break;
                    case ASC:
                        class_sort = 'fa fa-sort-desc';
                        break;
                    default:
                        break;
                }
                results.push(
                    <th
                        className={`${class_name} ${class_sort !== '' ? "cursor" : ''}`}
                        key={field}
                        onClick={() => this.onSortBy(field)}>
                        {temp.name} <i className={class_sort}></i>
                    </th>
                )
            }
        }
        return results;
    }

    onSortBy = (field) => {
        let fields = { ...this.state.fields };
        const elm = fields[field];
        if (elm && elm.sort !== undefined) {
            let sort;
            switch (elm.sort) {
                case NONE:
                    sort = ASC;
                    break;
                case ASC:
                    sort = DESC;
                    break;
                default:
                    sort = NONE;
                    break;
            }
            this.setState({ fields: { ...defaultState, [field]: { ...elm, sort } } });
            this.props.onSortBy({ field, sort });
        }
    }

    getAll = (banks) => {
        var results = null;
        const { auth } = this.props;
        const colSpan = Object.keys(this.state.fields).length + 1;

        if ( banks.length > 0) {
            results = banks.map((model, index) => {
                let result = [<ListBankItem
                    auth={auth}
                    key={index}
                    index={index}
                    model={model}
                    colSpan={colSpan}
                />];
                return result;
            });
            return results;
        } else {
            return (<ListBankItem isNull={true} colSpan={colSpan} />);
        }
    }

    
    render() {
        const { banks } = this.state;
        return (
            <>
                <div className="revenueResult table-responsive mt-3 mb-3">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                {this.getTrTable()}
                            </tr>
                        </thead>
                        <tbody>
                            {this.getAll(banks)}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}
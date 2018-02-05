import React, { Component } from 'react';
import '../App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ReactTooltip from 'react-tooltip';
import {findDOMNode} from 'react-dom';
var api = require('../../utils/api.js');
import _ from 'lodash'

const rawData = [];
export default class Fund extends React.Component {
    constructor() {
        super();
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var oneWeekLater = new Date();
        oneWeekLater.setDate(oneWeekLater.getDate() + 7);
        var nextweek = oneWeekLater.getFullYear() + '-' + (oneWeekLater.getMonth() + 1) + '-' + oneWeekLater.getDate();
        this.state = {
            data: rawData,
            account: '',
            country: '',
            account_name: '',
            business: 'DS',
            belonging: '',
            page: 1,
            pageSize: 10,
            sorted: [{ // the sorting model for the table
                id: 'account',
                desc: true
            }],
            filtered: [{ // the current filters model
                id: 'status',
                value: 'AA'
            }],
            loading: true,
            showModal: false,
            date: date,
            nextweek: nextweek
        };

    }
    componentDidMount () {
        api.fetchFunds(this.state.account, this.state.country, this.state.account_name, this.state.business, this.state.belonging)
            .then(function (res) {
                this.setState({data: res});
            }.bind(this));
    }
    componentWillUpdate () {

    }
    handleChange(e) {
        this.setState({account_name: e.target.value}, () => {
            api.fetchFunds(this.state.account, this.state.country, this.state.account_name, this.state.business, this.state.belonging)
                .then(function (res) {
                    this.setState({data: res});
                }.bind(this));
        })
    }
    render() {
        const columns = [{
            Header: 'Account Name',
            accessor: 'account_name',
            Cell: row => (
                <button onClick={this.handleChange.bind(this)} className="account-link" value={row.value}>{row.value}</button>
            )
        }, {
            Header: 'Belonging',
            accessor: 'belonging',
            filterMethod: (filter, row) =>
                row[filter.id].toLowerCase().startsWith(filter.value.toLowerCase())
        }, {
            Header: 'Business',
            accessor: 'business',
            filterMethod: (filter, row) =>
                row[filter.id].toLowerCase().startsWith(filter.value.toLowerCase())
        }, {
            Header: 'Date',
            accessor: 'log_date'
        }, {
            Header: 'Status',
            accessor: 'status',
            Cell: row => (
                <span
                    style={{
                        color: ["AA", "AI"].includes(row.value)? '#85cc00'
                            : ["UA", "UI"].includes(row.value)? '#ffbf00'
                                : row.value === "Login Blocked" ? '#dadada'
                                    : '#ff2e00',
                    }}
                >{row.value}</span>
            ), filterMethod: (filter, row) =>
                row[filter.id].toLowerCase().startsWith(filter.value.toLowerCase())
        }, {
            Header: 'Payment Amount',
            accessor: 'payment_amount',
            aggregate: (values, rows) => _.sum(values),
            Aggregated: row => {
                // You can even render the cell differently if it's an aggregated cell
                return <span>{Math.floor(row.value)} (sum)</span>
            },
            Cell: row => (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#dadada',
                        borderRadius: '2px'
                    }}
                >
                    <div
                        style={{
                            width: `${row.value/1000}%`,
                            height: '100%',
                            backgroundColor: row.value > 10000 ? '#85cc00'
                                : row.value < 5000 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            maxWidth: '100%'
                        }}
                    >{Math.floor(row.value)}</div>
                </div>
            ),
            filterMethod: (filter, row) => {
                var filtervalue = filter.value;
                var begin = 0.0;
                var end = 0.0;
                var rowvalue = row[filter.id];
                if (filtervalue === '') {
                    return true;
                }
                if (filtervalue.indexOf('-') > 0) {
                    begin = parseFloat(filtervalue.split('-')[0], 10);
                    end = parseFloat(filtervalue.split('-')[1], 10);
                    return parseFloat(rowvalue) >= begin && parseFloat(rowvalue) <= end;
                } else if (filtervalue.indexOf('>') > -1) {
                    begin = parseFloat(filtervalue.split('>')[1], 10);
                    return parseFloat(rowvalue) > begin;
                } else if (filtervalue.indexOf('<') > -1) {
                    end = parseFloat(filtervalue.split('<')[1], 10);
                    return parseFloat(rowvalue) < end;
                }
            },
            Filter: ({ filter, onChange }) =>
                <input
                    onChange={event => {
                        if (RegExp('^$|>[0-9]*\.?[0-9]+|<[0-9]*\.?[0-9]+|[0-9]*\.?[0-9]+-[0-9]*\.?[0-9]+').test(event.target.value)) {
                            onChange(event.target.value)
                        }
                    }
                    }
                    style={{ width: "100%" }}
                    placeholder={"e.g. <1 1-2 >3"}
                />

        }, {
            Header: 'Payment Date',
            accessor: 'payment_date',
            sortMethod: (a, b) => {
                if (a.length === 0) {
                    if (b.length === 0){
                        return 0;
                    } else {
                        return -1;
                    }
                }
                return a.length > b.length ? 1 : -1;
            },
            Cell: row => (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#dadada',
                        borderRadius: '2px'
                    }}
                >
                    <div
                        style={{
                            width: `100%`,
                            height: '100%',
                            backgroundColor: row.value === this.state.date ? '#85cc00'
                                : row.value < this.state.nextweek ? '#ffbf00'
                                    : '#ff2e00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            maxWidth: '100%'
                        }}
                    >{row.value}</div>
                </div>
            )
        }, {
            Header: 'Unavailable Balance',
            accessor: 'unavailable_balance',
            aggregate: (values, rows) => _.sum(values),
            Aggregated: row => {
                // You can even render the cell differently if it's an aggregated cell
                return <span>{Math.floor(row.value)} (sum)</span>
            },
            Cell: row => (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#dadada',
                        borderRadius: '2px'
                    }}
                >
                    <div
                        style={{
                            width: `${row.value/1000}%`,
                            height: '100%',
                            backgroundColor: row.value < 5000 ? '#85cc00'
                                : row.value > 10000 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            maxWidth: '100%'
                        }}
                    >{Math.floor(row.value)}</div>
                </div>
            ),
            filterMethod: (filter, row) => {
                var filtervalue = filter.value;
                var begin = 0.0;
                var end = 0.0;
                var rowvalue = row[filter.id];
                if (filtervalue === '') {
                    return true;
                }
                if (filtervalue.indexOf('-') > 0) {
                    begin = parseFloat(filtervalue.split('-')[0], 10);
                    end = parseFloat(filtervalue.split('-')[1], 10);
                    return parseFloat(rowvalue) >= begin && parseFloat(rowvalue) <= end;
                } else if (filtervalue.indexOf('>') > -1) {
                    begin = parseFloat(filtervalue.split('>')[1], 10);
                    return parseFloat(rowvalue) > begin;
                } else if (filtervalue.indexOf('<') > -1) {
                    end = parseFloat(filtervalue.split('<')[1], 10);
                    return parseFloat(rowvalue) < end;
                }
            },
            Filter: ({ filter, onChange }) =>
                <input
                    onChange={event => {
                        if (RegExp('^$|>[0-9]*\.?[0-9]+|<[0-9]*\.?[0-9]+|[0-9]*\.?[0-9]+-[0-9]*\.?[0-9]+').test(event.target.value)) {
                            onChange(event.target.value)
                        }
                    }
                    }
                    style={{ width: "100%" }}
                    placeholder={"e.g. <1 1-2 >3"}
                />
        }];
        return (
            <div >
                <button onClick={this.handleChange.bind(this)} className="all-account-link" value="">View All Accounts</button>
                <h3>Hold Shift when sorting to multi-sort</h3>
                <a data-tip data-for='global'> σ`∀´)σ </a>
                <a data-tip data-for='global'> (〃∀〃) </a>
                <ReactTooltip id='global' aria-haspopup='true' role='example'>
                    <p>This is a global react component tooltip</p>
                    <p>You can put every thing here</p>
                    <ul>
                        <li>Word</li>
                        <li>Chart</li>
                        <li>Else</li>
                    </ul>
                </ReactTooltip>
                <ReactTable
                    data={this.state.data}
                    columns={columns}
                    pages={this.state.pages}
                    defaultPageSize={100}
                    style={{
                        height: "800px" // This will force the table body to overflow and scroll, since there is not enough room
                    }}
                    filterable
                    className="-striped -highlight"
                    showPaginationTop
                    showPaginationBottom
                    pivotBy={['belonging', 'business', 'payment_date']}
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onMouseEnter: e => {
                                if (rowInfo) {
                                    ReactTooltip.show(this.refs.global)
                                    this.state.account_name=rowInfo["original"]["account_name"]
                                    console.log(this.state.account_name)
                                }
                            }
                        };
                    }}
                />
                <button onClick={this.handleChange.bind(this)} className="all-account-link" value="">View All Accounts</button>
            </div>
        )
    }
}

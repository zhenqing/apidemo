import React, { Component } from 'react';
import '../App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ReactTooltip from 'react-tooltip';
import {findDOMNode} from 'react-dom';
import FundTimeline from "./FundTimeline";
var api = require('../../utils/api.js');
import _ from 'lodash';
import {FormattedDate} from 'react-intl';
import {Link} from 'react-router-dom';
import {OverlayTrigger, Popover} from "react-bootstrap";
import ReactLoading from 'react-loading';

const rawData = [];
export default class Fund extends React.Component {
    constructor(props) {
        super();
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var oneWeekLater = new Date();
        oneWeekLater.setDate(oneWeekLater.getDate() + 7);
        var nextweek = oneWeekLater.getFullYear() + '-' + (oneWeekLater.getMonth() + 1) + '-' + oneWeekLater.getDate();
        this.state = {
            data: rawData,
            account: props.account || '',
            country: props.country || '',
            account_name: props.account_name || '',
            business: props.business || '',
            belonging: props.belonging || '',
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

    handleChange(e) {
        this.setState({account_name: e.target.value}, () => {
            api.fetchFunds(this.state.account, this.state.country, this.state.account_name, this.state.business, this.state.belonging)
                .then(function (res) {
                    this.setState({data: res, single: this.state.account_name === "" ? 0 : 1});
                }.bind(this));
        })
    }
    render() {
        const columns = [{
            Header: 'Belonging',
            accessor: 'belonging',
            maxWidth: 20,
            Cell: row => (
                <span></span>
            )
        }, {
            Header: 'Acc',
            accessor: 'account_name',
            Aggregated: row => {
                return (
                    <span>Total</span>
                );
            },
            maxWidth: 65,
            Cell: row => (
                <Link to={"/fundtimeline/"+row.value} role="button">{row.value}</Link>
            )
        }, {
            Header: 'Status',
            accessor: 'status',
            Aggregated: row => {
                return (
                    <span></span>
                );
            },
            maxWidth: 60,
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
            Header: 'Payment',
            accessor: 'payment_amount',
            aggregate: (values, rows) => _.sum(values),
            sortMethod: (a, b) => {
            return a > b ? -1 : 1;
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
                            width: `${row.value/500}%`,
                            height: '100%',
                            backgroundColor: row.value > 0 ?'#8884d8' : '#ff2e00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            maxWidth: '100%',
                            textAlign: 'Left'
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
            Header: 'Date',
            accessor: 'payment_date',
            Aggregated: row => {
                return (
                    <span></span>
                );
            },
            Cell: row =>
                { return row.value && (
                    <FormattedDate
                        value={row.value}
                        day="numeric"
                        month="numeric" />
                )}
            ,
            maxWidth: 40
        }, {
            Header: 'Unavailable',
            accessor: 'unavailable_balance',
            aggregate: (values, rows) => _.sum(values),
            sortMethod: (a, b) => {
                return a > b ? -1 : 1;
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
                            width: `${row.value/500}%`,
                            height: '100%',
                            backgroundColor: '#ff2e00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            maxWidth: '100%',
                            textAlign: 'Left'
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
            Header: 'Disburse',
            accessor: 'disburse_amount',
            aggregate: (values, rows) => _.sum(values),
            sortMethod: (a, b) => {
                return a > b ? -1 : 1;
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
                            width: `${row.value/500}%`,
                            height: '100%',
                            backgroundColor: '#85cc00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            maxWidth: '100%',
                            textAlign: 'Left'
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
        if(this.state.data.length === 0) {
            return <ReactLoading type="bars" />
        }
        return (
            <div>
                <button onClick={this.handleChange.bind(this)} className="all-account-link" value="">View All Accounts</button>
                <ReactTable
                    data={this.state.data}
                    columns={columns}
                    pages={this.state.pages}
                    defaultPageSize={100}
                    style={{
                        height: "800px" // This will force the table body to overflow and scroll, since there is not enough room
                    }}
                    filterable
                    pivotBy={["belonging"]}
                    collapseOnSortingChange={false}
                    collapseOnPageChange={false}
                    collapseOnDataChange={false}
                    freezeWhenExpanded={true}
                    className="-striped -highlight"
                    showPaginationBottom
                />
                <button onClick={this.handleChange.bind(this)} className="all-account-link" value="">View All Accounts</button>
            </div>
        )
    }
}

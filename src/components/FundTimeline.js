import React, { Component } from 'react';
import '../App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {findDOMNode} from 'react-dom';
import {LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer, Legend} from 'recharts';
var api = require('../../utils/api.js');
import {FormattedDate} from 'react-intl';

const rawData = [];
export default class FundTimeline extends React.Component {
    constructor(props) {
        super();
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
            showModal: false
        };

    }
    componentDidMount () {
        api.fetchFund(this.state.belonging)
            .then(function (res) {
                this.setState({data: res});
            }.bind(this));
    }
    componentWillUpdate () {

    }
    handleChange(e) {
        this.setState({account_name: e.target.value}, () => {
            api.fetchFund(this.state.belonging)
                .then(function (res) {
                    this.setState({data: res});
                }.bind(this));
        })
    }
    render() {
        const columns = [{
                Header: 'Date',
                accessor: 'log_date'
            }, {
            Header: 'Payment Amount',
            accessor: 'payment_amount',
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
                            width: `${row.value/10000}%`,
                            height: '100%',
                            backgroundColor: row.value > 10000 ? '#85cc00'
                                : row.value < 50000 ? '#ff2e00'
                                    : '#ffbf00',
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
            Header: 'Unavailable Balance',
            accessor: 'unavailable_balance',
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
                            width: `${row.value/10000}%`,
                            height: '100%',
                            backgroundColor: row.value < 50000 ? '#85cc00'
                                : row.value > 100000 ? '#ff2e00'
                                    : '#ffbf00',
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
        return (
            <div >
                <ResponsiveContainer width='100%' aspect={2.0/1.0}>
                    <LineChart
                        width={800}
                        height={400}
                        data={this.state.data}
                        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                        <XAxis dataKey="log_date" />
                        <Legend verticalAlign="top" height={36}/>
                        <Tooltip />
                        <CartesianGrid stroke="#f5f5f5" />
                        <Line type="monotone" dataKey="payment_amount" stroke="#387908" yAxisId={0} />
                        <Line type="monotone" dataKey="unavailable_balance" stroke="#ff7300" yAxisId={1} />
                    </LineChart>
                </ResponsiveContainer>
                    <ReactTable
                        data={this.state.data}
                        columns={columns}
                        defaultPageSize={100}
                        style={{
                            height: "800px" // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        filterable
                        className="-striped -highlight"
                    />
            </div>
        )
    }
}

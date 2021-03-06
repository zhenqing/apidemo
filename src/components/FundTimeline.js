import React, { Component } from 'react';
import '../App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {findDOMNode} from 'react-dom';
import {AreaChart, Area, ComposedChart, BarChart, Bar, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer, Legend} from 'recharts';
var api = require('../../utils/api.js');
import { tooltipContent } from './Functions';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {Row, Col} from "react-bootstrap";
const rawData = [];
export default class FundTimeline extends React.Component {
    constructor(props) {
        super();
        this.state = {
            data: rawData,
            accounts: rawData,
            account: props.account || '',
            country: props.country || '',
            account_name: props.match ? props.account_name || props.match.params.accountName || '' : props.account_name || '',
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
        api.fetchFund(this.state.belonging,this.state.account_name)
            .then(function (res) {
                this.setState({data: res});
            }.bind(this));
        api.fetchAccounts()
            .then(function (res) {
                this.setState({accounts: res});
            }.bind(this));
    }
    updateAccountName(newAccountName) {
        this.setState({
            account_name: newAccountName.value
        });
        api.fetchFund(this.state.belonging,newAccountName.value)
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
                accessor: 'log_date',
                Cell: row => (
                    <Link to={"/fund/"+row.value} role="button">{row.value}</Link>
                )
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
                            backgroundColor: row.value > 10000 ? '#8884d8'
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
        }, {
            Header: 'Disburse',
            accessor: 'disburse_amount',
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
                            width: `${row.value/5000}%`,
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
        return (
            <div >
                <h3>{this.state.account_name} Fund Timeline</h3>
                <Row className="show-grid">
                    <Col xs={6} md={2}>
                        Select Account
                    </Col>
                    <Col xs={6} md={2}>
                        <Select
                            value={this.state.account_name}
                            options={this.state.accounts}
                            onChange={this.updateAccountName.bind(this)}>
                        </Select>
                    </Col>
                    <Col xs={6} md={2}>
                        <Link to={"/accountlog/"+this.state.account_name} role="button">Account Log</Link>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={6} md={6}>
                        <ResponsiveContainer width='100%' aspect={2.0/1.0}>
                            <ComposedChart
                                width={600}
                                height={300}
                                data={this.state.data}
                                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                            >
                                <XAxis dataKey="log_date" tickLine={true} axisLine={true} />
                                <YAxis yAxisId="left" tickCount={10} tickLine={true} axisLine={true} minTickGap={0.5} domain={[0.5, 1]}/>
                                <Tooltip />
                                <Legend verticalAlign="top" height={36}/>
                                <CartesianGrid stroke="#f5f5f5" />
                                <Line type="monotone" dataKey="status" stroke="#387908" yAxisId="left" />
                                <Line type="monotone" dataKey="statusnum" stroke="#8884d8" yAxisId="left" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </Col>
                    <Col xs={6} md={6}>
                        <ResponsiveContainer width='100%' aspect={2.0/1.0}>
                            <BarChart width={600} height={300} data={this.state.data}
                                      margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                <XAxis dataKey="log_date" tickLine={true} axisLine={true} />
                                <YAxis/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Legend verticalAlign="top" height={36}/>
                                <Bar dataKey="payment_amount" stackId="a" fill="#8884d8" />
                                <Bar dataKey="unavailable_balance" stackId="a" fill="#feb2b4" />
                                <Bar dataKey="disburse_amount" stackId="a" fill="#1C783A" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
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

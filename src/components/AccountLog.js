import React, { Component } from 'react';
import '../App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ReactTooltip from 'react-tooltip';
import {findDOMNode} from 'react-dom';
import {ReferenceLine, ComposedChart, LineChart, BarChart, Bar, XAxis,YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer, Legend} from 'recharts';
import {Row, Col} from "react-bootstrap";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
var api = require('../../utils/api.js');

const rawData = [];
const statusMap = {'' : 0, 'internet loss' : 1, 'No longer needed' : 2, 'BankCard Issue' : 3, 'Computer&Internet Removed' : 4, 'Not Running' : 5,
    'Seller信息空白' : 6, 'Register Failed': 7, 'computer returned' : 8, 'Bank Card Issue' : 3, 'computer not start' : 9, 'Credit Card Invalid' : 10,
    'UA' : 11, 'Not Installed' : 12, 'Login Blocked' : 13, 'UI' : 14, 'Password Incorrect' : 15, 'AI' : 16, 'Suspended' : 17, 'AA': 18};
export default class AccountLog extends React.Component {
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
            single: props.match && props.match.params.accountName ? 1 : 0,
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
        api.fetchAccountLogs(this.state.account, this.state.country, this.state.account_name, this.state.business, this.state.belonging)
            .then(function (res) {
                this.setState({data: res});
            }.bind(this));
        api.fetchAccounts()
            .then(function (res) {
                this.setState({accounts: res});
            }.bind(this));
    }

    search() {
        console.log('this.state', this.state);
        const BASE_URL = 'http://a9test.ibport.com/api/v1/account_logs?access_token=b41127cf658eeb348ebc5a9513826bb0'
        const FETCH_URL = `${BASE_URL}&account=${this.state.account}&log_date=${this.state.log_date}`;
        console.log('FETCH_URL', FETCH_URL);
    }
    handleChange(e) {
        this.setState({account_name: e.target.value}, () => {
            api.fetchAccountLogs(this.state.account, this.state.country, this.state.account_name, this.state.business, this.state.belonging)
                .then(function (res) {
                    this.setState({data: res, single: this.state.account_name === "" ? 0 : 1});
                }.bind(this));
        })
    }
    updateAccountName(newAccountName) {
        this.setState({
            account_name: newAccountName.value
        });
        this.setState({account_name: newAccountName.value}, () => {
            api.fetchAccountLogs(this.state.account, this.state.country, this.state.account_name, this.state.business, this.state.belonging)
                .then(function (res) {
                    this.setState({data: res, single: this.state.account_name === "" ? 0 : 1});
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
            Header: 'Country',
            accessor: 'country',
            filterMethod: (filter, row) =>
                row[filter.id].toLowerCase().startsWith(filter.value.toLowerCase())
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
            Header: 'ODR',
            accessor: 'odr_short',
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
                            width: `${row.value*100}%`,
                            height: '100%',
                            backgroundColor: row.value < 0.5 ? '#85cc00'
                                : row.value > 1 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            maxWidth: '100%',
                            textAlign: 'Left'
                        }}
                    >{row.value}</div>
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
            Header: 'Orders 7',
            accessor: 'order_7d',
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
                            width: `${row.value/15}%`,
                            height: '100%',
                            backgroundColor: row.value > 1000 ? '#85cc00'
                                : row.value < 500 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            maxWidth: '100%',
                            textAlign: 'Left'
                        }}
                    >{row.value}</div>
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
            Header: 'Orders 30',
            accessor: 'order_30d',
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
                            width: `${row.value/50}%`,
                            height: '100%',
                            backgroundColor: row.value > 1000 ? '#85cc00'
                                : row.value < 500 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            maxWidth: '100%',
                            textAlign: 'Left'
                        }}
                    >{row.value}</div>
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
            Header: 'Feedback 30',
            accessor: 'feedback_30d',
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
                            width: `${row.value/5}%`,
                            height: '100%',
                            backgroundColor: row.value > 300 ? '#85cc00'
                                : row.value < 50 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            maxWidth: '100%',
                            textAlign: 'Left'
                        }}
                    >{row.value}</div>
                </div>
            ),
            sortMethod: (a, b) => {
                return a > b ? -1 : 1;
            },
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
            Header: 'Rating 30',
            accessor: 'rating_30d',
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
                            width: `${(row.value-80)*5}%`,
                            height: '100%',
                            backgroundColor: row.value > 95 ? '#85cc00'
                                : row.value < 90 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            textAlign: 'Left'
                        }}
                    >{row.value}</div>
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
            Header: 'Feedback Per 30',
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
                            width: `${row.value*20}%`,
                            height: '100%',
                            backgroundColor: row.value > 5 ? '#85cc00'
                                : row.value < 3 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            maxWidth: '100%',
                            textAlign: 'Left'
                        }}
                    >{row.value}</div>
                </div>
            ),
            accessor: 'feedback_per_30d'
        }, {
            Header: 'Cancel Rate 7',
            accessor: 'cancel_rate_7d'
        }, {
            Header: 'Refund Rate 7',
            accessor: 'refund_rate_7d'
        }, {
            Header: 'Feedback 365',
            accessor: 'feedback_1y',
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
                            width: `${row.value/20}%`,
                            height: '100%',
                            backgroundColor: row.value > 1000 ? '#85cc00'
                                : row.value < 500 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            maxWidth: '100%',
                            textAlign: 'Left'
                        }}
                    >{row.value}</div>
                </div>
            ),
            sortMethod: (a, b) => {
                return a > b ? -1 : 1;
            },
        }, {
            Header: 'Rating 365',
            accessor: 'rating_1y',
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
                            width: `${(row.value-80)*5}%`,
                            height: '100%',
                            backgroundColor: row.value > 95 ? '#85cc00'
                                : row.value < 90 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            textAlign: 'Left'
                        }}
                    >{row.value}</div>
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
            Filter: ({filter, onChange}) =>
                <input
                    onChange={event => {
                        if (RegExp('^$|>[0-9]*\.?[0-9]+|<[0-9]*\.?[0-9]+|[0-9]*\.?[0-9]+-[0-9]*\.?[0-9]+').test(event.target.value)) {
                            onChange(event.target.value)
                        }
                    }
                    }
                    style={{width: "100%"}}
                    placeholder={"e.g. <1 1-2 >3"}
                />
        }];
        return (
            <div >
                <button onClick={this.handleChange.bind(this)} className="all-account-link" value="">View All Accounts</button>
                {this.state.single === 1 ? (
                    <div>
                        <h3>{this.state.account_name} Account Summary</h3>
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
                        </Row>
                    <Row className="show-grid">
                        <Col xs={6} md={4}>
                            <ResponsiveContainer width='100%' aspect={2.0/1.0}>
                                <ComposedChart
                                    width={600}
                                    height={300}
                                    data={this.state.data}
                                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                                >
                                    <XAxis dataKey="log_date" tickLine={true} axisLine={true} />
                                    <YAxis yAxisId="left" tick={{ transform: 'translate(0, 3)' }} tickCount={10} tickLine={true} axisLine={true} minTickGap={10} />
                                    <YAxis yAxisId="right" orientation='right' tickCount={10} tickLine={true} axisLine={true} minTickGap={10}/>
                                    <Tooltip/>
                                    <Legend verticalAlign="top" height={36}/>
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <Line type="monotone" dataKey="order_7d" stroke="#387908" yAxisId="left" />
                                    <Line type="monotone" dataKey="order_30d" stroke="#9CBBF0" yAxisId="right" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col xs={6} md={4}>
                            <ResponsiveContainer width='100%' aspect={2.0/1.0}>
                                <ComposedChart
                                    width={600}
                                    height={300}
                                    data={this.state.data}
                                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                                >
                                    <XAxis dataKey="log_date" tickLine={true} axisLine={true} />
                                    <YAxis yAxisId="left" tickCount={10} tickLine={true} axisLine={true} minTickGap={10} />
                                    <YAxis yAxisId="right" orientation='right' tickCount={10} tickLine={true} axisLine={true} minTickGap={10}/>
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36}/>
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <Line type="monotone" dataKey="feedback_30d" stroke="#387908" yAxisId="left" />
                                    <Line type="monotone" dataKey="feedback_1y" stroke="#9CBBF0" yAxisId="right" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col xs={6} md={4}>
                            <ResponsiveContainer width='100%' aspect={2.0/1.0}>
                                <ComposedChart
                                    width={600}
                                    height={300}
                                    data={this.state.data}
                                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                                >
                                    <XAxis dataKey="log_date" tickLine={true} axisLine={true} />
                                    <YAxis yAxisId="left" tickCount={10} tickLine={true} axisLine={true} minTickGap={10} />
                                    <YAxis yAxisId="right" orientation='right' tickCount={10} tickLine={true} axisLine={true} minTickGap={10}/>
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36}/>
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <Line type="monotone" dataKey="rating_30d" stroke="#387908" yAxisId="left" />
                                    <Line type="monotone" dataKey="rating_1y" stroke="#9CBBF0" yAxisId="right" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={6} md={4}>
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
                        <Col xs={6} md={4}>
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
                                    <Line type="monotone" dataKey="odr_short" stroke="#387908" yAxisId="left" />
                                    <Line type="monotone" dataKey="cancel_rate_7d" stroke="#feb2b4" yAxisId="left" />
                                    <Line type="monotone" dataKey="refund_rate_7d" stroke="#8884d8" yAxisId="left" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col xs={6} md={4}>
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
                    </div>
                ) : (
                    <div></div>
                )}
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

import React, { Component } from 'react';
import '../App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ReactTooltip from 'react-tooltip';
import {findDOMNode} from 'react-dom';
import {LineChart, XAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer, Legend} from 'recharts';
import {Grid, Row, Col} from "react-bootstrap";
var api = require('../../utils/api.js');

const rawData = [];
export default class AccountLog extends React.Component {
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
        api.fetchAccountLogs(this.state.account, this.state.country, this.state.account_name, this.state.business, this.state.belonging)
            .then(function (res) {
                this.setState({data: res});
            }.bind(this));
    }
    componentWillUpdate () {

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
                            maxWidth: '100%'
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
                            maxWidth: '100%'
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
                            maxWidth: '100%'
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
                            transition: 'all .2s ease-out'
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
                            transition: 'all .2s ease-out'
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
                {this.state.account_name !=='' ? (
                    <Row className="show-grid">
                        <Col xs={6} md={3}>
                            <ResponsiveContainer width='100%' aspect={3.0/1.0}>
                                <LineChart
                                    width={600}
                                    height={200}
                                    data={this.state.data}
                                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                                >
                                    <XAxis dataKey="log_date" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36}/>
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <Line type="monotone" dataKey="order_7d" stroke="#387908" yAxisId={0} />
                                    <Line type="monotone" dataKey="order_30d" stroke="#9CBBF0" yAxisId={1} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col xs={6} md={3}>
                            <ResponsiveContainer width='100%' aspect={3.0/1.0}>
                                <LineChart
                                    width={600}
                                    height={200}
                                    data={this.state.data}
                                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                                >
                                    <XAxis dataKey="log_date" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36}/>
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <Line type="monotone" dataKey="feedback_30d" stroke="#958D58" yAxisId={1} />
                                    <Line type="monotone" dataKey="odr_short" stroke="#ff7300" yAxisId={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col xs={6} md={3}>
                            <ResponsiveContainer width='100%' aspect={3.0/1.0}>
                                <LineChart
                                    width={600}
                                    height={200}
                                    data={this.state.data}
                                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                                >
                                    <XAxis dataKey="log_date" />
                                    <Tooltip />
                                    <Legend verticalAlign="top" height={36}/>
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <Line type="monotone" dataKey="rating_30d" stroke="#958D58" yAxisId={1} />
                                    <Line type="monotone" dataKey="rating_1y" stroke="#ff7300" yAxisId={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Col>
                    </Row>
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

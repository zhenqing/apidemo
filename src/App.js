import React, { Component } from 'react';
import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
var api = require('../utils/api.js');
const rawData = [];
class AccountLog extends React.Component {
    constructor() {
        super();
        this.state = {
            data: rawData,
            account: '',
            country: '',
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
            loading: true
        };

    }
    componentDidMount () {
        api.fetchAccountLogs(this.state.account, this.state.country)
            .then(function (res) {
                this.setState({data: res});
            }.bind(this));
    }
    search() {
        console.log('this.state', this.state);
        const BASE_URL = 'http://localhost:3002/api/v1/account_logs?access_token=b41127cf658eeb348ebc5a9513826bb0'
        const FETCH_URL = `${BASE_URL}&account=${this.state.account}&log_date=${this.state.log_date}`;
        console.log('FETCH_URL', FETCH_URL);
    }
    handleChange(e) {
        this.setState({account: e.target.value})
        console.log(this.state.account)
    }
    render() {
        const columns = [{
            Header: 'Account Name',
            accessor: 'account_name'
        }, {
            Header: 'Country',
            accessor: 'country'
        }, {
            Header: 'Date',
            accessor: 'log_date'
        }, {
            Header: 'Status',
            accessor: 'status',
            Cell: row => (
                    <div
                        style={{
                            width: `${row.value}%`,
                            height: '100%',
                            backgroundColor: row.value === "AA" ? '#85cc00'
                                : row.value === "AI" ? '#ffbf00'
                                    : row.value === "Login Blocked" ? '#dadada'
                                    : '#ff2e00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out'
                        }}
                    >{row.value}</div>
            )
        }, {
            Header: 'ODR',
            accessor: 'odr_short',
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
                            backgroundColor: row.value < 0.5 ? '#85cc00'
                                : row.value > 1 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out'
                        }}
                    >{row.value}</div>
                </div>
            )
        }, {
            Header: 'Orders 7',
            accessor: 'order_7d'
        }, {
            Header: 'Orders 30',
            accessor: 'order_30d'
        }, {
            Header: 'Feedback 30',
            accessor: 'feedback_30d'
        }, {
            Header: 'Rating 30',
            accessor: 'rating_30d',
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
                            width: `${row.value}%`,
                            height: '100%',
                            backgroundColor: row.value > 95 ? '#85cc00'
                                : row.value < 90 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out'
                        }}
                    >{row.value}</div>
                </div>
            )
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
            accessor: 'feedback_1y'
        }, {
            Header: 'Rating 365',
            accessor: 'rating_1y',
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
                            width: `${row.value}%`,
                            height: '100%',
                            backgroundColor: row.value > 95 ? '#85cc00'
                                : row.value < 90 ? '#ff2e00'
                                    : '#ffbf00',
                            borderRadius: '2px',
                            transition: 'all .2s ease-out'
                        }}
                    >{row.value}</div>
                </div>
            )
        }];
        return (
            <div className="App">
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
                />
            </div>
        )
    }
}
class App extends Component {
  render() {
    return (
            <AccountLog/>
    );
  }
}

export default App;

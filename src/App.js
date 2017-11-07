import React, { Component } from 'react';
import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

const rawData = [{
    account: '25US',
    status: 'AI',
    rating: 98
}, {
    account: '47UK',
    status: 'Suspend',
    rating: 97
}, {
    account: '110CA',
    status: 'AA',
    rating: 95
}];
// const requestData = (pageSize, page, sorted, filtered) => {
//     return new Promise((resolve, reject) => {
//         let filteredData = rawData;
//         if (filtered.length) {
//             filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
//                 return filteredSoFar.filter(row => {
//                     return (row[nextFilter.id] + "").include(nextFilter.value);
//                 });
//             }, filteredData);
//         }
//         const res = {
//             rows: filteredData.slice(pageSize * page, pageSize * page + pageSize),
//             pages: Math.ceil(filteredData.length / pageSize)
//         };
//         setTimeout(() => resolve(res), 500);
//     });
// }
class AccountLog extends React.Component {
    constructor() {
        super();
        this.state = {
            data: rawData,
            account: '25US',
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
        }
    }
    search() {
        debugger
        console.log('this.state', this.state);
        const BASE_URL = 'http://localhost:3002/api/v1/account_logs?access_token=b41127cf658eeb348ebc5a9513826bb0'
        const FETCH_URL = `${BASE_URL}&account=${this.state.account}&log_date=${this.state.log_date}`;
        console.log('FETCH_URL', FETCH_URL);
    }
    // fetchData(state, instance) {
    //     this.setState({ loading: true});
    //     requestData(
    //         state.pageSize,
    //         state.page,
    //         state.sorted,
    //         state.filtered
    //     ).then(res => {
    //         this.setState({
    //             data: res.rows,
    //             pages: res.pages,
    //             loading: false
    //         });
    //     });
    // }
    handleChange(e) {
        this.setState({account: e.target.value})
        console.log(this.state.account)
    }
    render() {
        const columns = [{
            Header: 'Account',
            accessor: 'account'
        }, {
            Header: 'Status',
            accessor: 'status'
        }, {
            Header: 'Rating',
            accessor: 'rating'
        }]
        return (
            <div className="App">
                <form ref="searchForm">
                    <input type="text" ref="account"
                           placeholder="account"
                           onChange={this.handleChange.bind(this)}
                    />
                    <button onClick={this.search}>Search</button>
                </form>
                <ReactTable
                    data={this.state.data}
                    columns={columns}
                    pages={this.state.pages}
                    className="-striped -highlight"
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

import React, {Component} from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
var api = require('../../utils/api.js');
export default class Chart extends Component {
    constructor() {
        super();
        this.state = {
            account: "",
            country: "",
            account_name: "",
            data: []
        }
    }
    componentDidMount () {
        api.fetchStatusStatistic(this.state.account, this.state.country, this.state.account_name)
            .then(function (res) {
                this.setState({data: res});
            }.bind(this));

    }
    render() {
        return (
            <div className="chart">
                <Pie data={this.state.data} />
            </div>
        )
    }
}
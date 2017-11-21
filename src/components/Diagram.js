import React, { Component } from 'react';
import '../App.css';
var api = require('../../utils/api.js');
import {Bar, Pie} from 'react-chartjs-2';

export default class Diagram extends React.Component {
    constructor() {
        super();
        this.state = {
            chartData: {}
        }
    }
    componentDidMount () {
        api.fetchAccountLogs(this.state.account, this.state.country, this.state.account_name)
            .then(function (res) {
                let rawData = {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                        {
                            label: 'My First dataset',
                            backgroundColor: 'rgba(255,99,132,0.2)',
                            borderColor: 'rgba(255,99,132,1)',
                            borderWidth: 1,
                            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                            hoverBorderColor: 'rgba(255,99,132,1)',
                            data: [65, 59, 80, 81, 56, 55, 40]
                        }
                    ]
                };
                rawData.labels = res.map('account_name');
                rawData.datasets.data = res.map('order_7d');
                this.setState({chartData: rawData});
            }.bind(this));
    }
    static defaultProps = {
        displayTitle:true,
        displayLegend:true
    }
    render () {
        return (
            <div className="chart">
                <Bar
                    data={this.state.chartData}
                    width={100}
                    height={50}
                    options={{
                        title:{
                            display:this.props.displayTitle,
                            text:'Temprature in Summer',
                            fontSize: 25
                        },
                        legend:{
                            display:true,
                            position:'right'
                        }
                    }}
                />
                <Pie
                    data={this.state.chartData}
                    width={100}
                    height={100}
                    options={{
                        maintainAspectRatio: false
                    }}
                />
            </div>
        )
    }
}
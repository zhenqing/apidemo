import React, { Component } from 'react';
import '../App.css';
var api = require('../../utils/api.js');
import { LineChart, Line, XAxis, YAxis, Legend, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, ZAxis, LabelList, Label } from 'recharts';
export default class Diagram extends React.Component {
    constructor() {
        super();
        this.state = {
            chartData: [
                {name: "Jan", uv: 65, pv: 105},
                {name: "Feb", uv : 59, pv: 119},
                {name: "Mar", uv : 80, pv: 125},
                {name: "Apr", uv : 89, pv: 121},
                {name: "May", uv : 76, pv: 135},
                {name: "Jun", uv : 90, pv: 140}
            ],
            data1: [
                {name: "Jan", value: 65},
                {name: "Feb", value : 59},
                {name: "Mar", value : 80},
                {name: "Apr", value : 89},
                {name: "May", value : 76},
                {name: "Jun", value : 90}
            ],
            data2: [
                {name: "Jan", value: 105},
                {name: "Feb", value: 119},
                {name: "Mar", value: 125},
                {name: "Apr", value: 121},
                {name: "May", value: 135},
                {name: "Jun", value: 140}
            ],
            data01: [
                {time: 5, uv: 65, pv: 105},
                {time: 6, uv : 59, pv: 119},
                {time: 13, uv : 80, pv: 125},
                {time: 11, uv : 89, pv: 121},
                {time: 9, uv : 76, pv: 135},
                {time: 7, uv : 90, pv: 140}
            ],
            data02: [
                {time: 15, uv: 95, pv: 185},
                {time: 13, uv : 109, pv: 219},
                {time: 18, uv : 120, pv: 225},
                {time: 17, uv : 159, pv: 221},
                {time: 23, uv : 176, pv: 235},
                {time: 16, uv : 180, pv: 240}
            ]
        }
    }
    componentDidMount () {
        // api.fetchAccountLogs(this.state.account, this.state.country, this.state.account_name)
        //     .then(function (res) {
        //         let rawData = {
        //             labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        //             datasets: [
        //                 {
        //                     label: 'My First dataset',
        //                     backgroundColor: 'rgba(255,99,132,0.2)',
        //                     borderColor: 'rgba(255,99,132,1)',
        //                     borderWidth: 1,
        //                     hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        //                     hoverBorderColor: 'rgba(255,99,132,1)',
        //                     data: [65, 59, 80, 81, 56, 55, 40]
        //                 }
        //             ]
        //         };
        //         rawData.labels = res.map('account_name');
        //         rawData.datasets.data = res.map('order_7d');
        //         this.setState({chartData: rawData});
        //     }.bind(this));
    }


    render () {
        return (
            <div className="chart">
                <ScatterChart width={730} height={250}
                              margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="uv" name="uv" unit="cm" />
                    <YAxis dataKey="pv" name="pv" unit="kg" />
                    <ZAxis dataKey="time" range={[0, 30]} name="time" unit="km" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="A school" data={this.state.data01} fill="#8884d8" />
                    <Scatter name="B school" data={this.state.data02} fill="#82ca9d" />
                </ScatterChart>
                <PieChart width={730} height={250}>
                    <Pie data={this.state.data1} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
                    <Pie data={this.state.data2} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
                </PieChart>
                <LineChart width={600} height={400} data={this.state.chartData}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <Tooltip />
                </LineChart>
                <BarChart width={600} height={400} data={this.state.chartData}>
                    <XAxis dataKey="name">
                        <Label value="Pages of my website" offset={0} position="insideBottom" />
                    </XAxis>
                    <YAxis label={{ value: 'pv of page', angle: -90, position: 'insideLeft' }}/>
                    <Bar type="monotone" dataKey="uv" barSize={30} fill="#8884d8">
                        <LabelList dataKey="uv" position="insideTop" />
                    </Bar>
                    <Bar type="monotone" dataKey="pv" barSize={30} fill="#e884d8">
                        <LabelList dataKey="pv" position="insideTop" />
                    </Bar>
                    <Tooltip />
                    <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
                </BarChart>
            </div>
        )
    }
}
import React, {Component} from 'react';
var api = require('../../utils/api.js');
const rawData = [];
export default class WorkReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: rawData,
            loading: true
        };

    }

    componentDidMount() {
        api.fetchReports()
            .then(function (res) {
                this.setState({data: res});
            }.bind(this));
    }


    render() {
        return (
            <div>
                <ul>
                    <li>{this.state.data}</li>
                </ul>
            </div>
        )
    }

}
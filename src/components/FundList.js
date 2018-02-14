import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import Fund from "./Fund";
var api = require('../../utils/api.js');
import _ from 'lodash';

const rawData = [];
export default class FundList extends React.Component {
    constructor() {
        super();
        this.state = {
            data: rawData,
        }
    }

    render() {
        return (
            <table>
                <tr>
                    <th>SF</th>
                    <th>DV</th>
                    <th>RS</th>
                </tr>
                <tr>
                    <td>
                        <Fund belonging="SF"/>
                    </td>
                    <td>
                        <Fund belonging="DV"/>
                    </td>
                    <td>
                        <Fund belonging="RS"/>
                    </td>
                </tr>
            </table>
        )
    }
}


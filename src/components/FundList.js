import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import FundInfo from "./FundInfo";

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
                <thead>
                    <tr>
                        <th>SF</th>
                        <th>DV</th>
                        <th>RS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <FundInfo belonging="SF"/>
                        </td>
                        <td>
                            <FundInfo belonging="DV"/>
                        </td>
                        <td>
                            <FundInfo belonging="RS"/>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}


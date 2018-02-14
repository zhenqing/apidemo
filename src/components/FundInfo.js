import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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
            <Tabs>
                <TabList>
                    <Tab>Predict</Tab>
                    <Tab>Single Timeline</Tab>
                    <Tab>RS</Tab>
                </TabList>

                <TabPanel>
                    <Fund belonging="SF"/>
                </TabPanel>
                <TabPanel>
                    <Fund  belonging="DV"/>
                </TabPanel>
                <TabPanel>
                    <Fund  belonging="RS"/>
                </TabPanel>
            </Tabs>
        )
    }
}

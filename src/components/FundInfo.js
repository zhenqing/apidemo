import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Fund from "./Fund";
import FundTimeline from "./FundTimeline";
import FundPredict from "./FundPredict";
var api = require('../../utils/api.js');
import _ from 'lodash';

const rawData = [];
export default class FundInfo extends React.Component {
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
                    <Tab>Detail</Tab>
                    <Tab>Timeline</Tab>
                    <Tab>Predict</Tab>
                </TabList>

                <TabPanel>
                    <Fund belonging={this.props.belonging}/>
                </TabPanel>
                <TabPanel>
                    <FundTimeline belonging={this.props.belonging}/>
                </TabPanel>
                <TabPanel>
                    <FundPredict  belonging={this.props.belonging}/>
                </TabPanel>
            </Tabs>
        )
    }
}

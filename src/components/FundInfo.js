import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Fund from "./Fund";
import FundTimeline from "./FundTimeline";
import FundTmr from "./FundTmr";
import FundWeek from "./FundWeek";

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
                    <Tab>Tomorrow</Tab>
                    <Tab>Next Week</Tab>
                </TabList>

                <TabPanel>
                    <Fund belonging={this.props.belonging}/>
                </TabPanel>
                <TabPanel>
                    <FundTimeline belonging={this.props.belonging}/>
                </TabPanel>
                <TabPanel>
                    <FundTmr belonging={this.props.belonging}/>
                </TabPanel>
                <TabPanel>
                    <FundWeek belonging={this.props.belonging}/>
                </TabPanel>
            </Tabs>
        )
    }
}

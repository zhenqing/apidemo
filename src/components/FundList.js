import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import FundInfo from "./FundInfo";
import {parallelTab} from "./Functions";
import {Grid, Row, Col} from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Fund from "./Fund";
import FundTimeline from "./FundTimeline";
import FundTmr from "./FundTmr";
import FundWeek from "./FundWeek";

const rawData = [];
const details = parallelTab(Fund,['SF','DV','RS','INTL']);
const timelines = parallelTab(FundTimeline,['SF','DV','RS','INTL']);
const tmrs = parallelTab(FundTmr,['SF','DV','RS','INTL']);
const weeks = parallelTab(FundWeek,['SF','DV','RS','INTL']);
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
                    <Tab>Detail</Tab>
                    <Tab>Timeline</Tab>
                    <Tab>Tomorrow</Tab>
                    <Tab>Next Week</Tab>
                </TabList>

                <TabPanel>
                    <Row>
                        {details}
                    </Row>
                </TabPanel>
                <TabPanel>
                    <Row>
                        {timelines}
                    </Row>
                </TabPanel>
                <TabPanel>
                    <Row>
                        {tmrs}
                    </Row>
                </TabPanel>
                <TabPanel>
                    <Row>
                        {weeks}
                    </Row>
                </TabPanel>
            </Tabs>
        )
    }
}


import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AccountLog from "./AccountLog";

const rawData = [];
export default class AccountSummary extends React.Component {
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
                    <Tab>DS</Tab>
                    <Tab>PL</Tab>
                </TabList>

                <TabPanel>
                    <AccountLog business="DS"/>
                </TabPanel>
                <TabPanel>
                    <AccountLog business="PL"/>
                </TabPanel>
            </Tabs>
        )
    }
}

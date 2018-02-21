import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import FundInfo from "./FundInfo";
import {Grid, Row, Col} from "react-bootstrap";

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
        <div>
            <Row>
                <Col xs={6} md={3}>
                    <h4>SF</h4>
                </Col>
                <Col xs={6} md={3}>
                    <h4>DV</h4>
                </Col>
                <Col xs={6} md={3}>
                    <h4>RS</h4>
                </Col>
                <Col xs={6} md={3}>
                    <h4>INTL</h4>
                </Col>
            </Row>
            <Row>
                <Col xs={6} md={3}>
                    <FundInfo belonging="SF"/>
                </Col>
                <Col xs={6} md={3}>
                    <FundInfo belonging="DV"/>
                </Col>
                <Col xs={6} md={3}>
                    <FundInfo belonging="RS"/>
                </Col>
                <Col xs={6} md={3}>
                    <FundInfo belonging="INTL"/>
                </Col>
            </Row>
        </div>
        )
    }
}


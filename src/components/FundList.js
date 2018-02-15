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
            <Row className="show-grid">
                <Col xs={6} md={3}>
                    <h2>SF</h2>
                </Col>
                <Col xs={6} md={3}>
                    <h2>DV</h2>
                </Col>
                <Col xs={6} md={3}>
                    <h2>RS</h2>
                </Col>
                <Col xs={6} md={3}>
                    <h2>INTL</h2>
                </Col>
            </Row>
            <Row className="show-grid">
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


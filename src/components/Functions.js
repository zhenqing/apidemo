import React, { Component } from 'react';
import {Grid, Row, Col} from "react-bootstrap";

export function parallelTab(WrapElement, tabs) {
    return  tabs.map((tab) =>
                <Col key={tab} xl={6} md={3}>
                    <h4>{tab}</h4>
                    <WrapElement belonging={tab}/>
                </Col>
    );
}

export function tooltipContent (tooltipProps) {
    return <div>items: {Math.floor(tooltipProps.payload)}</div>
}
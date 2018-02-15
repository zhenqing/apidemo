import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import AccountSummary from "./components/AccountSummary";
import FundList from "./components/FundList";
import Fund from "./components/Fund";
import FundTimeline from "./components/FundTimeline";
import Statistic from "./components/Statistic";
import Diagram from "./components/Diagram";
import Summary from "./components/Summary";
import Role from "./components/Role";
import WorkReport from "./components/WorkReport";
import 'react-tabs/style/react-tabs.css';
import {Grid, Row, Col, Clearfix, Navbar, Nav, NavItem} from "react-bootstrap";
class App extends Component {
  render() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Navbar>
                        <Nav>
                            <NavItem href="/">Account Summary</NavItem>
                            <NavItem href="/fundlist">Funds</NavItem>
                        </Nav>
                    </Navbar>
                    <hr/>

                    <Route exact path="/" component={AccountSummary}/>
                    <Route path="/fundlist" component={FundList}/>
                    <Route path="/fund" component={Fund}/>
                    <Route path="/fundtimeline" component={FundTimeline}/>
                    <Route path="/workreport" component={WorkReport}/>
                    <Route path="/role" component={Role}/>
                    <Route path="/diagram" component={Diagram}/>
                    <Route path="/statistic" component={Statistic}/>
                    <Route path="/summary" component={Summary}/>
                </div>
            </Router>
        </div>
    );
  }
}

export default App;

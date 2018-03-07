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
import AccountLog from "./components/AccountLog";
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
                            <NavItem href="/accountlog/00US">Account Detail</NavItem>
                            <NavItem href="/fundtimeline/00US">Fund Detail</NavItem>
                        </Nav>
                    </Navbar>

                    <Route exact path="/" component={AccountSummary}/>
                    <Route path="/fundlist" component={FundList}/>
                    <Route path="/fund/:logDate?" component={Fund}/>
                    <Route path="/fundtimeline/:accountName?" component={FundTimeline}/>
                    <Route path="/workreport" component={WorkReport}/>
                    <Route path="/role" component={Role}/>
                    <Route path="/diagram" component={Diagram}/>
                    <Route path="/statistic" component={Statistic}/>
                    <Route path="/summary" component={Summary}/>
                    <Route path="/accountlog/:accountName?" component={AccountLog}/>
                </div>
            </Router>
        </div>
    );
  }
}

export default App;

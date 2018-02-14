import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import AccountLog from "./components/AccountLog";
import FundList from "./components/FundList";
import Fund from "./components/Fund";
import FundTimeline from "./components/FundTimeline";
import Statistic from "./components/Statistic";
import Diagram from "./components/Diagram";
import Summary from "./components/Summary";
import Role from "./components/Role";
import WorkReport from "./components/WorkReport";
import 'react-tabs/style/react-tabs.css';

class App extends Component {
  render() {
    return (
        <div className="App">
            <Router>
                <div>
                    <ul className="navbar">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/fundlist">Funds</Link></li>
                        <li><Link to="/fund">Fund</Link></li>
                        <li><Link to="/fundtimeline">Fund Timeline</Link></li>
                        <li><Link to="/workreport">Work Report</Link></li>
                        <li><Link to="/role">Role</Link></li>
                        <li><Link to="/diagram">Diagram</Link></li>
                        <li><Link to="/statistic">Statistic</Link></li>
                        <li><Link to="/summary">Summary</Link></li>
                    </ul>

                    <hr/>

                    <Route exact path="/" component={AccountLog}/>
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

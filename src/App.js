import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import AccountLog from "./components/AccountLog";
import Fund from "./components/Fund";
import Statistic from "./components/Statistic";
import Diagram from "./components/Diagram";
import Summary from "./components/Summary";
import Role from "./components/Role";
import WorkReport from "./components/WorkReport";

class App extends Component {
  render() {
    return (
        <div className="App">
            <Router>
                <div>
                    <ul className="navbar">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/fund">Fund</Link></li>
                        <li><Link to="/workreport">Work Report</Link></li>
                        <li><Link to="/role">Role</Link></li>
                        <li><Link to="/diagram">Diagram</Link></li>
                        <li><Link to="/statistic">Statistic</Link></li>
                        <li><Link to="/summary">Summary</Link></li>
                    </ul>

                    <hr/>

                    <Route exact path="/" component={AccountLog}/>
                    <Route exact path="/fund" component={Fund}/>
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

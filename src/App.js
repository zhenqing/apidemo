import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import AccountLog from "./components/AccountLog";
import Statistic from "./components/Statistic";
import Diagram from "./components/Diagram";
import Summary from "./components/Summary";
class App extends Component {
  render() {
    return (
        <div className="App">
            <Router>
                <div>
                    <ul className="navbar">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/diagram">Diagram</Link></li>
                        <li><Link to="/statistic">Statistic</Link></li>
                        <li><Link to="/summary">Summary</Link></li>
                    </ul>

                    <hr/>

                    <Route exact path="/" component={AccountLog}/>
                    <Route path="/diagram" component={Diagram}/>
                    <Route path="/statistic" component={Statistic}/>
                    <Route path="/summary" component={Summary}/>
                    <Route path="/accounthistory/:account" render={() => <h1>diagram</h1>}/>
                </div>
            </Router>
        </div>
    );
  }
}

export default App;

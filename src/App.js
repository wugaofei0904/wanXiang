import React, { Component } from 'react';
import { Button } from 'antd';
import './App.css';
import { Route, Link, Switch, HashRouter as Router} from 'react-router-dom';
import Page1 from './pages/page1/index.js';
import Page2 from './pages/page2/index.js';


class App extends Component {
  render() {
    return (
          <Router>
            <Switch>
                  <Route exact path="/" component={Page1} />
                  <Route exact path="/page2" component={Page2} />
              <Route component={Page1} />
            </Switch>
          </Router>
    );
  }

}

export default App;
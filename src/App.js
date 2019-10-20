import React, { Component } from 'react';
import { Button } from 'antd';
import './App.css';
import { Route, Link, Switch, HashRouter as Router, withRouter } from 'react-router-dom';
import ArticleManage from './pages/articleManage/index.js';
import AnthorManage from './pages/anthorManage/index.js';
import ActionHistory from './pages/actionHistory/index.js';
import EditPage from './pages/edit/index.js';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={ArticleManage} />
          <Route exact path="/articleManage" component={ArticleManage} />
          <Route exact path="/anthorManage" component={AnthorManage} />
          <Route exact path="/actionHistory" component={ActionHistory} />
          <Route exact path="/editPage" component={EditPage} />
          <Route component={ArticleManage} />
        </Switch>
      </Router>
    );
  }

}

export default App;

// export default withRouter(App);
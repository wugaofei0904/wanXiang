import React, { Component } from 'react';
import { Button } from 'antd';
import './App.css';
import { Route, Link, Switch, HashRouter as Router, withRouter } from 'react-router-dom';
import ArticleManage from './pages/articleManage/index.js';
import CommentManage from './pages/CommentManage/index.js'
import AnthorManage from './pages/anthorManage/index.js';
import ActionHistory from './pages/actionHistory/index.js';
import EditPage from './pages/edit/index.js';
import LoginPage from './pages/login/index.js';
import CreateAnthor from './pages/createAnthor/index.js';
import CommoditySet from './pages/commoditySet/index.js';
import BannerManage from './pages/bannerManage';
// import OtherPage from './pages/otherPage/index.js';

class App extends Component {


  componentDidMount = () => {
    window.initLogin = () => {
      // alert('用户登陆失效，请重新登陆！');
       window.location.href = '#';
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          {/* <Route exact path="/" component={OtherPage} /> */}
          <Route exact path="/" component={LoginPage} />
          <Route exact path="/articleManage" component={ArticleManage} />
          <Route exact path="/commentManage" component={CommentManage} />
          <Route exact path="/commoditySet" component={CommoditySet} />
          <Route exact path="/anthorManage" component={AnthorManage} />
          <Route exact path="/actionHistory" component={ActionHistory} />
          <Route exact path="/editPage" component={EditPage} />
          <Route exact path='/editPage/:edit' component={EditPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/createAnthor" component={CreateAnthor} />
          <Route exact path="/bannerManage" component={BannerManage} />
          {/* <Route exact path="/createAnthor/:edit/:data" component={CreateAnthor} /> */}
          <Route component={ArticleManage} />
        </Switch>
      </Router>
    );
  }

}

export default App;

// export default withRouter(App);
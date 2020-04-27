import React, { Component } from 'react';
import { Button } from 'antd';
import './App.css';
import { Route, Link, Switch, HashRouter as Router, withRouter } from 'react-router-dom';
import ArticleManage from './pages/articleManage/index.js';
import CommentManage from './pages/commentManage/index.js'
import AnthorManage from './pages/anthorManage/index.js';
import ActionHistory from './pages/actionHistory/index.js';
import AuthorityManage from './pages/authorityManage/index.js';
import EditPage from './pages/edit/index.js';
import LoginPage from './pages/login/index.js';
import CreateAnthor from './pages/createAnthor/index.js';
import CommoditySet from './pages/commoditySet/index.js';
import BannerManage from './pages/bannerManage';
import AuthManage from './pages/authManage'
import CostCenter from './pages/costCenter/index.js'
import DayCost from "./pages/costCenter/components/DayCost";
import MonthCost from "./pages/costCenter/components/MonthCost";
import HocPrivateRoute from './HocPrivateRoute.js';
let  PrivateRoute =  HocPrivateRoute(Route);
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

          {/* 权限路由 */}
          <PrivateRoute path="/articleManage"  component={ArticleManage} />
          <PrivateRoute path="/commentManage"  component={CommentManage} />
          <PrivateRoute exact path="/commoditySet" component={CommoditySet} />
          <PrivateRoute exact path="/anthorManage" component={AnthorManage} />
          <PrivateRoute exact path="/actionHistory" component={ActionHistory} />
          <PrivateRoute exact path="/authorityManage" component={AuthorityManage} />
          <PrivateRoute exact path="/bannerManage" component={BannerManage} />
          <PrivateRoute exact path="/authManage" component={AuthManage} />
          <PrivateRoute exact path="/costCenter" component={CostCenter} />

          {/* <Route exact path="/editPage" component={EditPage} /> */}
          <Route exact path='/editPage/:edit' component={EditPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/createAnthor" component={CreateAnthor} />
          <Route exact path="/dayCost" component={DayCost} />
          <Route exact path="/monthCost" component={MonthCost} />
          {/* <Route exact path="/createAnthor/:edit/:data" component={CreateAnthor} /> */}
          <Route component={ArticleManage} />
        </Switch>
      </Router>
    );
  }

}

export default App;

// export default withRouter(App);

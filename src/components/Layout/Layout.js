import React, { Component } from 'react'
import Header from '../Header/Header'
import { Route,  Link, Switch, Redirect } from 'react-router-dom'
import asyncComponent from '../AsyncComponent/AsyncComponent'
import './Layout.css';

const AsyncAppsList = asyncComponent(() => import('../Apps/List/List'));
const AsyncAppsCreate = asyncComponent(() => import('../Apps/Create/Create'));
const AsyncAppsPublish = asyncComponent(() => import('../Apps/Publish/Publish'));

// const Home = () => (
//   <div>
//     <h2>敬请期待......</h2>
//   </div>
// )

const Home = () => (
  <Redirect to="/apps/list"/>
)

const Footer = () => (
  <footer id="footer">
    <div className="footer-info">
      <span>说明：系统不提供编译功能，需要将编译后的文件上传，支持的文件格式为zip\tar\jar等，使用问题联系 lvyong  © 2017 统一部署系统</span>
      <span className="dot">·</span>  
      <span><a href="/">联系我们</a></span>
      <span className="dot">·</span>  
      <span><a href="/">意见反馈</a></span>
    </div>
  </footer>
)

class Pagelayout extends Component {
  state = {
    collapsed: false,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <div className="page-layout">
        <Header />
        <div className="main-wrapper">
          <div className="main-content">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/apps/list" component={AsyncAppsList} />
              <Route exact path="/apps/create" component={AsyncAppsCreate} />
              <Route path="/apps/edit/:appId" component={AsyncAppsCreate} />
              <Route path="/apps/publish/:appId" component={AsyncAppsPublish} />
              <Route path="*" render={() => { return (<div>NOT FOND</div> ) }} />
            </Switch>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Pagelayout;
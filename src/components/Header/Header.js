import React, { Component } from 'react'
import { Menu, message } from 'antd';
import { NavLink, Link } from 'react-router-dom'
import Fetch from '../../Commons/Fetch/Fetch'

import './Header.css'

class Header extends Component {
  state = {
    userName: '',
    env: '',
    current: '/web',
  }
  
  componentDidMount() {
    const key1 = window.location.pathname.split('/')[1]
    const key2 = window.location.pathname.split('/')[2]
    const current = key2 ? `/${key1}/${key2}` : `/${key1}`
    const userName = this.getCookie('userName')
    const env = this.getCookie('env')
    
    this.setState({ current, userName, env})
  }

  handleClick = (e) => {
    this.setState({ current: e.key });
  }

  getCookie = name => {
    if (document.cookie.length > 0) {
      let start = document.cookie.indexOf(name + "=")
      if (start != -1) { 
        start = start + name.length + 1 
        let end = document.cookie.indexOf(";", start)
        if (end === -1) end = document.cookie.length
        return unescape(document.cookie.substring(start, end))
      } 
    }
    return ""
  }

  onClickLogout() {
    Fetch.postJSON(`/logout`).then(
      res => {
        window.location.href = `/web/login`
      }
    ).catch( e => {
      e && message.error('退出失败');
    })
  }

  render() {
    const { userName } = this.state
    return (
      <header id="header">
        <div className="header-logo">
          <Link className="header-title" to="/">统一部署系统{this.state.env}</Link>
        </div>
        <div className="user-info">
          <div className="user-name" title={userName}>{userName}</div>
          <a href="javascript:;" onClick={this.onClickLogout.bind(this)}>退出</a>
        </div>

        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          {/* <Menu.Item key="/web">
            <NavLink to="/">首页</NavLink>
          </Menu.Item> */}
          <Menu.Item key="/web/apps">
            <NavLink to="/apps/list">应用管理</NavLink>
          </Menu.Item>
        </Menu>
      </header>
    )
  }
}

export default Header
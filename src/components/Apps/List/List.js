import React, { Component } from 'react'
import Breadcrumb from '../../../Commons/Breadcrumb/Breadcrumb'
import { Button, message } from 'antd'
import { Link } from 'react-router-dom'
import Fetch from '../../../Commons/Fetch/Fetch'
import AppsCard from './AppsCard'
import './List.css'

class Appslist extends Component {
  state = {
    lists: [],
    spinning: true
  }

  componentDidMount() {
    Fetch.getJSON('/api/project/list').then(
      res => {
        if (res && res.length > 0) this.setState({ lists: res, spinning: false })
      }
    ).catch( e => {
      e && this.dealError(e)
    })
  }
  /**
   * 错误信息处理
   */
  dealError(e) {
    let msg = e && e.message || '请求错误'
    if (e && e.code === 403) {
      msg = `${msg}, 即将跳转登录页`
      setTimeout(() => {
        window.location.href = `/web/login`
      }, 3000)
    }
    message.error(msg)
    this.setState({ spinning: false })
  }
  /**
   * 格式化列表数据
   */
  formatData(data) {
    let result = [];
    for(let i=0; i<data.length; i+=4) {
      result.push(data.slice(i, i+4))
    }
    return result
  }
  /**
   * 点击按钮，获取详情来判断是否有权限（2333......）
   */
  onClickOperate(item, isEdit) {
    if (!item || !item.id) return
    const url = isEdit ? `/web/apps/edit/${item.id}` : `/web/apps/publish/${item.id}`
    this.setState({ spinning: true }, () => {
      Fetch.getJSON(`/api/project/${item.id}/detail`).then(
        res => {
          this.setState({spinning: false}, () => window.location.href = url )
        }
      ).catch( e => {
        e && this.dealError(e)
      })
    })
  }

  render() {

    const routes = [
      { path: '', name: '应用管理' },
      { path: '', name: '应用列表' }
    ]
    const { lists, spinning } = this.state 
    const data = this.formatData(lists)

    return (
      <div>
        <Breadcrumb routes={routes} />
        <Link to="/apps/create"><Button className="creat-app-btn" type="primary">创建应用</Button></Link>
        <AppsCard data={data} spinning={spinning} onClickOperate={this.onClickOperate.bind(this)} />
      </div>
    )
  }
}

export default Appslist
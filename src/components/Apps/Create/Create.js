import React, { Component } from 'react'
import { Steps, message, Spin } from 'antd';
import Breadcrumb from '../../../Commons/Breadcrumb/Breadcrumb'
import Basic from '../Basic/Basic'
import Servers from '../Servers/Servers'
import Script from '../Script/Script'
import './Create.css'
import Fetch from '../../../Commons/Fetch/Fetch';

const Step = Steps.Step

const steps = [{ title: '基本信息' }, { title: '服务器选择' }, { title: '部署脚本' }]

class CreateApp extends Component {
  state = {
    current: 0,
    saving: false,
    spinning: false
  }
  componentDidMount = () => {
    const { match } = this.props
    const { appId } = match.params
    const isNumber = !isNaN(parseInt(appId)) && isFinite(appId)
    if (!appId) return
    if (appId && isNumber) { 
      this.setState({ spinning: true, appId }, () => { this.getAppDetail(appId) }) 
    } else {
      message.warning(`应用ID格式不正确`)
    }
  }
  /**
   * 获取应用详情
   */
  getAppDetail(appId) {
    Fetch.getJSON(`/api/project/${appId}/detail`).then(
      res => {
        if (res && Object.keys(res).length > 0) {
          this.setState({ ...res, spinning: false })
        }
      }
    ).catch( e => {
      e && this.dealError(e)
      this.setState({ spinning: false })
    })
  }
  /**
   * 错误信息处理
   */
  dealError(e) {
    let msg = (e && e.message) || '请求错误'
    if (e && e.code === 403) {
      msg = `${msg}, 即将跳转登录页`
      setTimeout(() => {
        window.location.href = `/web/login`
      }, 3000)
    }
    message.error(msg)
  }
  /**
   * 点击保存
   */
  onClickSave = (values, options) => {
    const { current, id } = this.state
    if (id) values.id = id
    this.setState({saving: true}, () => {
      Fetch.postJSON('/api/project/update', values, options).then(
        res => {
          if (current === 0 && res) values.id = res 
          this.onSuccess(values)
          message.success('保存成功')

          // current === 2 最后一步
          if (current === 2) window.location.href = `/web/apps/list`
        }
      ).catch( e => {
        e && this.dealError(e)
        this.setState({saving : false})
      })
    })
  }
  /**
   * 成功后的处理
   */
  onSuccess = values => {
    const { current } = this.state
    const len = steps.length - 1

    if (current === len) {
      this.setState({
        ...values,
        saving: false
      })
    } else {
      this.setState({
        ...values,
        saving: false,
        current: current + 1
      })
    }
  }
  /**
   * 点击步骤条
   */
  onClickStep = index => {
    const { current, id='', serverList=[] } = this.state
    const len = serverList && serverList.length
    if (id) {
      if ((len === 0 && index === 2) || current === index) return
      this.setState({current: index})
    }
  }

  render() {

    const { current, spinning, appId } = this.state;
    const routes = [
      { path: '/apps/list', name: '应用管理' },
      { path: '', name: appId ? '编辑应用' : '创建应用' }
    ]

    return (
      <div>
        <Breadcrumb routes={routes} />
        <Spin spinning={spinning}>
          <div className="steps-container">
            <Steps current={current}>
              {steps.map((item, index) => 
                <Step className="step-item" key={item.title} title={item.title} onClick={this.onClickStep.bind(this, index)} />
              )}
            </Steps>
            
            <div className="steps-content">
              { current === 0 && <Basic onClickSave={this.onClickSave.bind(this)} {...this.state} /> } 
              { current === 1 && <Servers onClickSave={this.onClickSave.bind(this)} {...this.state} /> } 
              { current === 2 && <Script onClickSave={this.onClickSave.bind(this)} {...this.state} /> } 
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}

export default CreateApp
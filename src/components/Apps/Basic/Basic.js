import React, { Component } from 'react'
import { Form, Input, Checkbox, Button, message } from 'antd';
import Fetch from '../../../Commons/Fetch/Fetch'
import './Basic.css'

const FormItem = Form.Item;

class Basic extends Component {

  state = {
    deploymentPath: '/var/bjca/',
    codeDisabled: false
  }

  componentDidMount = () => {
    this.setState({...this.props})
  }
  componentWillReceiveProps = (nextProps) => {
    this.setState({...nextProps})
  }
  /**
   * 点击提交
   */
  handleSubmit = e => {
    e.preventDefault()
    const { onClickSave, id } = this.props
    const fieldNames = id ? ['name'] : ''

    this.props.form.validateFields(fieldNames, (err, values) => {
      if (!err) {
        let result = this.props.form.getFieldsValue()
        result.runType = result.runTypeCheck ? 2 : 1
        if (id) result.id = id
        delete result.runTypeCheck
        onClickSave(result)
      }
    });
  }
  /**
   * 应用的唯一标识
   */
  getCodeValidate = (rule, value, callback) => {
    const regexp = /^[a-zA-Z0-9-_]+$/
    value = value.trim()

    if(!value) {
      callback('应用的唯一标识不能为空')
    } else if (!regexp.test(value)) {
      callback('应用的唯一标识只能是字母、数字、-、_ 的组合')
    } else {
      this.codeValidate(value, callback)
    }
  }
  /**
   * 唯一标识请求
   */
  codeValidate = (value, callback) => {
    this.setState({ codeDisabled: true }, () => {
      Fetch.getJSON(`/api/project/${value}/validate`).then(
        res => {
          if (res && !res.validate) callback('应用已经存在, 请换一个名字')
          this.setState({
            deploymentPath: res.deploymentPath || '',
            codeDisabled: false
          }, callback())
        }
      ).catch(e => {
        this.setState({ codeDisabled: false }, () => {
          e && this.dealError(e, callback)
        })
      })
    })
  }
  /**
   * 错误信息处理
   */
  dealError(e, callback) {
    let msg = e && e.message || '请求报错'
    if (e && e.code === 403) {
      msg = `${msg}, 即将跳转登录页`
      setTimeout(() => {
        window.location.href = `/web/login`
      }, 3000)
    }
    message.error(msg)
    callback(msg)
  }

  render() {

    const { saving } = this.props
    const { getFieldDecorator } = this.props.form
    const { sourcePath, deploymentPath, codeDisabled, name='', code='', id='', runType=1 } = this.state
    const hasId = id ? true : false
    const runTypeCheck = runType === 1 ? false : true

    return (
      <div className="basic-info-box">
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            colon={false}
            label="为您的应用取一个中文名称"
            extra="仅做显示用，不产生具体依赖，例如：交易-后端服务接口、会员-前端调用"
          >
            {getFieldDecorator('name', {
              initialValue: name,
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{ required: true, message: '应用中文名称不能为空' }],
            })(
              <Input placeholder='请输入应用中文名称' />
            )}
          </FormItem>

          <FormItem
            colon={false}
            hasFeedback
            className="code-form-item"
            label="唯一的英文应用代号"
            extra="全局唯一应用代号，可做应用名称，例如：order、trade_order、xapi"
          >
            {getFieldDecorator('code', {
              initialValue: code,
              validateTrigger: 'onBlur',
              rules: [
                { validator: this.getCodeValidate }
              ],
            })(
              <Input placeholder="请输入应用的唯一标识" disabled={codeDisabled || hasId} />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('runTypeCheck', {
              initialValue: runTypeCheck,
              valuePropName: 'checked',
            })(
              <Checkbox>Docker 部署</Checkbox>
            )}
          </FormItem>

            <FormItem
                colon={false}
                label="源码地址"
                extra="使用git协议 git@server:path.git"
            >
                {getFieldDecorator('sourcePath', {
                    initialValue: sourcePath
                })(
                    <Input placeholder="请输入源码地址"/>
                )}
            </FormItem>

          <FormItem
            colon={false}
            label="服务器应用部署路径"
            extra="仅当非docker模式部署生效，路径规则 「/var/bjca/」+ 「应用代号」"
          >
            {getFieldDecorator('deploymentPath', {
              initialValue: deploymentPath
            })(
              <Input placeholder="请输入应用的唯一标识" disabled />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" loading={saving} disabled={codeDisabled}>保存，前往下一步</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(Basic);
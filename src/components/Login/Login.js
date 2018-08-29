import React, { Component } from 'react'
import { Form, Input, Button, message, Row, Col } from 'antd';
import Fetch from '../../Commons/Fetch/Fetch'
import './Login.css'

class Login extends Component {
  state = {
    getCodeLoading: false,
    loginLoading: false
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) values && this.save(values)
    });
  }
  /**
   * 登录
   */
  save(values) {
    this.setState({loginLoading: true}, () => {
      Fetch.postJSON('/login', values).then(
        res => {
          window.location.href = `/web/apps/list`
        }
      ).catch(e => {
        if (e && e.status !== 200) {
          message.error('登录失败')
        } else if (e.message) {
          message.error(e.message)
        }
        this.setState({ loginLoading: false })
      })
    })
  }
  /**
   * 获取验证码
   */
  getCode = (values) => {
    this.setState({getCodeLoading: true}, () => {
      Fetch.postJSON('/api/sendTicket', values).then(
        res => {
          message.success('验证码已发送，请注意查收')
          this.setState({getCodeLoading: false})
        }
      ).catch(e => {
        if (e && e.status !== 200) {
          message.error("错误" + e.message)
        } else if (e.message) {
          message.error(e.message)
        }
        this.setState({getCodeLoading: false})
      })
    })
  }
  /**
   * 点击获取验证码
   */
  onClickGetCode = (e) => {
    e.preventDefault();
    this.props.form.validateFields(['email'], (err, values) => {
      if (!err) values && values.email && this.getCode(values)
    });
  } 

  render() {
    const { getFieldDecorator } = this.props.form
    const { getCodeLoading, loginLoading } = this.state
    const FormItem = Form.Item
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 }
    };

    return (
      <div className="login-container">
        <div className="form-box">
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <FormItem label="邮箱" {...formItemLayout}>
            { getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: '邮箱格式不正确'
                }, {
                  required: true, message: '邮箱地址必填哦'
                }],
              })(<Input />) 
            }
            </FormItem>

            <FormItem label="验证码" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={12}>
                  { getFieldDecorator('ticket', {
                      rules: [{
                        required: true, message: '验证码必填哦'
                      }],
                    })(<Input type="password" />) 
                  }
                </Col>
                <Col span={12}>
                  <Button onClick={this.onClickGetCode.bind(this)} loading={getCodeLoading} disabled={loginLoading}>获取验证码</Button>
                </Col>
              </Row>
            </FormItem>

            <FormItem className="remember-box">
              <Button type="primary" htmlType="submit" className="login-form-button" loading={loginLoading} disabled={getCodeLoading}>登录</Button>
            </FormItem>

          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(Login)
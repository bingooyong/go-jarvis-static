import React, { Component } from 'react'
import { Form, Input, Button, Row, Col } from 'antd';
import Fetch from '../../../Commons/Fetch/Fetch'

const FormItem = Form.Item;
const { TextArea } = Input;

class Script extends Component {

  state = {
    startScript: '', 
    stopScript: '', 
    restartScript: '',
    packageScript: '',
    beforeDeploymentScript: '', 
    deploymentScript: '',
    afterDeploymentScript: ''
  }

  componentDidMount = () => {
    this.setState({...this.props})
  }
  /**
   * 点击提交
   */
  handleSubmit = e => {
    e.preventDefault();
    const { onClickSave } = this.props

    this.props.form.validateFields((err, values) => {
      if (!err) onClickSave(values)
    });
  }

  render() {

    const { getFieldDecorator } = this.props.form
    const { saving } = this.props
    const { startScript, stopScript, restartScript, packageScript, beforeDeploymentScript, deploymentScript, afterDeploymentScript } = this.state

    return (
      <Form onSubmit={this.handleSubmit} style={{width: '100%'}}>
        <Row type="flex">
          <Col span={11}>
            <FormItem
              colon={false}
              label="启动服务命令"
              extra="类似 systemctl nginx start"
            >
              {getFieldDecorator('startScript', {
                initialValue: startScript
              })(
                <TextArea autosize={{ minRows: 2, maxRows: 4 }} />
              )}
            </FormItem>

            <FormItem
              colon={false}
              label="停止服务命令"
              extra="类似 systemctl nginx stop"
            >
              {getFieldDecorator('stopScript', {
                initialValue: stopScript
              })(
                <TextArea autosize={{ minRows: 2, maxRows: 4 }} />
              )}
            </FormItem>

            <FormItem
              colon={false}
              label="重启服务命令"
              extra="类似 systemctl nginx restart"
            >
              {getFieldDecorator('restartScript', {
                initialValue: restartScript
              })(
                <TextArea autosize={{ minRows: 2, maxRows: 4 }} />
              )}
            </FormItem>
          </Col>
          
          <Col span={11} offset={2}>
              <FormItem
                  colon={false}
                  label="打包机执行命令"
                  extra="提示：不需要添加 rm -tf {webroot} , 系统会自动处理"
              >
                  {getFieldDecorator('packageScript', {
                      initialValue: packageScript
                  })(
                      <TextArea autosize={{ minRows: 2, maxRows: 4 }} />
                  )}
                  </FormItem>

            <FormItem
              colon={false}
              label="部署前"
              extra="提示：不需要添加 rm -tf {webroot} , 系统会自动处理"
            >
              {getFieldDecorator('beforeDeploymentScript', {
                initialValue: beforeDeploymentScript
              })(
                <TextArea autosize={{ minRows: 2, maxRows: 4 }} />
              )}
            </FormItem>

            <FormItem
              colon={false}
              label="部署配置"
              extra="提示：如果你不明白此页面的其他textarea的执行时机，索性你把所有要执行的命令放在这个框里面就对了，ps：如果上传的是zip包或者tar包，系统已经帮你解压了"
            >
              {getFieldDecorator('deploymentScript', {
                initialValue: deploymentScript
              })(
                <TextArea autosize={{ minRows: 2, maxRows: 4 }} />
              )}
            </FormItem>

            <FormItem
              colon={false}
              label="部署后"
              extra="一般执行杀掉服务、重启服务命令"
            >
              {getFieldDecorator('afterDeploymentScript', {
                initialValue: afterDeploymentScript
              })(
                <TextArea autosize={{ minRows: 2, maxRows: 4 }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Button type="primary" htmlType="submit" loading={saving} style={{'width': '120px', margin: '10px 0px 30px'}}>保存</Button>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(Script);
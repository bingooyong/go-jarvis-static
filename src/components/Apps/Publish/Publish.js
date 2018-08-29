import React, {Component} from 'react'
import Breadcrumb from '../../../Commons/Breadcrumb/Breadcrumb'
import {Table, Form, Input, Button, message, Spin, Row, Col} from 'antd'
import Fetch from '../../../Commons/Fetch/Fetch'
import UploadFile from '../../../Commons/Upload/Upload';
import './Publish.css'

const FormItem = Form.Item;
const {TextArea} = Input;
const columns = [{
  title: '服务器IP',
  dataIndex: 'ip',
}]

class Publish extends Component {
  state = {
    spinning: false,
    loading: false,
    code: '',
    record: '',
    description: '',
    filePath: '',
    tree: ''
  }

  componentDidMount() {
    const {match} = this.props
    const {appId} = match.params
    const isNumber = !isNaN(parseInt(appId)) && isFinite(appId)
    if (appId && isNumber) {
      this.setState({spinning: true, appId}, () => {
        this.getLastDeployment(appId)
        this.getProjectInfo(appId)
      })
    } else {
      message.warning(`应用ID不正确`)
    }
  }

  /**
   * 获取应用最后的发版信息
   */
  getLastDeployment(appId) {
    Fetch.getJSON(`/api/project/${appId}/lastDeployment`).then(
      res => {
        if (res) {
          this.setState({...res, spinning: false})
        } else {
          this.setState({spinning: false})
        }
      }
    ).catch(e => {
      e && this.dealError(e)
    })
  }

  getProjectInfo(appId) {
    Fetch.getJSON(`/api/project/${appId}/detail`).then(
      res => {
        if (res) {
          let data = [];
          res.serverList.map((item, index) => {
            data.push({id: index, ip: item})
          });
          this.setState({listData: data, spinning: false})
          this.setState({...res, spinning: false})
        } else {
          this.setState({spinning: false})
        }
      }
    ).catch(e => {
      e && this.dealError(e)
    })
  }

  /**
   * 获取应用版本发布记录
   */
  getRecord(id) {
    Fetch.getJSON(`/api/deployment/${id}/record`).then(
      res => {
        this.setState({record: res.text}, () => {
          if (res && res.status === 'UNKOWN') {
            setTimeout(() => {
              this.getRecord(id)
            }, 1000)
          } else {
            this.setState({loading: false})
          }
        })
      }
    ).catch(e => {
      e && this.dealError(e)
    })
  }

  /**
   * 点击发版
   */
  handleSubmit = e => {
    e.preventDefault()
    const {appId, filePath} = this.state

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {}
        params.serverList = this.state.serverList
        params.projectId = parseInt(appId)
        params.description = values.description
        params.filePath = filePath
        this.publish(params)
      }
    });
  }

  /**
   * 发版
   */
  publish(params) {
    this.setState({loading: true}, () => {
      Fetch.postJSON(`/api/deployment/publish`, params).then(
        res => {
          this.setState({spinning: false}, () => this.getRecord(res))
        }
      ).catch(e => {
        e && this.dealError(e)
      })
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
    this.setState({spinning: false})
  }

  /**
   * 点击上传文件
   */
  onUploadFile(values) {
    const state = Object.assign({}, this.state, values)
    this.setState({...state})
  }

  onSelectChange = (serverList) => {
    this.setState({serverList});
  }

  render() {

    const routes = [
      {path: '/apps/list', name: '应用管理'},
      {path: '', name: '应用发版'}
    ]
    const {getFieldDecorator} = this.props.form
    const {loading, spinning, record, filePath, tree, description, code, serverList, listData} = this.state
    const rowSelection = {
      selectedRowKeys: serverList,
      onChange: this.onSelectChange,
      getCheckboxProps: () => ({
        disabled: true,
      }),
    };

    return (
      <div>
        <Breadcrumb routes={routes}/>
        <Spin spinning={spinning}>
          <Row type="flex" className="publish-container">
            <Col span={10}>
              <Form onSubmit={this.handleSubmit}>
                <FormItem colon={false} label="发版应用">
                  <Input placeholder='发版应用' disabled={true} value={code}/>
                </FormItem>
                <FormItem
                  colon={false}
                  label="发版说明"
                  extra="例如：修复xxx错误的问题"
                >
                  {getFieldDecorator('description', {
                    initialValue: description,
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{required: true, message: '发版说明不能为空'}],
                  })(
                    <Input placeholder='请输入发版说明' disabled={loading}/>
                  )}
                </FormItem>

                <UploadFile onUploadFile={this.onUploadFile.bind(this)} loading={loading}/>

                <div className="directory-box">
                  <div className="directory-header">$ {filePath}</div>
                  <TextArea value={tree} autosize={{minRows: 5, maxRows: 15}} disabled className="directory-content"/>
                </div>

                <Button type="primary" htmlType="submit" className="publish-btn" loading={loading}>发版</Button>

              </Form>
            </Col>
            <Col span={12} offset={2}>
              <div className="publish-label">发版服务器</div>
              <Table className="publish-table"
                     rowSelection={rowSelection}
                     columns={columns}
                     dataSource={listData}
                     rowKey='ip'
                     pagination={false}
                     locale={{emptyText: '暂无数据'}}
              />
              <div className="publish-label">发版过程明细</div>
              <TextArea value={record} autosize={{minRows: 5}} disabled className="publish-record"/>
            </Col>
          </Row>
        </Spin>
      </div>
    )
  }
}

export default Form.create()(Publish)
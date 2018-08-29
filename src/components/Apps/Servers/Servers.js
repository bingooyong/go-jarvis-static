import React, { Component } from 'react'
import { Table, Button, message, Spin } from 'antd';
import Fetch from '../../../Commons/Fetch/Fetch'
import './Servers.css'

const columns = [{
  title: '服务器IP',
  dataIndex: 'ip',
}, {
  title: '机器配置',
  dataIndex: 'configuration',
}, {
  title: '已部署应用',
  render: (text, record, index) => (
    <div className="project-btn-box">
    {
      record.deploymentProjects && record.deploymentProjects.length > 0 &&
      record.deploymentProjects.map((v, k) => (<div className="project-name" key={k}>{v.name}</div>))
    }
    </div>
  )
}];

class Servers extends Component {

  state = {
    listData: [],
    serverList: [],
    spinning: true,
    hasServer: true
  }

  componentDidMount = () => {
    this.setState({...this.props}, () => {
      Fetch.getJSON(`/api/server/list`).then(
        res => {
          console.log("componentDidMount ", res)
          res && this.formatTableData(res)
        }
      ).catch( e => {
        e && this.dealError(e)
        this.setState({ spinning: false })
      })
    })
  }
  /**
   * 格式化表格数据
   */
  formatTableData(data) {
    if (!data || data.length === 0) return
    data.map((item, index) => {
      item.configuration = `${item.coreNum}Core ${item.memorySize}GHz`
    })
    this.setState({listData: data, spinning: false})
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
  }
  /**
   * 点击提交
   */
  handleSubmit = e => {
    e.preventDefault();
    const { onClickSave } = this.props
    const { hasServer, serverList } = this.state

    if (serverList.length == 0) {
      this.setState({hasServer: false})
    } else {
      this.setState({hasServer: true}, () => {
        onClickSave({serverList}, {formDataType: 'FormData'})
      })
    }
  }

  onSelectChange = (serverList) => {
    this.setState({ serverList });
  }

  render() {

    const { spinning, serverList, listData, hasServer } = this.state;
    const { saving } = this.props
    const rowSelection = {
      selectedRowKeys: serverList,
      onChange: this.onSelectChange,
    };

    return (
      <Spin spinning={spinning}>
        <Table rowSelection={rowSelection} 
               columns={columns} 
               dataSource={listData} 
               rowKey='ip' 
               locale={{emptyText: '暂无数据'}}
        />
        <div className="server-save-error" style={{'display': hasServer ? 'none' : 'block'}}>服务器最少选择一项</div>
        <div className="server-save-btn">
          <Button type="primary" onClick={this.handleSubmit.bind(this)} loading={saving}>保存，前往下一步</Button>
        </div>
      </Spin>
    )
  }
}

export default Servers;
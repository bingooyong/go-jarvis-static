import React, { Component } from 'react'
import { Form, message, Upload, Icon } from 'antd'

const FormItem = Form.Item;
const Dragger = Upload.Dragger;

class UploadFile extends Component {

  onChange = (info) => {
    const { status } = info.file
    const { onUploadFile } = this.props

    if (status === 'uploading') onUploadFile({spinning: true}) 
    if (status === 'done') {
      this.onSuccess(info)
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败`);
      onUploadFile({spinning: false})
    }
  }

  onSuccess(info) {
    const { onUploadFile } = this.props
    const { code, data } = info.file.response
    const msg = info.file.response.message || '上传文件报错'

    if (code === 200) {
      message.success(`${info.file.name} 上传成功`);
      onUploadFile({spinning: false, ...data})
    } else {
      message.error(msg)
      onUploadFile({spinning: false})
    }
  }

  render() {

    const { loading } = this.props
    const uploadConfig = {
      accept: '.jar, .zip, .tar',
      disabled: loading,
      withCredentials: true,
      showUploadList: { showRemoveIcon: false },
      action: '/api/file/upload',
      onChange: this.onChange.bind(this)
    };

    return (
      <FormItem
        colon={false}
        label="上传程序包"
      >
        <Dragger {...uploadConfig}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或者拖拽文件进行上传</p>
          <p className="ant-upload-hint">请在本地环境打包好程序，支持文件扩展名：jar、zip、tar</p>
        </Dragger>
      </FormItem>
    )
  }
}

export default UploadFile
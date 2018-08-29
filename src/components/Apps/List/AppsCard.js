import React from 'react'
import { Button, Row, Col, Spin } from 'antd'

const AppsCard = ({ data = [], spinning, onClickOperate } = this.props) => (
  <Spin size="large" spinning={spinning}>
    <div className="apps-list-container">
      {data.length > 0 ? 
        <div>
        {data.map((item, index) => (
          <Row gutter={16} className="apps-list-row" key={index}>
          {item && item.map((v, k) => (
            <Col className="gutter-row" span={6} key={k}>
              <div className="card-box">
                <Row className="card-header">
                  <Col span={14} className="card-title" title={v.code}>{v.code}</Col>
                  <Col span={10} className="card-btn">
                    <Button size="small" className="card-btn-edit" onClick={() => {onClickOperate(v, true)}}>编辑</Button>
                    <Button size="small" onClick={() => {onClickOperate(v, false)}}>发版</Button>
                  </Col>
                </Row>
                <div className="card-content">
                  <div className="app-info-box">
                    <div className="app-info-label">应用名:</div>
                    <div className="app-info" title={v.name}>{v.name}</div>
                  </div>
                  <div className="app-info-box">
                    <div className="app-info-label">应用部署位置:</div>
                    <div className="app-info" title={v.deploymentPath}>{v.deploymentPath}</div>
                  </div>
                  <div className="app-info-box">
                    <div className="app-info-label">应用负责人:</div>
                    <div className="app-info" title={v.ownerName}>{v.ownerName}</div>
                  </div>
                  <div className="app-info-box">
                    <div className="app-info-label">最后部署时间:</div>
                    <div className="app-info" title={v.deployedAt}>{v.deployedAt}</div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
          </Row>
        ))}
        </div>
        : <div className="noresult-container">暂无数据</div>
      }
    </div>
  </Spin>
)

export default AppsCard
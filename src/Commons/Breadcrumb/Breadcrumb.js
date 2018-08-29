import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'

const breadcrumbStyle = {
  backgroundColor: '#f1f1f1',
  padding: '8px 20px',
  borderRadius: '3px'
}

const CurBreadcrumb = ({ routes }) => (
  <div>
    {
      routes && routes.length > 0 ?
        <Breadcrumb style={breadcrumbStyle}>
        {routes.map((item, index) => (
          <Breadcrumb.Item key={index}>
            {item && item.path ? <Link to={item.path}>{item.name}</Link> : item.name }
          </Breadcrumb.Item>
        ))}
        </Breadcrumb>
      : <div></div>
    }
  </div>
)

export default CurBreadcrumb
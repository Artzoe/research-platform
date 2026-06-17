import { Outlet, useNavigate } from 'react-router-dom'
import {
  DatabaseOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Dropdown } from 'antd'
import './MainLayout.css'

export default function MainLayout() {
  const navigate = useNavigate()

  return (
    <div className="main-layout">
      <header className="layout-header">
        <div className="header-left">
          <div className="header-logo" onClick={() => navigate('/patients')}>
            <div className="header-logo-icon">
              <DatabaseOutlined style={{ fontSize: 16, color: '#fff' }} />
            </div>
            <span className="header-logo-text">科研管理平台</span>
          </div>
        </div>
        <div className="header-right">
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: '退出登录',
                  onClick: () => navigate('/'),
                },
              ],
            }}
            placement="bottomRight"
          >
            <div className="header-user">
              <div className="header-avatar">
                <UserOutlined />
              </div>
              <span className="header-username">研究员</span>
            </div>
          </Dropdown>
        </div>
      </header>
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  )
}

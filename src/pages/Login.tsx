import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MobileOutlined,
  SafetyCertificateOutlined,
  QrcodeOutlined,
  DatabaseOutlined,
  TeamOutlined,
  LineChartOutlined,
} from '@ant-design/icons'
import { message } from 'antd'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'code' | 'qr'>('code')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSendCode = useCallback(() => {
    if (!/^1\d{10}$/.test(phone)) {
      message.warning('请输入正确的手机号')
      return
    }
    setCountdown(60)
    message.success('验证码已发送')
  }, [phone])

  const handleLogin = useCallback(() => {
    if (!phone || !code) {
      message.warning('请填写手机号和验证码')
      return
    }
    if (!agreed) {
      message.warning('请先同意用户协议')
      return
    }
    message.success('登录成功')
    navigate('/patients')
  }, [phone, code, agreed, navigate])

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="grid-overlay" />
        <div className="particles">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />

        <div className="left-content">
          <div className="platform-icon">
            <DatabaseOutlined style={{ fontSize: 36, color: '#fff' }} />
          </div>
          <h1>科研管理平台</h1>
          <p className="subtitle">
            整合多源科研数据，赋能智能分析决策<br />
            构建高效、安全、可信赖的科研数据生态
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon blue">
                <DatabaseOutlined />
              </div>
              <h4>数据管理</h4>
              <p>多源数据整合与治理</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon purple">
                <LineChartOutlined />
              </div>
              <h4>智能分析</h4>
              <p>AI 驱动数据洞察</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon cyan">
                <TeamOutlined />
              </div>
              <h4>协同共享</h4>
              <p>跨团队高效协作</p>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>欢迎登录</h2>
            <p>科研管理平台 · 数据驱动科研创新</p>
          </div>

          <div className="login-tabs">
            <button
              className={`login-tab ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              <MobileOutlined style={{ marginRight: 6 }} />
              验证码登录
            </button>
            <button
              className={`login-tab ${activeTab === 'qr' ? 'active' : ''}`}
              onClick={() => setActiveTab('qr')}
            >
              <QrcodeOutlined style={{ marginRight: 6 }} />
              扫码登录
            </button>
          </div>

          {activeTab === 'code' && (
            <div>
              <div className="phone-input-group">
                <label>手机号</label>
                <div className="phone-input-wrapper">
                  <span className="phone-prefix">
                    <MobileOutlined /> +86
                  </span>
                  <input
                    type="tel"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    maxLength={11}
                  />
                </div>
              </div>

              <div className="code-input-group">
                <label>验证码</label>
                <div className="code-input-wrapper">
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                  />
                  <button
                    className="send-code-btn"
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                  </button>
                </div>
              </div>

              <label className="agreement">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                />
                <span>
                  我已阅读并同意{' '}
                  <a href="#" onClick={e => e.preventDefault()}>《用户服务协议》</a>
                  {' '}和{' '}
                  <a href="#" onClick={e => e.preventDefault()}>《隐私政策》</a>
                </span>
              </label>

              <button className="login-btn" onClick={handleLogin}>
                <SafetyCertificateOutlined style={{ marginRight: 8 }} />
                登 录
              </button>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="qr-section">
              <div className="qr-box">
                <div className="qr-placeholder">
                  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="60" height="60" rx="4" fill="currentColor" opacity="0.15" />
                    <rect x="120" y="20" width="60" height="60" rx="4" fill="currentColor" opacity="0.15" />
                    <rect x="20" y="120" width="60" height="60" rx="4" fill="currentColor" opacity="0.15" />
                    <rect x="28" y="28" width="18" height="18" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="54" y="28" width="18" height="18" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="28" y="54" width="18" height="18" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="54" y="54" width="18" height="18" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="128" y="28" width="18" height="18" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="154" y="28" width="18" height="18" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="128" y="54" width="18" height="18" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="154" y="54" width="18" height="18" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="28" y="128" width="18" height="18" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="54" y="128" width="18" height="18" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="28" y="154" width="18" height="18" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="54" y="154" width="18" height="18" rx="2" fill="currentColor" opacity="0.3" />
                    <rect x="90" y="20" width="20" height="20" rx="2" fill="currentColor" opacity="0.2" />
                    <rect x="90" y="50" width="20" height="20" rx="2" fill="currentColor" opacity="0.15" />
                    <rect x="90" y="80" width="20" height="20" rx="2" fill="currentColor" opacity="0.2" />
                    <rect x="120" y="90" width="20" height="20" rx="2" fill="currentColor" opacity="0.15" />
                    <rect x="150" y="90" width="20" height="20" rx="2" fill="currentColor" opacity="0.2" />
                    <rect x="120" y="120" width="20" height="20" rx="2" fill="currentColor" opacity="0.2" />
                    <rect x="150" y="120" width="20" height="20" rx="2" fill="currentColor" opacity="0.15" />
                    <rect x="120" y="150" width="20" height="20" rx="2" fill="currentColor" opacity="0.2" />
                    <rect x="150" y="150" width="20" height="20" rx="2" fill="currentColor" opacity="0.2" />
                  </svg>
                </div>
              </div>
              <p className="qr-tip">打开手机 APP 扫一扫登录</p>
              <p className="qr-tip-sub">支持「科研管理」APP 或 微信扫码</p>
            </div>
          )}
        </div>

        <div className="partner-section">
          <span className="partner-label">合作机构</span>
          <div className="partner-logos">
            <svg className="partner-logo" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: 28 }}>
              <circle cx="14" cy="14" r="12" fill="#1677ff" opacity="0.8" />
              <path d="M8 14 C8 10, 12 7, 14 7 C16 7, 20 10, 20 14 C20 18, 16 21, 14 21 C12 21, 8 18, 8 14Z" fill="white" opacity="0.9" />
              <path d="M11 12 L14 9 L17 12 L14 15Z" fill="#1677ff" />
              <text x="32" y="18" fontFamily="system-ui" fontSize="14" fontWeight="600" fill="#334155">海心科技</text>
            </svg>
            <svg className="partner-logo" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: 28 }}>
              <rect x="2" y="2" width="24" height="24" rx="6" fill="#6366f1" opacity="0.8" />
              <path d="M8 10 H20 M8 14 H17 M8 18 H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <text x="32" y="18" fontFamily="system-ui" fontSize="14" fontWeight="600" fill="#334155">合作机构</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import './App.css'
import WatermarkGenerationPage from './pages/WatermarkGenerationPage'
import EmbedEnginePage from './pages/EmbedEnginePage'
import DetectEnginePage from './pages/DetectEnginePage'
import HomePage from './pages/HomePage'

const { Header, Content, Footer, Sider } = Layout

function App() {
  return (
    <Router>
      <Layout className="min-h-screen">
        <Header style={{ backgroundColor: '#1890ff', color: 'white', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>数据水印系统</h1>
            </div>
          </Header>
        <Layout>
          <Sider width={250} theme="light" className="h-[calc(100vh-64px)]">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%' }}
              items={[
                { key: '1', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
                { key: '2', icon: <FormOutlined />, label: <Link to="/watermark-generation">水印生成</Link> },
                { key: '3', icon: <UploadOutlined />, label: <Link to="/embed-engine">嵌入引擎</Link> },
                { key: '4', icon: <ScanOutlined />, label: <Link to="/detect-engine">检测引擎</Link> },
              ]}
            />
          </Sider>
          <Layout className="p-6">
            <Content style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/watermark-generation" element={<WatermarkGenerationPage />} />
                <Route path="/embed-engine" element={<EmbedEnginePage />} />
                <Route path="/detect-engine" element={<DetectEnginePage />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
        <Footer className="text-center">数据水印系统 ©{new Date().getFullYear()} Created by React & Ant Design</Footer>
      </Layout>
    </Router>
  )
}

// 导入必要的图标组件
import { HomeOutlined, FormOutlined, UploadOutlined, ScanOutlined } from '@ant-design/icons'

export default App

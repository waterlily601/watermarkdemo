import React from 'react'
import { Card, Row, Col, Typography, Statistic } from 'antd'
import { FileProtectOutlined, UploadOutlined, ScanOutlined, DatabaseOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

function HomePage() {
  return (
    <div>
      <Title level={2}>欢迎使用数据水印系统</Title>
      <Paragraph>
        本系统支持数据水印生成、水印信息嵌入、水印信息检测/溯源三大核心能力，
        面向图像、视频、文本、音频与表格/结构化数据等多种模态。
      </Paragraph>
      
      <div style={{ margin: '24px 0' }}>
        <Title level={3}>系统能力概览</Title>
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={8} style={{ padding: '0 8px' }}>
            <Card hoverable icon={<FileProtectOutlined className="text-blue-500" />}>
              <Title level={4}>水印生成</Title>
              <Paragraph>
                生成要嵌入的水印信息载荷（payload），可包含固定文本/ID（如用户ID、时间戳、会话ID）
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable icon={<UploadOutlined className="text-green-500" />}>
              <Title level={4}>嵌入引擎</Title>
              <Paragraph>
                针对不同模态与水印算法进行嵌入，输出带水印数据与嵌入记录
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable icon={<ScanOutlined className="text-purple-500" />}>
              <Title level={4}>检测引擎</Title>
              <Paragraph>
                对输入数据检测水印，返回存在性概率或者是否有水印
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
      
      <div style={{ margin: '24px 0' }}>
        <Title level={3}>支持的模态与算法</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} style={{ padding: '0 8px' }}>
            <Card title="图像水印" variant="borderless">
              <ul>
                <li>空域（LSB/统计特征）</li>
                <li>变换域（DCT/DWT/DFT/SVD）</li>
                <li>混合域</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="视频水印" variant="borderless">
              <ul>
                <li>逐帧/Shot级</li>
                <li>DCT/DT-CWT</li>
                <li>码流面向 H.264/H.265（GOP级插入/同步标记）</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="文本水印" variant="borderless">
              <ul>
                <li>版式/排版信道（字距/行距/标点微扰，适合PDF）</li>
                <li>语言学/语义水印（同义替换、句法变体）</li>
                <li>可选LLM 语义水印</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="音频水印" variant="borderless">
              <ul>
                <li>感知模型下的扩频</li>
                <li>回声添加</li>
                <li>相位编码</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>
      
      <div style={{ marginTop: '36px' }}>
        <Title level={3}>系统统计</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6} style={{ padding: '0 8px' }}>
            <Card>
              <Statistic title="水印生成总数" value={12500} suffix="次" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="成功嵌入水印" value={11800} suffix="次" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="水印检测次数" value={8900} suffix="次" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="准确率" value={96.5} suffix="%" />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default HomePage
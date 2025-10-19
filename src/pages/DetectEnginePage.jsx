import React, { useState } from 'react'
import { Form, Button, Card, Upload, message, Progress, Tabs, Result, Statistic, Tag } from 'antd'
import { ScanOutlined, FileImageOutlined, FileTextOutlined, SoundOutlined, VideoCameraOutlined, DatabaseOutlined } from '@ant-design/icons'

function DetectEnginePage() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [detectionResult, setDetectionResult] = useState(null)
  const [selectedMediaType, setSelectedMediaType] = useState('all')

  // 上传前检查
  const beforeUpload = (file) => {
    const maxSize = 100 * 1024 * 1024 // 100MB
    
    // 如果选择了特定媒体类型，只允许对应类型的文件
    if (selectedMediaType !== 'all') {
      const isValid = validateFile(file, selectedMediaType)
      if (!isValid) {
        message.error('文件类型不匹配或大小超出限制！')
      }
      return isValid
    }
    
    // 如果选择了所有类型，允许所有支持的文件类型
    const allAllowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/bmp', // 图像
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv',  // 视频
      'text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // 文本
      'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/wma'  // 音频
    ]
    
    const isValid = allAllowedTypes.includes(file.type) && file.size <= maxSize
    if (!isValid) {
      message.error('不支持的文件类型或文件大小超出限制！')
    }
    return isValid
  }

  // 文件验证
  const validateFile = (file, type) => {
    const maxSize = 100 * 1024 * 1024 // 100MB
    
    switch (type) {
      case 'image':
        return ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type) && file.size <= maxSize
      case 'video':
        return ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'].includes(file.type) && file.size <= maxSize
      case 'text':
        return ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type) && file.size <= maxSize
      case 'audio':
        return ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/wma'].includes(file.type) && file.size <= maxSize
      default:
        return false
    }
  }

  // 处理上传和检测
  const handleUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file.file)
    formData.append('mediaType', selectedMediaType)

    setUploading(true)
    setProgress(0)

    // 模拟上传和检测进度
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 500)

    // 模拟API调用
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      
      // 模拟随机检测结果（实际应用中应该基于真实的检测算法）
      const hasWatermark = Math.random() > 0.3 // 70%概率检测到水印
      const randomConfidence = hasWatermark ? 70 + Math.random() * 30 : Math.random() * 50
      
      // 生成模拟的水印信息
      const mockWatermarkInfo = hasWatermark ? {
        content: `USER_${Math.floor(Math.random() * 10000)}_TS_${Date.now()}`,
        algorithm: getRandomAlgorithm(selectedMediaType),
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // 最近7天内的随机时间
        confidence: randomConfidence.toFixed(2),
        source: ['系统生成', '用户上传', '第三方嵌入'][Math.floor(Math.random() * 3)],
        metadata: {
          priority: Math.floor(Math.random() * 5) + 1,
          validity: Math.random() > 0.2
        }
      } : null

      // 模拟成功响应
      const mockResult = {
        fileId: `detect_${Date.now()}`,
        fileName: file.file.name,
        detectedMediaType: getFileMediaType(file.file.type),
        hasWatermark,
        confidence: randomConfidence.toFixed(2),
        watermarkInfo: mockWatermarkInfo,
        processingTime: (Math.random() * 5 + 1).toFixed(2),
        timestamp: new Date().toISOString()
      }
      
      setDetectionResult(mockResult)
      setUploading(false)
      message.success(hasWatermark ? '检测到水印信息！' : '未检测到水印信息')
    }, 3500)

    // 阻止自动上传
    return false
  }

  // 获取文件的媒体类型
  const getFileMediaType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.includes('text') || mimeType.includes('pdf') || mimeType.includes('word')) return 'text'
    return 'unknown'
  }

  // 获取随机算法名称
  const getRandomAlgorithm = (mediaType) => {
    const algorithms = {
      'image': ['LSB', 'DCT', 'DWT', 'SVD', '混合域'],
      'video': ['逐帧处理', 'Shot级处理', 'H.264 GOP级', 'DCT变换'],
      'text': ['字距微扰', '同义替换', '句法变体', 'LLM语义水印'],
      'audio': ['扩频', '回声添加', '相位编码'],
      'all': ['LSB', 'DCT', 'DWT', '扩频', '同义替换', '逐帧处理']
    }
    
    const mediaAlgorithms = algorithms[mediaType] || algorithms['all']
    return mediaAlgorithms[Math.floor(Math.random() * mediaAlgorithms.length)]
  }

  // 清空结果
  const clearResult = () => {
    setDetectionResult(null)
  }

  // 获取媒体类型标签颜色
  const getMediaTypeTagColor = (type) => {
    switch (type) {
      case 'image': return 'blue'
      case 'video': return 'red'
      case 'text': return 'green'
      case 'audio': return 'purple'
      default: return 'default'
    }
  }

  // 获取媒体类型名称
  const getMediaTypeName = (type) => {
    switch (type) {
      case 'image': return '图像'
      case 'video': return '视频'
      case 'text': return '文本'
      case 'audio': return '音频'
      default: return '未知'
    }
  }

  return (
    <div>
      <Card title={<div className="flex items-center"><ScanOutlined className="mr-2" /> 水印检测引擎</div>}>
        <Tabs 
          activeKey={selectedMediaType} 
          onChange={setSelectedMediaType}
          tabBarExtraContent={
            <div style={{ fontSize: '14px', color: '#666' }}>
              支持多种媒体类型的水印检测
            </div>
          }
        >
          <Tabs.TabPane tab={<span><DatabaseOutlined /> 自动检测</span>} key="all" />
          <Tabs.TabPane tab={<span><FileImageOutlined /> 图像</span>} key="image" />
          <Tabs.TabPane tab={<span><VideoCameraOutlined /> 视频</span>} key="video" />
          <Tabs.TabPane tab={<span><FileTextOutlined /> 文本</span>} key="text" />
          <Tabs.TabPane tab={<span><SoundOutlined /> 音频</span>} key="audio" />
        </Tabs>

        <div className="mt-6">
          <Upload
            name="file"
            beforeUpload={beforeUpload}
            customRequest={handleUpload}
            showUploadList={false}
            accept={
              selectedMediaType === 'all' ? '*' :
              selectedMediaType === 'image' ? 'image/*' :
              selectedMediaType === 'video' ? 'video/*' :
              selectedMediaType === 'text' ? '.txt,.pdf,.doc,.docx' :
              'audio/*'
            }
          >
            <Button type="primary" icon={<ScanOutlined />} disabled={uploading} block size="large">
              {uploading ? '检测中...' : `上传${selectedMediaType === 'all' ? '文件' : getMediaTypeName(selectedMediaType)}进行水印检测`}
            </Button>
          </Upload>
        </div>

        {uploading && (
            <div style={{ marginTop: '16px' }}>
              <Progress percent={progress} status="active" />
              <div style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '8px' }}>
              正在进行水印检测，请稍候...
            </div>
          </div>
        )}
      </Card>

      {detectionResult && (
          <Card title="检测结果" style={{ marginTop: '24px' }}>
            {detectionResult.hasWatermark ? (
              <div style={{ marginBottom: '24px' }}>
              <Result
                status="success"
                title="检测到水印信息"
                subTitle={`检测置信度: ${detectionResult.confidence}%`}
              />
              
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>文件信息</h3>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>文件名：</span>
                        <span>{detectionResult.fileName}</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>媒体类型：</span>
                        <Tag color={getMediaTypeTagColor(detectionResult.detectedMediaType)}>
                          {getMediaTypeName(detectionResult.detectedMediaType)}
                        </Tag>
                      </div>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>处理时间：</span>
                        <span>{detectionResult.processingTime} 秒</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>检测时间：</span>
                        <span>{new Date(detectionResult.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                </Col>
                
                <Col xs={24} md={12}>
                    <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>水印信息</h3>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>水印内容：</span>
                        <span style={{ wordWrap: 'break-word', maxWidth: '200px' }}>{detectionResult.watermarkInfo.content}</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>使用算法：</span>
                        <span>{detectionResult.watermarkInfo.algorithm}</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>嵌入时间：</span>
                        <span>{new Date(detectionResult.watermarkInfo.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>水印来源：</span>
                        <span>{detectionResult.watermarkInfo.source}</span>
                      </div>
                    </div>
                </Col>
              </Row>
              
              {detectionResult.watermarkInfo.metadata && (
                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                  <h4 style={{ fontWeight: 500, marginBottom: '8px' }}>元数据信息</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <span style={{ color: '#666' }}>优先级：</span>
                      <Tag color="orange">{detectionResult.watermarkInfo.metadata.priority}</Tag>
                    </div>
                    <div>
                      <span style={{ color: '#666' }}>有效性：</span>
                      <Tag color={detectionResult.watermarkInfo.metadata.validity ? 'green' : 'red'}>
                        {detectionResult.watermarkInfo.metadata.validity ? '有效' : '无效'}
                      </Tag>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">检测统计</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <Statistic title="置信度" value={detectionResult.confidence} suffix="%" precision={2} />
                  </Card>
                  <Card>
                    <Statistic title="处理时长" value={detectionResult.processingTime} suffix="秒" precision={2} />
                  </Card>
                  <Card>
                    <Statistic title="水印强度" value={Math.round(detectionResult.watermarkInfo.confidence * 0.7)} suffix="%" />
                  </Card>
                  <Card>
                    <Statistic title="完整性" value={95 + Math.random() * 5} suffix="%" precision={1} />
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Result
                status="info"
                title="未检测到水印信息"
                subTitle={`检测置信度: ${detectionResult.confidence}%`}
                extra={
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <Statistic title="文件类型" value={getMediaTypeName(detectionResult.detectedMediaType)} />
                    </Card>
                    <Card>
                      <Statistic title="处理时间" value={detectionResult.processingTime} suffix="秒" precision={2} />
                    </Card>
                    <Card>
                      <Statistic title="检测时间" value={new Date(detectionResult.timestamp).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })} />
                    </Card>
                  </div>
                }
              />
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Button onClick={clearResult}>清空结果</Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default DetectEnginePage
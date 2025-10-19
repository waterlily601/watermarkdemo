import React, { useState } from 'react'
import { Form, Input, InputNumber, Button, Card, Select, Upload, message, Progress, Tabs, Divider } from 'antd'
import { UploadOutlined, InboxOutlined, FileImageOutlined, FileTextOutlined, SoundOutlined, VideoCameraOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { TabPane } = Tabs

function EmbedEnginePage() {
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [embeddedResult, setEmbeddedResult] = useState(null)
  const [selectedMediaType, setSelectedMediaType] = useState('image')

  // 图像水印算法选项
  const imageAlgorithms = [
    { label: '空域 - LSB', value: 'lsb' },
    { label: '空域 - 统计特征', value: 'statistical' },
    { label: '变换域 - DCT', value: 'dct' },
    { label: '变换域 - DWT', value: 'dwt' },
    { label: '变换域 - DFT', value: 'dft' },
    { label: '变换域 - SVD', value: 'svd' },
    { label: '混合域', value: 'hybrid' }
  ]

  // 视频水印算法选项
  const videoAlgorithms = [
    { label: '逐帧处理', value: 'frame_by_frame' },
    { label: 'Shot级处理', value: 'shot_based' },
    { label: 'DCT变换', value: 'dct' },
    { label: 'DT-CWT变换', value: 'dt_cwt' },
    { label: 'H.264 GOP级插入', value: 'h264_gop' },
    { label: 'H.265 GOP级插入', value: 'h265_gop' }
  ]

  // 文本水印算法选项
  const textAlgorithms = [
    { label: '版式 - 字距微扰', value: 'kerning' },
    { label: '版式 - 行距微扰', value: 'line_spacing' },
    { label: '版式 - 标点微扰', value: 'punctuation' },
    { label: '语言学 - 同义替换', value: 'synonym_replacement' },
    { label: '语言学 - 句法变体', value: 'syntactic_variation' },
    { label: 'LLM 语义水印', value: 'llm_semantic' }
  ]

  // 音频水印算法选项
  const audioAlgorithms = [
    { label: '感知模型下的扩频', value: 'spread_spectrum' },
    { label: '回声添加', value: 'echo_hiding' },
    { label: '相位编码', value: 'phase_encoding' }
  ]

  // 获取当前媒体类型对应的算法选项
  const getCurrentAlgorithms = () => {
    switch (selectedMediaType) {
      case 'image': return imageAlgorithms
      case 'video': return videoAlgorithms
      case 'text': return textAlgorithms
      case 'audio': return audioAlgorithms
      default: return []
    }
  }

  // 上传前检查
  const beforeUpload = (file) => {
    const isValid = validateFile(file)
    if (!isValid) {
      message.error('文件类型不匹配或大小超出限制！')
    }
    return isValid
  }

  // 文件验证
  const validateFile = (file) => {
    const maxSize = 100 * 1024 * 1024 // 100MB
    
    switch (selectedMediaType) {
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

  // 处理上传
  const handleUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file.file)
    
    // 获取表单值
    const formValues = form.getFieldsValue()
    formData.append('watermark', formValues.watermark)
    formData.append('algorithm', formValues.algorithm)
    formData.append('strength', formValues.strength || 50)
    formData.append('mediaType', selectedMediaType)

    setUploading(true)
    setProgress(0)

    // 模拟上传进度
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
      
      // 模拟成功响应
      const mockResult = {
        fileId: `embed_${Date.now()}`,
        fileName: file.file.name,
        mediaType: selectedMediaType,
        algorithm: formValues.algorithm,
        timestamp: new Date().toISOString(),
        status: 'success',
        downloadUrl: '#', // 模拟下载链接
        previewUrl: 'https://via.placeholder.com/300x200?text=Watermarked+File'
      }
      
      setEmbeddedResult(mockResult)
      setUploading(false)
      message.success('水印嵌入成功！')
    }, 3000)

    // 阻止自动上传
    return false
  }

  // 清空结果
  const clearResult = () => {
    setEmbeddedResult(null)
    form.resetFields()
  }

  // 媒体类型图标
  const getMediaTypeIcon = (type) => {
    switch (type) {
      case 'image': return <FileImageOutlined /> 
      case 'video': return <VideoCameraOutlined /> 
      case 'text': return <FileTextOutlined /> 
      case 'audio': return <SoundOutlined /> 
      default: return <InboxOutlined /> 
    }
  }

  return (
    <div>
      <Card title={<div className="flex items-center"><UploadOutlined className="mr-2" /> 水印嵌入引擎</div>}>
        <Tabs 
          activeKey={selectedMediaType} 
          onChange={setSelectedMediaType}
          tabBarExtraContent={
            <div style={{ fontSize: '14px', color: '#666' }}>
              支持多种媒体类型的水印嵌入
            </div>
          }
        >
          <TabPane tab={<span><FileImageOutlined /> 图像</span>} key="image" />
          <TabPane tab={<span><VideoCameraOutlined /> 视频</span>} key="video" />
          <TabPane tab={<span><FileTextOutlined /> 文本</span>} key="text" />
          <TabPane tab={<span><SoundOutlined /> 音频</span>} key="audio" />
        </Tabs>

        <Divider />

        <Form form={form} layout="vertical">
          <Form.Item
            label="水印内容"
            name="watermark"
            rules={[{ required: true, message: '请输入水印内容' }]}
          >
            <TextArea rows={2} placeholder="请输入要嵌入的水印内容" />
          </Form.Item>

          <Form.Item
            label="选择算法"
            name="algorithm"
            rules={[{ required: true, message: '请选择水印算法' }]}
          >
            <Select placeholder="请选择水印算法">
              {getCurrentAlgorithms().map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="水印强度（1-100）"
            name="strength"
            initialValue={50}
            tooltip="强度越高，水印越难移除，但对原始数据的影响也越大"
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label={`上传${selectedMediaType === 'image' ? '图像' : selectedMediaType === 'video' ? '视频' : selectedMediaType === 'text' ? '文本' : '音频'}文件`}>
            <Upload
              name="file"
              beforeUpload={beforeUpload}
              customRequest={handleUpload}
              showUploadList={false}
              accept={
                selectedMediaType === 'image' ? 'image/*' :
                selectedMediaType === 'video' ? 'video/*' :
                selectedMediaType === 'text' ? '.txt,.pdf,.doc,.docx' :
                'audio/*'
              }
            >
              <Button icon={<UploadOutlined />} disabled={uploading}>
                {uploading ? '上传中...' : `选择${selectedMediaType === 'image' ? '图像' : selectedMediaType === 'video' ? '视频' : selectedMediaType === 'text' ? '文本' : '音频'}文件`}
              </Button>
            </Upload>
          </Form.Item>
        </Form>

        {uploading && (
          <div className="mt-4">
            <Progress percent={progress} status="active" />
          </div>
        )}
      </Card>

      {embeddedResult && (
        <Card title="嵌入结果" style={{ marginTop: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              {getMediaTypeIcon(selectedMediaType)}
              <span style={{ marginLeft: '8px', fontWeight: 500 }}>{embeddedResult.fileName}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>媒体类型</div>
                <div>{selectedMediaType === 'image' ? '图像' : selectedMediaType === 'video' ? '视频' : selectedMediaType === 'text' ? '文本' : '音频'}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>使用算法</div>
                <div>{getCurrentAlgorithms().find(a => a.value === embeddedResult.algorithm)?.label || embeddedResult.algorithm}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>时间戳</div>
                <div>{new Date(embeddedResult.timestamp).toLocaleString()}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>状态</div>
                <div style={{ color: '#52c41a' }}>成功</div>
              </div>
            </div>
            
            {selectedMediaType === 'image' && (
              <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>预览</div>
                <img src={embeddedResult.previewUrl} alt="水印预览" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', border: '1px solid #d9d9d9' }} />
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <Button type="primary" href={embeddedResult.downloadUrl} target="_blank">
                下载带水印文件
              </Button>
              <Button onClick={clearResult}>清空结果</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default EmbedEnginePage
import React, { useState } from 'react'
import { Form, Input, Button, Card, Radio, DatePicker, InputNumber, Switch, message, Divider } from 'antd'
import { FileProtectOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { RangePicker } = DatePicker

function WatermarkGenerationPage() {
  const [form] = Form.useForm()
  const [generatedWatermark, setGeneratedWatermark] = useState(null)

  const onFinish = (values) => {
    console.log('表单值:', values)
    
    // 生成水印逻辑（模拟）
    const timestamp = new Date().getTime()
    let watermarkContent = ''
    
    if (values.watermarkType === 'text') {
      watermarkContent = values.customText
    } else if (values.watermarkType === 'userId') {
      watermarkContent = `USER_${values.userId}`
    } else if (values.watermarkType === 'timestamp') {
      watermarkContent = `TS_${timestamp}`
    } else if (values.watermarkType === 'composite') {
      watermarkContent = `COMP_${values.userId}_${timestamp}_${values.customText || 'NONE'}`
    }
    
    // 添加额外信息
    if (values.includeMetadata) {
      watermarkContent += `|META:${values.priority}-${values.validity ? 'VALID' : 'INVALID'}`
    }
    
    // 模拟编码
    const encodedWatermark = btoa(watermarkContent)
    setGeneratedWatermark(encodedWatermark)
    message.success('水印生成成功！')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedWatermark)
    message.success('已复制到剪贴板')
  }

  const downloadWatermark = () => {
    const blob = new Blob([generatedWatermark], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `watermark_${new Date().getTime()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    message.success('水印已下载')
  }

  return (
    <div>
      <Card title={<div className="flex items-center"><FileProtectOutlined className="mr-2" /> 水印生成</div>}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            watermarkType: 'text',
            priority: 3,
            includeMetadata: false,
            validity: true
          }}
        >
          <Form.Item
            label="水印类型"
            name="watermarkType"
            rules={[{ required: true, message: '请选择水印类型' }]}
          >
            <Radio.Group>
              <Radio value="text">自定义文本</Radio>
              <Radio value="userId">用户ID</Radio>
              <Radio value="timestamp">时间戳</Radio>
              <Radio value="composite">复合信息</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.watermarkType !== currentValues.watermarkType}
          >
            {({ getFieldValue }) => {
              const watermarkType = getFieldValue('watermarkType')
              const showCustomText = watermarkType === 'text' || watermarkType === 'composite'
              const showUserId = watermarkType === 'userId' || watermarkType === 'composite'
              
              return (
                <>
                  {showCustomText && (
                    <Form.Item
                      label="自定义文本"
                      name="customText"
                      rules={[watermarkType === 'text' && { required: true, message: '请输入自定义文本' }]}
                    >
                      <TextArea rows={3} placeholder="请输入要作为水印的文本内容" />
                    </Form.Item>
                  )}
                  
                  {showUserId && (
                    <Form.Item
                      label="用户ID"
                      name="userId"
                      rules={[watermarkType === 'userId' && { required: true, message: '请输入用户ID' }]}
                    >
                      <Input placeholder="请输入用户ID" />
                    </Form.Item>
                  )}
                </>
              )
            }}
          </Form.Item>

          <Divider>高级选项</Divider>
          
          <Form.Item label="包含元数据" name="includeMetadata" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.includeMetadata !== currentValues.includeMetadata}
          >
            {({ getFieldValue }) => {
              const includeMetadata = getFieldValue('includeMetadata')
              if (!includeMetadata) return null
              
              return (
                <>
                  <Form.Item label="优先级（1-5，5最高）" name="priority">
                    <InputNumber min={1} max={5} style={{ width: '100%' }} />
                  </Form.Item>
                  
                  <Form.Item label="是否有效" name="validity" valuePropName="checked">
                    <Switch checkedChildren="有效" unCheckedChildren="无效" />
                  </Form.Item>
                </>
              )
            }}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              生成水印
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {generatedWatermark && (
        <Card title="生成的水印" style={{ marginTop: '24px' }}>
          <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '6px', marginBottom: '16px', wordWrap: 'break-word' }}>
            {generatedWatermark}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button icon={<CopyOutlined />} onClick={copyToClipboard}>复制水印</Button>
            <Button icon={<DownloadOutlined />} onClick={downloadWatermark}>下载水印</Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default WatermarkGenerationPage
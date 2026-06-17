import { Drawer, Form, DatePicker, Input, Button, message } from 'antd'
import MedicalImagePanel from './MedicalImagePanel'

interface Props {
  open: boolean
  onClose: () => void
}

export default function RadiationFormDrawer({ open, onClose }: Props) {
  const [form] = Form.useForm()

  const handleSave = async () => {
    try {
      await form.validateFields()
      message.success('保存成功')
      form.resetFields()
      onClose()
    } catch { /* validation */ }
  }

  return (
    <Drawer
      title="放疗记录"
      open={open}
      onClose={onClose}
      width={1080}
      styles={{ body: { padding: 0, display: 'flex', overflow: 'hidden' } }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 12 }}>取消</Button>
          <Button type="primary" onClick={handleSave} style={{ width: 120 }}>保存</Button>
        </div>
      }
    >
      <MedicalImagePanel />
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <Form form={form} layout="vertical">
        <div className="drawer-form-section">
          <span className="section-label">放疗起始日期</span>
          <Form.Item name="startDate">
            <DatePicker placeholder="请选择" style={{ width: 240 }} />
          </Form.Item>
        </div>

        <div className="drawer-form-section">
          <span className="section-label">放疗结束日期</span>
          <Form.Item name="endDate">
            <DatePicker placeholder="请选择" style={{ width: 240 }} />
          </Form.Item>
        </div>

        <div className="drawer-form-section">
          <span className="section-label">部位</span>
          <Form.Item name="site">
            <Input placeholder="请输入" style={{ width: 240 }} />
          </Form.Item>
        </div>

        <div className="drawer-form-section">
          <span className="section-label">剂量</span>
          <Form.Item name="dose">
            <Input placeholder="请输入" style={{ width: 240 }} />
          </Form.Item>
        </div>

        <div className="drawer-form-section">
          <span className="section-label">次数</span>
          <Form.Item name="count">
            <Input placeholder="请输入" style={{ width: 240 }} type="number" />
          </Form.Item>
        </div>
      </Form>
      </div>
    </Drawer>
  )
}

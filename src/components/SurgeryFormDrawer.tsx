import { Drawer, Form, DatePicker, Checkbox, Button, message } from 'antd'
import MedicalImagePanel from './MedicalImagePanel'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SurgeryFormDrawer({ open, onClose }: Props) {
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
      title="手术治疗"
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
          <span className="section-label">手术日期</span>
          <Form.Item name="surgeryDate">
            <DatePicker placeholder="请选择" style={{ width: 240 }} />
          </Form.Item>
        </div>

        <div className="drawer-form-section">
          <span className="section-label">手术类型</span>
          <Form.Item name="surgeryType">
            <Checkbox.Group>
              <Checkbox value="根治性手术">根治性手术</Checkbox>
              <Checkbox value="姑息性手术">姑息性手术</Checkbox>
              <Checkbox value="其他辅助手术">其他辅助手术</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </div>

        <div className="drawer-form-section">
          <span className="section-label">手术方式</span>
          <Form.Item name="surgeryMethod">
            <Checkbox.Group style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 0' }}>
              <Checkbox value="保乳手术">保乳手术</Checkbox>
              <Checkbox value="乳房改良根治术">乳房改良根治术</Checkbox>
              <Checkbox value="乳房根治术">乳房根治术</Checkbox>
              <Checkbox value="乳房扩大根治术">乳房扩大根治术</Checkbox>
              <Checkbox value="腋窝淋巴结清扫">腋窝淋巴结清扫</Checkbox>
              <Checkbox value="前哨淋巴结活检">前哨淋巴结活检</Checkbox>
              <Checkbox value="乳房重建">乳房重建</Checkbox>
              <Checkbox value="卵巢切除">卵巢切除</Checkbox>
              <Checkbox value="局部病灶姑息性手术">局部病灶姑息性手术</Checkbox>
              <Checkbox value="其他">其他</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </div>

        <div className="drawer-form-section">
          <span className="section-label">切口类型</span>
          <Form.Item name="incisionType">
            <Checkbox.Group>
              <Checkbox value="横梭形">横梭形</Checkbox>
              <Checkbox value="纵梭形">纵梭形</Checkbox>
              <Checkbox value="斜梭形">斜梭形</Checkbox>
              <Checkbox value="弧形">弧形</Checkbox>
              <Checkbox value="其他">其他</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </div>

        <div className="drawer-form-section">
          <span className="section-label">淋巴结清扫范围</span>
          <Form.Item name="lymphScope">
            <Checkbox.Group>
              <Checkbox value="I组">I组</Checkbox>
              <Checkbox value="II组">II组</Checkbox>
              <Checkbox value="III组">III组</Checkbox>
              <Checkbox value="内乳淋巴结">内乳淋巴结</Checkbox>
              <Checkbox value="其他">其他</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </div>
      </Form>
      </div>
    </Drawer>
  )
}

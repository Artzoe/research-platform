import { Drawer, Form, Button, message } from 'antd'
import MedicalImagePanel from './MedicalImagePanel'
import DiagnosisFormFields, { diagnosisValuesChangeHandler } from './DiagnosisFormFields'

interface Props {
  open: boolean
  onClose: () => void
}

export default function DiagnosisFormDrawer({ open, onClose }: Props) {
  const [form] = Form.useForm()

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      console.log('diagnosis form data:', values)
      message.success('保存成功')
      form.resetFields()
      onClose()
    } catch { /* validation */ }
  }

  return (
    <Drawer
      title="初诊信息"
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
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changed) => diagnosisValuesChangeHandler(form, changed)}
        >
          <DiagnosisFormFields form={form} />
        </Form>
      </div>
    </Drawer>
  )
}

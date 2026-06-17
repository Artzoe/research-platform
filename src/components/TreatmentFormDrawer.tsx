import { Drawer, Form, Button, message } from 'antd'
import MedicalImagePanel from './MedicalImagePanel'
import NeoadjuvantFormFields, { neoadjuvantValuesChangeHandler } from './NeoadjuvantFormFields'

const titleMap = {
  neoadjuvant: '新辅助治疗',
  adjuvant: '辅助治疗',
  salvage: '解救治疗',
}

interface Props {
  open: boolean
  onClose: () => void
  type: 'neoadjuvant' | 'adjuvant' | 'salvage'
}

const patientDefaults = {
  height: 162,
  weight: 58,
  ps: 1,
}

export default function TreatmentFormDrawer({ open, onClose, type }: Props) {
  const [form] = Form.useForm()
  const title = titleMap[type]

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      console.log('treatment form data:', values)
      message.success('保存成功')
      form.resetFields()
      onClose()
    } catch { /* validation */ }
  }

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      form.setFieldsValue({
        height: patientDefaults.height,
        weight: patientDefaults.weight,
        ps: patientDefaults.ps,
      })
    }
  }

  return (
    <Drawer
      title={title}
      open={open}
      onClose={handleClose}
      width={1080}
      styles={{ body: { padding: 0, display: 'flex', overflow: 'hidden' } }}
      afterOpenChange={handleOpenChange}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleClose} style={{ marginRight: 12 }}>取消</Button>
          <Button type="primary" onClick={handleSave} style={{ width: 120 }}>保存</Button>
        </div>
      }
    >
      <MedicalImagePanel />
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changed) => neoadjuvantValuesChangeHandler(form, changed)}
        >
          <NeoadjuvantFormFields form={form} />
        </Form>
      </div>
    </Drawer>
  )
}

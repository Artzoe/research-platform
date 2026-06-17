import { Modal, Form, Input, Select, DatePicker, Row, Col, Radio, Checkbox, InputNumber, message } from 'antd'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: (values: Record<string, unknown>) => void
}

export default function AddPatientModal({ open, onClose, onSuccess }: Props) {
  const [form] = Form.useForm()
  const gender = Form.useWatch('gender', form)
  const menstrualStatus = Form.useWatch('menstrualStatus', form)
  const hasPersonalTumor = Form.useWatch('hasPersonalTumor', form) as string | undefined
  const hasFamilyTumor = Form.useWatch('hasFamilyTumor', form) as string | undefined
  const personalTumor = Form.useWatch('personalTumorHistory', form) as string[] | undefined
  const familyTumor = Form.useWatch('familyTumorHistory', form) as string[] | undefined

  const handleValuesChange = (changed: Record<string, unknown>) => {
    if ('gender' in changed && changed.gender === '男') {
      form.setFieldsValue({ menstrualStatus: undefined, menopauseDate: undefined })
    }
    if ('menstrualStatus' in changed && changed.menstrualStatus !== '已绝经') {
      form.setFieldsValue({ menopauseDate: undefined })
    }
    if ('hasPersonalTumor' in changed && changed.hasPersonalTumor === '无') {
      form.setFieldsValue({ personalTumorHistory: undefined, personalTumorOther: undefined })
    }
    if ('hasFamilyTumor' in changed && changed.hasFamilyTumor === '无') {
      form.setFieldsValue({ familyTumorHistory: undefined, familyTumorOther: undefined })
    }
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      onSuccess(values)
      form.resetFields()
      message.success('患者添加成功')
    } catch { /* validation */ }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="新增患者"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="保存"
      cancelText="取消"
      width={640}
      destroyOnClose
    >
      <div style={{ borderBottom: '1px solid #f0f0f0', margin: '0 0 20px', paddingBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#1677ff' }}>基本信息</span>
      </div>
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入患者姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="birthDate" label="出生年月" rules={[{ required: true, message: '请选择出生年月' }]}>
              <DatePicker picker="month" style={{ width: '100%' }} placeholder="请选择年月" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="height" label="身高（CM）">
              <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} max={300} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="weight" label="体重（KG）">
              <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} max={500} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="psScore" label="PS（分）" rules={[{ required: true, message: '请选择PS评分' }]}>
              <Radio.Group>
                <Radio value={0}>0</Radio>
                <Radio value={1}>1</Radio>
                <Radio value={2}>2</Radio>
                <Radio value={3}>3</Radio>
                <Radio value={4}>4</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="gender" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
              <Select placeholder="请选择">
                <Select.Option value="男">男</Select.Option>
                <Select.Option value="女">女</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {gender !== '男' && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="menstrualStatus"
                label="月经状态"
                rules={gender === '女' ? [{ required: true, message: '请选择月经状态' }] : []}
              >
                <Radio.Group>
                  <Radio value="未绝经">未绝经</Radio>
                  <Radio value="已绝经">已绝经</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {menstrualStatus === '已绝经' && (
              <Col span={12}>
                <Form.Item name="menopauseDate" label="绝经日期">
                  <DatePicker style={{ width: '100%' }} placeholder="请选择绝经日期" />
                </Form.Item>
              </Col>
            )}
          </Row>
        )}

        <Form.Item label="个人其它肿瘤史">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 4px' }}>
            <Form.Item name="hasPersonalTumor" noStyle>
              <Radio.Group>
                <Radio value="无">无</Radio>
                <Radio value="有">有</Radio>
              </Radio.Group>
            </Form.Item>
            {hasPersonalTumor === '有' && (
              <div style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 4px' }}>
                <Form.Item name="personalTumorHistory" noStyle>
                  <Checkbox.Group style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0 4px' }}>
                    <Checkbox value="卵巢癌">卵巢癌</Checkbox>
                    <Checkbox value="胰腺癌">胰腺癌</Checkbox>
                    <Checkbox value="甲状腺癌">甲状腺癌</Checkbox>
                    <Checkbox value="其它">其它</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                {personalTumor?.includes('其它') && (
                  <Form.Item name="personalTumorOther" noStyle>
                    <Input placeholder="请输入" style={{ width: 140 }} />
                  </Form.Item>
                )}
              </div>
            )}
          </div>
        </Form.Item>

        <Form.Item label="家族肿瘤史">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 4px' }}>
            <Form.Item name="hasFamilyTumor" noStyle>
              <Radio.Group>
                <Radio value="无">无</Radio>
                <Radio value="有">有</Radio>
              </Radio.Group>
            </Form.Item>
            {hasFamilyTumor === '有' && (
              <div style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 4px' }}>
                <Form.Item name="familyTumorHistory" noStyle>
                  <Checkbox.Group style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0 4px' }}>
                    <Checkbox value="乳腺癌">乳腺癌</Checkbox>
                    <Checkbox value="卵巢癌">卵巢癌</Checkbox>
                    <Checkbox value="胰腺癌">胰腺癌</Checkbox>
                    <Checkbox value="前列腺癌">前列腺癌</Checkbox>
                    <Checkbox value="其它">其它</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                {familyTumor?.includes('其它') && (
                  <Form.Item name="familyTumorOther" noStyle>
                    <Input placeholder="请输入" style={{ width: 140 }} />
                  </Form.Item>
                )}
              </div>
            )}
          </div>
        </Form.Item>

        <div style={{ borderBottom: '1px solid #f0f0f0', margin: '4px 0 20px' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="brca1" label="BRCA1检查">
              <Radio.Group>
                <Radio value="未做">未做</Radio>
                <Radio value="阳性">阳性</Radio>
                <Radio value="阴性">阴性</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="brca2" label="BRCA2检测">
              <Radio.Group>
                <Radio value="未做">未做</Radio>
                <Radio value="阳性">阳性</Radio>
                <Radio value="阴性">阴性</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

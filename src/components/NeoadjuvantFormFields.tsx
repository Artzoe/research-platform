import { Form, DatePicker, Radio, Input, InputNumber, Select, Row, Col, Button } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { FormInstance } from 'antd'

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', margin: '20px 0 16px', paddingBottom: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1677ff' }}>{title}</span>
    </div>
  )
}

export const neoadjuvantEnumLabels = {
  treatType: { chemo: '化疗±靶向', target: '靶向治疗', endo: '内分泌治疗' } as Record<string, string>,
  progressresult: { 6: 'CR', 3: 'PR', 4: 'SD', 5: 'PD' } as Record<number, string>,
  isComplete: { 1: '是', 0: '否' } as Record<number, string>,
  incompleteReason: { 1: 'TTP', 2: 'TTF', 9999: '其他' } as Record<number, string>,
  ps: { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4' } as Record<number, string>,
  isUnionTarget: { 1: '是', 0: '否' } as Record<number, string>,
  ovaryControl: { 1: '是', 0: '否' } as Record<number, string>,
  chemoTreatmentName: { 'AC_TH': 'AC-TH', 'OTHER': '其他' } as Record<string, string>,
  targetTreatmentName: { 'H': 'H', 'OTHER': '其他' } as Record<string, string>,
  endoTreatName: { 'AI': 'AI', 'OTHER': '其他' } as Record<string, string>,
}

export function neoadjuvantValuesChangeHandler(form: FormInstance, changed: Record<string, unknown>) {
  if ('treatType' in changed) {
    form.setFieldsValue({
      treatmentName: undefined,
      otherTreatmentName: undefined,
      isUnionTarget: undefined,
      treatmentCount: undefined,
      medicineList: undefined,
      targetDate: undefined,
      targetEndDate: undefined,
      targetMedicineList: undefined,
      endoTreatName: undefined,
      endoMedicineList: undefined,
      ovaryControl: undefined,
      ovaryControlMode: undefined,
      progressresult: undefined,
      isComplete: undefined,
      incompleteReason: undefined,
      resultOtherValue: undefined,
    })
  }

  if ('treatmentName' in changed) {
    if (changed.treatmentName !== 'OTHER') {
      form.setFieldsValue({ otherTreatmentName: undefined })
    }
    if (changed.treatmentName !== 'OTHER') {
      form.setFieldsValue({ isUnionTarget: undefined })
    }
  }

  if ('endoTreatName' in changed) {
    if (changed.endoTreatName !== 'OTHER') {
      form.setFieldsValue({ otherTreatmentName: undefined })
    }
  }

  if ('isUnionTarget' in changed) {
    if (changed.isUnionTarget !== 1) {
      form.setFieldsValue({
        targetDate: undefined,
        targetEndDate: undefined,
        targetMedicineList: undefined,
      })
    }
  }

  if ('isComplete' in changed) {
    if (changed.isComplete !== 0) {
      form.setFieldsValue({ incompleteReason: undefined, resultOtherValue: undefined })
    }
  }

  if ('incompleteReason' in changed) {
    if (changed.incompleteReason !== 9999) {
      form.setFieldsValue({ resultOtherValue: undefined })
    }
  }

  if ('ovaryControl' in changed) {
    if (changed.ovaryControl !== 1) {
      form.setFieldsValue({ ovaryControlMode: undefined })
    }
  }
}

function DrugListField({ name, label }: { name: string; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{label}</div>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name: idx }) => (
              <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <div style={{ background: '#fafafa', padding: '4px 8px', borderRadius: 4, fontSize: 13, flexShrink: 0 }}>
                  药物{idx + 1}
                </div>
                <Form.Item name={[idx, 'medicineName']} noStyle rules={[{ required: true, message: '请输入药物名称' }]}>
                  <Input placeholder="药物名称" style={{ flex: 1 }} />
                </Form.Item>
                <Form.Item name={[idx, 'dose']} noStyle>
                  <InputNumber placeholder="剂量" style={{ width: 100 }} min={0} />
                </Form.Item>
                <Form.Item name={[idx, 'unit']} noStyle>
                  <Select placeholder="单位" style={{ width: 80 }} options={[{ value: 'mg', label: 'mg' }, { value: 'g', label: 'g' }, { value: 'ml', label: 'ml' }]} />
                </Form.Item>
                <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(idx)} />
              </div>
            ))}
            <Button type="link" icon={<PlusOutlined />} onClick={() => add()} size="small">
              添加药物
            </Button>
          </>
        )}
      </Form.List>
    </div>
  )
}

export default function NeoadjuvantFormFields({ form }: { form: FormInstance }) {
  const treatType = Form.useWatch('treatType', form) as string | undefined
  const treatmentName = Form.useWatch('treatmentName', form) as string | undefined
  const endoTreatName = Form.useWatch('endoTreatName', form) as string | undefined
  const isUnionTarget = Form.useWatch('isUnionTarget', form) as number | undefined
  const isComplete = Form.useWatch('isComplete', form) as number | undefined
  const incompleteReason = Form.useWatch('incompleteReason', form) as number | undefined
  const ovaryControl = Form.useWatch('ovaryControl', form) as number | undefined

  return (
    <>
      <SectionTitle title="治疗类型" />
      <Form.Item name="treatType" rules={[{ required: true, message: '请选择治疗类型' }]}>
        <Radio.Group>
          <Radio value="chemo">化疗±靶向</Radio>
          <Radio value="target">靶向治疗</Radio>
          <Radio value="endo">内分泌治疗</Radio>
        </Radio.Group>
      </Form.Item>

      {treatType && (
        <>
          <SectionTitle title="治疗时间" />
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="请选择" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="结束时间" rules={[{ required: true, message: '请选择结束时间' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="请选择" />
              </Form.Item>
            </Col>
          </Row>

          {/* Chemo-specific fields */}
          {treatType === 'chemo' && (
            <>
              <SectionTitle title="化疗方案" />
              <Form.Item name="treatmentName" label="化疗方案" rules={[{ required: true, message: '请选择化疗方案' }]}>
                <Radio.Group>
                  <Radio value="AC_TH">AC-TH</Radio>
                  <Radio value="OTHER">其他</Radio>
                </Radio.Group>
              </Form.Item>
              {treatmentName === 'OTHER' && (
                <>
                  <Form.Item name="otherTreatmentName" label="其他方案名称" rules={[{ required: true, message: '请输入方案名称' }]}>
                    <Input placeholder="请输入" style={{ width: 240 }} />
                  </Form.Item>
                  <Form.Item name="isUnionTarget" label="是否联合靶向" rules={[{ required: true, message: '请选择' }]}>
                    <Radio.Group>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </>
              )}
              <Form.Item name="treatmentCount" label="周期数" rules={[{ required: true, message: '请输入周期数' }]}>
                <InputNumber placeholder="请输入" style={{ width: 240 }} min={1} precision={0} />
              </Form.Item>

              <SectionTitle title="化疗药物" />
              <DrugListField name="medicineList" label="化疗药物列表" />

              {isUnionTarget === 1 && (
                <>
                  <SectionTitle title="联合靶向治疗" />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="targetDate" label="靶向药物开始时间" rules={[{ required: true, message: '请选择' }]}>
                        <DatePicker style={{ width: '100%' }} placeholder="请选择" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="targetEndDate" label="靶向药物结束时间" rules={[{ required: true, message: '请选择' }]}>
                        <DatePicker style={{ width: '100%' }} placeholder="请选择" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <DrugListField name="targetMedicineList" label="靶向药物列表" />
                </>
              )}
            </>
          )}

          {/* Target-specific fields */}
          {treatType === 'target' && (
            <>
              <SectionTitle title="靶向方案" />
              <Form.Item name="treatmentName" label="靶向方案" rules={[{ required: true, message: '请选择靶向方案' }]}>
                <Radio.Group>
                  <Radio value="H">H</Radio>
                  <Radio value="OTHER">其他</Radio>
                </Radio.Group>
              </Form.Item>
              {treatmentName === 'OTHER' && (
                <Form.Item name="otherTreatmentName" label="其他方案名称" rules={[{ required: true, message: '请输入方案名称' }]}>
                  <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
              )}

              <SectionTitle title="靶向药物" />
              <DrugListField name="targetMedicineList" label="靶向药物列表" />
            </>
          )}

          {/* Endo-specific fields */}
          {treatType === 'endo' && (
            <>
              <SectionTitle title="内分泌方案" />
              <Form.Item name="endoTreatName" label="内分泌方案" rules={[{ required: true, message: '请选择内分泌方案' }]}>
                <Radio.Group>
                  <Radio value="AI">AI</Radio>
                  <Radio value="OTHER">其他</Radio>
                </Radio.Group>
              </Form.Item>
              {endoTreatName === 'OTHER' && (
                <Form.Item name="otherTreatmentName" label="其他方案名称" rules={[{ required: true, message: '请输入方案名称' }]}>
                  <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
              )}

              <SectionTitle title="内分泌药物" />
              <DrugListField name="endoMedicineList" label="内分泌药物列表" />

              <SectionTitle title="卵巢抑制" />
              <Form.Item name="ovaryControl" label="是否卵巢抑制" rules={[{ required: true, message: '请选择' }]}>
                <Radio.Group>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </Form.Item>
              {ovaryControl === 1 && (
                <Form.Item name="ovaryControlMode" label="卵巢抑制方式" rules={[{ required: true, message: '请选择抑制方式' }]}>
                  <Radio.Group>
                    <Radio value="手术">手术</Radio>
                    <Radio value="药物">药物</Radio>
                  </Radio.Group>
                </Form.Item>
              )}
            </>
          )}

          <SectionTitle title="疗效评估" />
          <Form.Item name="progressresult" label="最佳疗效" rules={[{ required: true, message: '请选择最佳疗效' }]}>
            <Radio.Group>
              <Radio value={6}>CR</Radio>
              <Radio value={3}>PR</Radio>
              <Radio value={4}>SD</Radio>
              <Radio value={5}>PD</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="isComplete" label="是否完成计划疗程" rules={[{ required: true, message: '请选择' }]}>
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
          {isComplete === 0 && (
            <>
              <Form.Item name="incompleteReason" label="未完成原因" rules={[{ required: true, message: '请选择未完成原因' }]}>
                <Radio.Group>
                  <Radio value={1}>TTP</Radio>
                  <Radio value={2}>TTF</Radio>
                  <Radio value={9999}>其他</Radio>
                </Radio.Group>
              </Form.Item>
              {incompleteReason === 9999 && (
                <Form.Item name="resultOtherValue" label="其他原因" rules={[{ required: true, message: '请输入其他原因' }]}>
                  <Input placeholder="请输入" style={{ width: 240 }} />
                </Form.Item>
              )}
            </>
          )}

          <SectionTitle title="体征信息" />
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="height" label="身高（CM）" rules={[{ required: true, message: '请输入身高' }]}>
                <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} max={300} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="weight" label="体重（KG）" rules={[{ required: true, message: '请输入体重' }]}>
                <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} max={500} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="ps" label="PS评分" rules={[{ required: true, message: '请选择PS评分' }]}>
                <Radio.Group>
                  <Radio value={0}>0</Radio>
                  <Radio value={1}>1</Radio>
                  <Radio value={2}>2</Radio>
                  <Radio value={3}>3</Radio>
                  <Radio value={4}>4</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

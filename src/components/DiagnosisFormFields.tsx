import { Form, DatePicker, Radio, Checkbox, Input, InputNumber, Row, Col, Modal } from 'antd'
import type { FormInstance } from 'antd'

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', margin: '20px 0 16px', paddingBottom: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1677ff' }}>{title}</span>
    </div>
  )
}

export const enumLabels = {
  primaryLocation: { 1: '左乳', 2: '右乳', 3: '双侧' } as Record<number, string>,
  histologytype: { 1: '浸润性小叶癌', 2: '浸润性导管癌', 9999: '其他' } as Record<number, string>,
  g: { G1: 'Ⅰ级', G2: 'Ⅱ级', G3: 'Ⅲ级' } as Record<string, string>,
  samplingMode: { 1: '穿刺活检', 2: '切除活检', 3: '切取活检' } as Record<number, string>,
  samplingLocation: { 1: '原发灶', 2: '淋巴结', 3: '转移灶' } as Record<number, string>,
  mammaryHer2: { 0: '-', 1: '+', 2: '2+', 3: '3+' } as Record<number, string>,
  mammaryFISH: { 0: '未扩增', 1: '扩增' } as Record<number, string>,
  mammaryER: { 0: '-', 1: '+', 2: '2+', 3: '3+' } as Record<number, string>,
  mammaryPR: { 0: '-', 1: '+', 2: '2+', 3: '3+' } as Record<number, string>,
  cancut: { 1: '是', 0: '否' } as Record<number, string>,
  movePosition: { 10: '肺', 20: '肝', 4: '骨', 0: '脑', 9999: '其他' } as Record<number, string>,
  isViscusDanger: { 0: '无', 1: '有' } as Record<number, string>,
  firstDiagReason: { 1: '乳腺包块', 2: '乳头溢液', 9999: '其他' } as Record<number, string>,
  checkMode: { 1: '查体', 2: 'B超', 3: 'MRI', 4: '钼靶' } as Record<number, string>,
  isPrimarySkin: { 0: '无', 1: '有' } as Record<number, string>,
}

export function diagnosisValuesChangeHandler(form: FormInstance, changed: Record<string, unknown>) {
  if ('mStage' in changed) {
    if (changed.mStage === 'M0') {
      form.setFieldsValue({ movePosition: undefined, movePositionOtherValue: undefined, isViscusDanger: undefined })
    } else if (changed.mStage === 'M1') {
      form.setFieldsValue({ cancut: undefined })
    }
  }
  if ('movePosition' in changed) {
    const arr = changed.movePosition as number[] | undefined
    if (!arr?.includes(9999)) form.setFieldsValue({ movePositionOtherValue: undefined })
  }
  if ('firstDiagReason' in changed) {
    const arr = changed.firstDiagReason as number[] | undefined
    if (!arr?.includes(9999)) form.setFieldsValue({ firstDiagReasonOtherValue: undefined })
  }
  if ('histologytype' in changed) {
    if (changed.histologytype !== 9999) form.setFieldsValue({ histologytypeOtherValue: undefined })
  }
  if ('mammaryHer2' in changed) {
    if (changed.mammaryHer2 !== 2) form.setFieldsValue({ mammaryFISH: undefined, mammaryFISHNum: undefined })
  }
  if ('mammaryFISH' in changed) {
    if (changed.mammaryFISH === 0) {
      form.setFieldsValue({ mammaryFISHNum: 0 })
    } else if (changed.mammaryFISH === 1 && form.getFieldValue('mammaryFISHNum') === 0) {
      form.setFieldsValue({ mammaryFISHNum: undefined })
    }
  }
  if ('mammaryER' in changed) {
    if (changed.mammaryER === 0) form.setFieldsValue({ er: 0 })
    else if (form.getFieldValue('er') === 0) form.setFieldsValue({ er: undefined })
  }
  if ('mammaryPR' in changed) {
    if (changed.mammaryPR === 0) form.setFieldsValue({ pr: 0 })
    else if (form.getFieldValue('pr') === 0) form.setFieldsValue({ pr: undefined })
  }
  if ('primaryLocation' in changed) {
    if (changed.primaryLocation === 3) {
      form.setFieldsValue({ cancersizeLong: undefined, cancersizeShort: undefined })
    } else {
      form.setFieldsValue({ leftCancerSizeLong: undefined, leftCancerSizeShort: undefined, rightCancerSizeLong: undefined, rightCancerSizeShort: undefined })
    }
  }
  if ('samplingLocation' in changed && changed.samplingLocation === 3 && form.getFieldValue('mStage') === 'M0') {
    Modal.warning({ title: '提示', content: '当前 M 分期为 M0，但取样部位选择了"转移灶"。请确认是否需要调整 M 分期。' })
  }
}

interface Props {
  form: FormInstance
}

export default function DiagnosisFormFields({ form }: Props) {
  const mStage = Form.useWatch('mStage', form) as string | undefined
  const movePosition = Form.useWatch('movePosition', form) as number[] | undefined
  const firstDiagReason = Form.useWatch('firstDiagReason', form) as number[] | undefined
  const primaryLocation = Form.useWatch('primaryLocation', form) as number | undefined
  const histologytype = Form.useWatch('histologytype', form) as number | undefined
  const mammaryHer2 = Form.useWatch('mammaryHer2', form) as number | undefined
  const mammaryFISH = Form.useWatch('mammaryFISH', form) as number | undefined
  const mammaryER = Form.useWatch('mammaryER', form) as number | undefined
  const mammaryPR = Form.useWatch('mammaryPR', form) as number | undefined

  return (
    <>
      <SectionTitle title="一、基础信息" />
      <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择初诊日期' }]}>
        <DatePicker style={{ width: '100%' }} placeholder="请选择日期" />
      </Form.Item>

      <SectionTitle title="二、临床分期" />
      <Form.Item name="tStage" label="T 分期" rules={[{ required: true, message: '请选择T分期' }]}>
        <Radio.Group>
          <Radio value="cT1">cT1</Radio>
          <Radio value="cT2">cT2</Radio>
          <Radio value="cT3">cT3</Radio>
          <Radio value="cT4">cT4</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="nStage" label="N 分期" rules={[{ required: true, message: '请选择N分期' }]}>
        <Radio.Group>
          <Radio value="N0">N0</Radio>
          <Radio value="N1">N1</Radio>
          <Radio value="N2">N2</Radio>
          <Radio value="N3">N3</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="mStage" label="M 分期" rules={[{ required: true, message: '请选择M分期' }]}>
        <Radio.Group>
          <Radio value="M0">M0</Radio>
          <Radio value="M1">M1</Radio>
        </Radio.Group>
      </Form.Item>
      {mStage === 'M0' && (
        <Form.Item name="cancut" label="是否可切" rules={[{ required: true, message: '请选择是否可切' }]}>
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
      )}
      {mStage === 'M1' && (
        <>
          <Form.Item name="movePosition" label="转移灶" rules={[{ required: true, message: '请选择转移灶' }]}>
            <Checkbox.Group>
              <Checkbox value={10}>肺</Checkbox>
              <Checkbox value={20}>肝</Checkbox>
              <Checkbox value={4}>骨</Checkbox>
              <Checkbox value={0}>脑</Checkbox>
              <Checkbox value={9999}>其他</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          {movePosition?.includes(9999) && (
            <Form.Item name="movePositionOtherValue" label="其他转移灶说明" rules={[{ required: true, message: '请填写其他转移灶部位' }]}>
              <Input placeholder="请输入其他转移灶部位" />
            </Form.Item>
          )}
          <Form.Item name="isViscusDanger" label="内脏危象" rules={[{ required: true, message: '请选择内脏危象' }]}>
            <Radio.Group>
              <Radio value={0}>无</Radio>
              <Radio value={1}>有</Radio>
            </Radio.Group>
          </Form.Item>
        </>
      )}

      <SectionTitle title="三、初诊表现" />
      <Form.Item name="firstDiagReason" label="初诊原因">
        <Checkbox.Group>
          <Checkbox value={1}>乳腺包块</Checkbox>
          <Checkbox value={2}>乳头溢液</Checkbox>
          <Checkbox value={9999}>其他</Checkbox>
        </Checkbox.Group>
      </Form.Item>
      {firstDiagReason?.includes(9999) && (
        <Form.Item name="firstDiagReasonOtherValue" label="其他初诊原因" rules={[{ required: true, message: '请填写其他初诊原因' }]}>
          <Input placeholder="请输入其他初诊原因" />
        </Form.Item>
      )}

      <SectionTitle title="四、原发灶信息" />
      <Form.Item name="primaryLocation" label="原发灶部位" rules={[{ required: true, message: '请选择原发灶部位' }]}>
        <Radio.Group>
          <Radio value={1}>左乳</Radio>
          <Radio value={2}>右乳</Radio>
          <Radio value={3}>双侧</Radio>
        </Radio.Group>
      </Form.Item>
      {primaryLocation != null && primaryLocation !== 3 && (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="cancersizeLong" label="肿块长径（cm）">
              <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="cancersizeShort" label="肿块短径（cm）">
              <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
            </Form.Item>
          </Col>
        </Row>
      )}
      {primaryLocation === 3 && (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="leftCancerSizeLong" label="左乳肿块长径（cm）">
                <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="leftCancerSizeShort" label="左乳肿块短径（cm）">
                <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="rightCancerSizeLong" label="右乳肿块长径（cm）">
                <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="rightCancerSizeShort" label="右乳肿块短径（cm）">
                <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
      <Form.Item name="checkMode" label="检查方式">
        <Checkbox.Group>
          <Checkbox value={1}>查体</Checkbox>
          <Checkbox value={2}>B超</Checkbox>
          <Checkbox value={3}>MRI</Checkbox>
          <Checkbox value={4}>钼靶</Checkbox>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item name="isPrimarySkin" label="皮肤受侵">
        <Radio.Group>
          <Radio value={0}>无</Radio>
          <Radio value={1}>有</Radio>
        </Radio.Group>
      </Form.Item>

      <SectionTitle title="五、淋巴结信息" />
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="lymphSizeArmpitLong" label="腋窝淋巴结长径（cm）">
            <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="lymphSizeArmpitShort" label="腋窝淋巴结短径（cm）">
            <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="lymphSizeClavicleDownLong" label="锁下淋巴结长径（cm）">
            <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="lymphSizeClavicleDownShort" label="锁下淋巴结短径（cm）">
            <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="lymphSizeClavicleUpLong" label="锁上淋巴结长径（cm）">
            <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="lymphSizeClavicleUpShort" label="锁上淋巴结短径（cm）">
            <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="lymphSizeEndospermLong" label="内乳淋巴结长径（cm）">
            <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="lymphSizeEndospermShort" label="内乳淋巴结短径（cm）">
            <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} step={0.1} precision={1} />
          </Form.Item>
        </Col>
      </Row>

      <SectionTitle title="六、活检病理" />
      <Form.Item name="histologytype" label="组织学类型" rules={[{ required: true, message: '请选择组织学类型' }]}>
        <Radio.Group>
          <Radio value={1}>浸润性小叶癌</Radio>
          <Radio value={2}>浸润性导管癌</Radio>
          <Radio value={9999}>其他</Radio>
        </Radio.Group>
      </Form.Item>
      {histologytype === 9999 && (
        <Form.Item name="histologytypeOtherValue" label="其他组织学类型" rules={[{ required: true, message: '请填写其他组织学类型' }]}>
          <Input placeholder="请输入其他组织学类型" />
        </Form.Item>
      )}
      <Form.Item name="g" label="组织学分级" rules={[{ required: true, message: '请选择组织学分级' }]}>
        <Radio.Group>
          <Radio value="G1">Ⅰ级</Radio>
          <Radio value="G2">Ⅱ级</Radio>
          <Radio value="G3">Ⅲ级</Radio>
        </Radio.Group>
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="samplingMode" label="取样方式">
            <Radio.Group>
              <Radio value={1}>穿刺活检</Radio>
              <Radio value={2}>切除活检</Radio>
              <Radio value={3}>切取活检</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="samplingLocation" label="取样部位">
            <Radio.Group>
              <Radio value={1}>原发灶</Radio>
              <Radio value={2}>淋巴结</Radio>
              <Radio value={3}>转移灶</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <SectionTitle title="七、分子病理" />
      <Form.Item name="mammaryHer2" label="HER-2" rules={[{ required: true, message: '请选择HER-2' }]}>
        <Radio.Group>
          <Radio value={0}>-</Radio>
          <Radio value={1}>+</Radio>
          <Radio value={2}>2+</Radio>
          <Radio value={3}>3+</Radio>
        </Radio.Group>
      </Form.Item>
      {mammaryHer2 === 2 && (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="mammaryFISH" label="FISH" rules={[{ required: true, message: '请选择FISH' }]}>
              <Radio.Group>
                <Radio value={0}>未扩增</Radio>
                <Radio value={1}>扩增</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mammaryFISHNum"
              label="FISH 比值"
              rules={mammaryFISH === 1 ? [{ required: true, message: '请输入FISH比值' }] : []}
            >
              <InputNumber
                placeholder={mammaryFISH === 0 ? '未扩增自动为0' : '请输入'}
                style={{ width: '100%' }}
                min={0}
                step={0.1}
                precision={2}
                disabled={mammaryFISH === 0}
              />
            </Form.Item>
          </Col>
        </Row>
      )}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="mammaryER" label="ER 强度" rules={[{ required: true, message: '请选择ER强度' }]}>
            <Radio.Group>
              <Radio value={0}>-</Radio>
              <Radio value={1}>+</Radio>
              <Radio value={2}>2+</Radio>
              <Radio value={3}>3+</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="er"
            label="ER 百分比（%）"
            rules={mammaryER != null && mammaryER > 0 ? [{ required: true, message: '请输入ER百分比' }] : []}
          >
            <InputNumber
              placeholder={mammaryER === 0 ? '阴性自动为0' : '请输入'}
              style={{ width: '100%' }}
              min={0}
              max={100}
              step={0.1}
              precision={1}
              disabled={mammaryER === 0}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="mammaryPR" label="PR 强度" rules={[{ required: true, message: '请选择PR强度' }]}>
            <Radio.Group>
              <Radio value={0}>-</Radio>
              <Radio value={1}>+</Radio>
              <Radio value={2}>2+</Radio>
              <Radio value={3}>3+</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="pr"
            label="PR 百分比（%）"
            rules={mammaryPR != null && mammaryPR > 0 ? [{ required: true, message: '请输入PR百分比' }] : []}
          >
            <InputNumber
              placeholder={mammaryPR === 0 ? '阴性自动为0' : '请输入'}
              style={{ width: '100%' }}
              min={0}
              max={100}
              step={0.1}
              precision={1}
              disabled={mammaryPR === 0}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="ki67" label="Ki-67（%）" rules={[{ required: true, message: '请输入Ki-67' }]}>
        <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} max={100} step={0.1} precision={1} />
      </Form.Item>
    </>
  )
}

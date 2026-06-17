import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Tag,
  Table,
  Empty,
  Space,
  Tooltip,
  Drawer,
  Form,
  Checkbox,
  DatePicker,
  Input,
  Tabs,
  message,
  Select,
  InputNumber,
  Radio,
} from 'antd'
import {
  EditOutlined,
  PlusSquareOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  RightOutlined,
  PictureOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import DiagnosisFormDrawer from '../components/DiagnosisFormDrawer'
import DiagnosisFormFields, { enumLabels, diagnosisValuesChangeHandler } from '../components/DiagnosisFormFields'
import TreatmentFormDrawer from '../components/TreatmentFormDrawer'
import SurgeryFormDrawer from '../components/SurgeryFormDrawer'
import RadiationFormDrawer from '../components/RadiationFormDrawer'
import RecurrenceFormDrawer from '../components/RecurrenceFormDrawer'
import MedicalImagePanel from '../components/MedicalImagePanel'
import MedicalImageModal from '../components/MedicalImageModal'
import './PatientDetail.css'

const patientInfo = {
  name: '欧阳*健',
  gender: '女',
  birthDate: '1975-05',
  menstrualStatus: '已绝经',
  menopauseDate: '2020-03-15',
  psScore: 1,
  height: 162,
  weight: 58,
  personalTumorHistory: '无',
  familyTumorHistory: '乳腺癌',
  brca1: '阳性',
  brca2: '阴性',
  updatedAt: '2022-12-12 12:12:12',
  createdAt: '2022-12-12 12:12:12',
}

const diagnosisData = {
  date: '2021-12-01',
  tStage: 'cT2',
  nStage: 'N1',
  mStage: 'M0' as string,
  cancut: 1,
  firstDiagReason: [1] as number[],
  primaryLocation: 1,
  cancersizeLong: 3.2,
  cancersizeShort: 1.2,
  checkMode: [2, 3] as number[],
  isPrimarySkin: 0,
  lymphSizeArmpitLong: 0.3,
  lymphSizeArmpitShort: 0.1,
  histologytype: 2,
  g: 'G2',
  samplingMode: 1,
  samplingLocation: 1,
  mammaryHer2: 2,
  mammaryFISH: 1,
  mammaryFISHNum: 2.1,
  mammaryER: 2,
  er: 45,
  mammaryPR: 1,
  pr: 15,
  ki67: 56,
}

const surgeryRecords = [
  {
    key: '1',
    date: '2019-07-12',
    plan: 'xxxxx手术方案',
    type: '根治型手术',
    stage: 'T1N2M1',
    incision: '阳性',
    bloodVessel: '是',
    lymphNode: '是',
    sentinelNode: '否',
    location: '左乳',
    tissueType: '原位癌',
    grade: '高分化（I级）',
    er: '1+',
    erPercent: '50%',
    pr: '1+',
    prPercent: '34%',
    her2: '2+',
    herFish: '扩增',
    her2Fish: '3+',
    ki67: '56%',
  },
]

const treatmentColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60 },
  { title: '输注时间', dataIndex: 'date', key: 'date', width: 120 },
  { title: '药物', dataIndex: 'drug', key: 'drug' },
  { title: '剂量', dataIndex: 'dose', key: 'dose', width: 80 },
]

const evaluationColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 60 },
  { title: '评估时间', dataIndex: 'date', key: 'date', width: 120 },
  { title: '评估结果', dataIndex: 'result', key: 'result', width: 100 },
  { title: '靶病灶评估', dataIndex: 'target', key: 'target' },
]

const neoadjuvantData = {
  courses: [
    {
      name: '新辅助治疗1',
      plan: 'AP',
      method: '内分泌治疗',
      drugMethod: '静脉输注',
      drugs: [
        { key: '1', seq: 1, date: '2019-06-18', drug: '卡铂他滨', dose: '24ml' },
        { key: '1b', seq: '', date: '', drug: 'xxxxxx', dose: '24ml' },
        { key: '2', seq: 2, date: '2019-07-02', drug: '卡铂他滨', dose: '24ml' },
      ],
      oralDrugs: [
        { key: '1', seq: 1, date: '2019-06-18', drug: '卡铂他滨', dose: '24ml' },
        { key: '1b', seq: '', date: '', drug: 'xxxxxx', dose: '24ml' },
        { key: '2', seq: 2, date: '2019-07-02', drug: '卡铂他滨', dose: '24ml' },
      ],
      evaluations: [
        { key: '1', seq: 1, date: '2019-06-18', result: 'SD', target: 'XXXXX' },
        { key: '2', seq: 2, date: '2019-07-02', result: 'PD', target: 'XXXXX' },
      ],
      hasAE: '有',
      aeType: '血液毒性',
      aeEvents: [
        { key: '1', type: '血液毒性', category: 'xxxxxx', date: '2019-07-02', level: 'N/度', returnDate: '2019-07-02', drug: '卡铂他滨' },
      ],
    },
  ],
}

const geneData = [
  { key: '1', seq: 1, uploadTime: '2019-06-18\n07:06:23', name: 'xxxxxxxxxxxxx', filename: 'xxxxxx' },
  { key: '2', seq: 2, uploadTime: '2019-06-18\n07:08:23', name: 'xxxxxxxxxxxxx', filename: 'xxxxxx' },
]

interface SectionProps {
  title: string
  buttonText: string
  onAdd: () => void
  onClickBody?: () => void
  children: ReactNode
  hasData?: boolean
  tag?: ReactNode
}

function Section({ title, buttonText, onAdd, onClickBody, children, hasData = true, tag }: SectionProps) {
  return (
    <div className="detail-section">
      <div className="section-header">
        <div className="section-title-group">
          <div className="section-title-bar" />
          <h3 className="section-title">{title}</h3>
          {tag}
        </div>
        <Button type="link" icon={<PlusSquareOutlined />} onClick={onAdd}>
          {buttonText}
        </Button>
      </div>
      <div
        className={`section-body ${onClickBody ? 'clickable' : ''}`}
        onClick={onClickBody}
      >
        {hasData ? children : <Empty description="暂无记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </div>
    </div>
  )
}

type PreviewSection = 'diagnosis' | 'neoadjuvant' | 'surgery' | 'adjuvant' | 'radiation' | 'recurrence' | 'salvage' | 'gene' | null

function renderSectionPreview(section: PreviewSection) {
  switch (section) {
    case 'diagnosis':
      return (
        <div>
          <div className="diagnosis-grid">
            <div className="diag-row"><span className="diag-label">日期：</span><span>{diagnosisData.date}</span></div>
            <div className="diag-row"><span className="diag-label">临床分期：</span><span>{diagnosisData.tStage} {diagnosisData.nStage} {diagnosisData.mStage}</span></div>
            {diagnosisData.mStage === 'M0' && diagnosisData.cancut != null && (
              <div className="diag-row"><span className="diag-label">是否可切：</span><span>{enumLabels.cancut[diagnosisData.cancut]}</span></div>
            )}
            <div className="diag-row"><span className="diag-label">初诊原因：</span><span>{diagnosisData.firstDiagReason.map(v => enumLabels.firstDiagReason[v]).join('、')}</span></div>
            <div className="diag-row"><span className="diag-label">原发灶部位：</span><span>{enumLabels.primaryLocation[diagnosisData.primaryLocation]}</span></div>
            <div className="diag-row"><span className="diag-label">肿块大小：</span><span>{diagnosisData.cancersizeLong} × {diagnosisData.cancersizeShort} cm</span></div>
            <div className="diag-row"><span className="diag-label">检查方式：</span><span>{diagnosisData.checkMode.map(v => enumLabels.checkMode[v]).join('、')}</span></div>
            <div className="diag-row"><span className="diag-label">皮肤受侵：</span><span>{enumLabels.isPrimarySkin[diagnosisData.isPrimarySkin]}</span></div>
            <div className="diag-row"><span className="diag-label">组织学类型：</span><span>{enumLabels.histologytype[diagnosisData.histologytype]}</span></div>
            <div className="diag-row"><span className="diag-label">组织学分级：</span><span>{enumLabels.g[diagnosisData.g]}</span></div>
            <div className="diag-row"><span className="diag-label">取样方式：</span><span>{enumLabels.samplingMode[diagnosisData.samplingMode]}</span></div>
            <div className="diag-row"><span className="diag-label">取样部位：</span><span>{enumLabels.samplingLocation[diagnosisData.samplingLocation]}</span></div>
            <div className="diag-row"><span className="diag-label">HER-2：</span><span>{enumLabels.mammaryHer2[diagnosisData.mammaryHer2]}</span></div>
            {diagnosisData.mammaryHer2 === 2 && (
              <>
                <div className="diag-row"><span className="diag-label">FISH：</span><span>{enumLabels.mammaryFISH[diagnosisData.mammaryFISH]}</span></div>
                <div className="diag-row"><span className="diag-label">FISH 比值：</span><span>{diagnosisData.mammaryFISHNum}</span></div>
              </>
            )}
            <div className="diag-row"><span className="diag-label">ER：</span><span>{enumLabels.mammaryER[diagnosisData.mammaryER]}（{diagnosisData.er}%）</span></div>
            <div className="diag-row"><span className="diag-label">PR：</span><span>{enumLabels.mammaryPR[diagnosisData.mammaryPR]}（{diagnosisData.pr}%）</span></div>
            <div className="diag-row"><span className="diag-label">Ki-67：</span><span>{diagnosisData.ki67}%</span></div>
          </div>
        </div>
      )
    case 'neoadjuvant':
    case 'adjuvant':
    case 'salvage': {
      const label = section === 'neoadjuvant' ? '新辅助治疗' : section === 'adjuvant' ? '辅助治疗' : '解救治疗'
      return (
        <div>
          {neoadjuvantData.courses.map((course, idx) => (
            <div key={idx} className="treatment-course">
              <div className="course-name">{label}{idx + 1}</div>
              <div className="course-meta">
                <span>治疗方案：{course.plan}</span>
                <span>治疗方式：{course.method}</span>
                <span>用药方式：{course.drugMethod}</span>
              </div>
              <Table columns={treatmentColumns} dataSource={course.drugs} pagination={false} size="small" bordered className="compact-table" />
              <div className="sub-title">疗效评估</div>
              <Table columns={evaluationColumns} dataSource={course.evaluations} pagination={false} size="small" bordered className="compact-table" />
              <div className="ae-info"><span>有无III度及以上AE事件：{course.hasAE}</span></div>
            </div>
          ))}
        </div>
      )
    }
    case 'surgery':
      return (
        <div>
          {surgeryRecords.map((record, idx) => (
            <div key={idx} className="surgery-record" style={{ border: 'none', padding: 0 }}>
              <div className="record-date" style={{ marginBottom: 8 }}>{record.date}</div>
              <div className="diagnosis-grid">
                <div className="diag-row"><span className="diag-label">手术方案：</span><span>{record.plan}</span></div>
                <div className="diag-row"><span className="diag-label">手术类型：</span><span>{record.type}</span></div>
                <div className="diag-row"><span className="diag-label">病理分期：</span><span>{record.stage}</span></div>
                <div className="diag-row"><span className="diag-label">切缘：</span><span>{record.incision}</span></div>
                <div className="diag-row"><span className="diag-label">血管浸润：</span><span>{record.bloodVessel}</span></div>
                <div className="diag-row"><span className="diag-label">淋巴转移：</span><span>{record.lymphNode}</span></div>
                <div className="diag-row"><span className="diag-label">部位：</span><span>{record.location}</span></div>
                <div className="diag-row"><span className="diag-label">组织类型：</span><span>{record.tissueType}</span></div>
              </div>
            </div>
          ))}
        </div>
      )
    case 'radiation':
      return (
        <div>
          <div className="course-meta">
            <span>时间：2019-06-12 ~ 2019-06-14</span>
            <span>部位：左乳</span>
            <span>剂量：xxx</span>
            <span>次数：5</span>
          </div>
        </div>
      )
    case 'recurrence':
      return (
        <div>
          <div className="course-meta">
            <span>日期：2019-06-12</span>
            <span>转移部位：胸部</span>
          </div>
        </div>
      )
    case 'gene':
      return (
        <div>
          <Table
            columns={[
              { title: '序号', dataIndex: 'seq', key: 'seq', width: 60 },
              { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime', width: 120, render: (t: string) => <span style={{ whiteSpace: 'pre-line' }}>{t}</span> },
              { title: '名称', dataIndex: 'name', key: 'name' },
            ]}
            dataSource={geneData}
            pagination={false}
            size="small"
            bordered
            className="compact-table"
          />
        </div>
      )
    default:
      return null
  }
}

const previewTitleMap: Record<string, string> = {
  diagnosis: '初诊病情',
  neoadjuvant: '新辅助治疗',
  surgery: '手术记录',
  adjuvant: '辅助治疗',
  radiation: '放疗记录',
  recurrence: '复发转移记录',
  salvage: '解救治疗',
  gene: '基因',
}

export default function PatientDetail() {
  const navigate = useNavigate()
  const [diagnosisOpen, setDiagnosisOpen] = useState(false)
  const [treatmentOpen, setTreatmentOpen] = useState(false)
  const [treatmentType, setTreatmentType] = useState<'neoadjuvant' | 'adjuvant' | 'salvage'>('neoadjuvant')
  const [surgeryOpen, setSurgeryOpen] = useState(false)
  const [radiationOpen, setRadiationOpen] = useState(false)
  const [recurrenceOpen, setRecurrenceOpen] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [previewSection, setPreviewSection] = useState<PreviewSection>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm] = Form.useForm()
  const [editTabs, setEditTabs] = useState(['1'])
  const [editActiveTab, setEditActiveTab] = useState('1')
  const editCompletedPlan = Form.useWatch('completedPlan', editForm)

  const openTreatment = (type: 'neoadjuvant' | 'adjuvant' | 'salvage') => {
    setTreatmentType(type)
    setTreatmentOpen(true)
  }

  const handlePreviewClose = () => {
    setPreviewSection(null)
    setIsEditing(false)
    editForm.resetFields()
    setEditTabs(['1'])
    setEditActiveTab('1')
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    editForm.resetFields()
    setEditTabs(['1'])
    setEditActiveTab('1')
  }

  const handleEditSave = () => {
    message.success('保存成功')
    setIsEditing(false)
    editForm.resetFields()
    setEditTabs(['1'])
    setEditActiveTab('1')
  }

  const addEditTab = () => {
    const next = String(editTabs.length + 1)
    setEditTabs([...editTabs, next])
    setEditActiveTab(next)
  }

  const removeEditTab = (key: string) => {
    const filtered = editTabs.filter(t => t !== key)
    setEditTabs(filtered)
    if (editActiveTab === key) setEditActiveTab(filtered[0])
  }

  const renderSectionForm = () => {
    switch (previewSection) {
      case 'diagnosis':
        return (
          <Form form={editForm} layout="vertical" onValuesChange={(changed) => diagnosisValuesChangeHandler(editForm, changed)}>
            <DiagnosisFormFields form={editForm} />
          </Form>
        )
      case 'neoadjuvant':
      case 'adjuvant':
      case 'salvage': {
        const treatLabel = previewSection === 'neoadjuvant' ? '新辅助治疗' : previewSection === 'adjuvant' ? '辅助治疗' : '解救治疗'
        const methodOptions = ['化疗', '靶向', '免疫治疗', '放疗', '内分泌治疗']
        return (
          <>
            <Tabs
              activeKey={editActiveTab}
              onChange={setEditActiveTab}
              type="editable-card"
              onEdit={(key, action) => { if (action === 'add') addEditTab(); else removeEditTab(key as string) }}
              items={editTabs.map(t => ({ key: t, label: `${treatLabel}${t}`, closable: editTabs.length > 1 }))}
              tabBarExtraContent={<Button type="text" icon={<PlusOutlined />} onClick={addEditTab} size="small" />}
            />
            <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
              <div className="drawer-form-section"><span className="section-label">治疗方案</span><Form.Item name="plan"><Input placeholder="请输入" /></Form.Item></div>
              <div className="drawer-form-section"><span className="section-label">治疗方式</span><Form.Item name="method"><Checkbox.Group options={methodOptions} /></Form.Item></div>
              <div className="drawer-form-section"><span className="section-label">用药记录</span></div>
              <Form.List name="sessions">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => (
                      <div key={key} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div style={{ background: '#fafafa', padding: '4px 12px', borderRadius: 4, fontSize: 13 }}>第{name + 1}次</div>
                          <Form.Item name={[name, 'date']} noStyle><DatePicker placeholder="请选择" style={{ flex: 1 }} /></Form.Item>
                          <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                        </div>
                        <Form.List name={[name, 'drugs']}>
                          {(drugFields, drugOps) => (
                            <>
                              {drugFields.map(({ key: dk, name: dn }) => (
                                <div key={dk} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                                  <span style={{ color: '#ccc', fontSize: 18 }}>•</span>
                                  <div style={{ background: '#fafafa', padding: '4px 8px', borderRadius: 4, fontSize: 13, flexShrink: 0 }}>药物{dn + 1}</div>
                                  <Form.Item name={[dn, 'name']} noStyle><Input placeholder="请输入" /></Form.Item>
                                  <div style={{ background: '#fafafa', padding: '4px 8px', borderRadius: 4, fontSize: 13, flexShrink: 0 }}>剂量</div>
                                  <Form.Item name={[dn, 'dose']} noStyle><Input placeholder="请输入" style={{ width: 100 }} /></Form.Item>
                                  <Form.Item name={[dn, 'doseUnit']} noStyle>
                                    <Select placeholder="单位" style={{ width: 90 }} options={[
                                      { value: 'mg', label: 'mg' },
                                      { value: 'mg/m²', label: 'mg/m²' },
                                      { value: 'mg/kg', label: 'mg/kg' },
                                      { value: 'g', label: 'g' },
                                      { value: 'ml', label: 'ml' },
                                      { value: 'μg', label: 'μg' },
                                      { value: 'IU', label: 'IU' },
                                      { value: 'AUC', label: 'AUC' },
                                    ]} />
                                  </Form.Item>
                                  <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => drugOps.remove(dn)} />
                                </div>
                              ))}
                              <Button type="link" icon={<PlusSquareOutlined />} onClick={() => drugOps.add()} size="small">添加药物</Button>
                            </>
                          )}
                        </Form.List>
                      </div>
                    ))}
                    <Button type="link" icon={<PlusSquareOutlined />} onClick={() => add({ drugs: [{}] })} block style={{ marginBottom: 24 }}>添加用药时间</Button>
                  </>
                )}
              </Form.List>
              <div className="drawer-form-section">
                <span className="section-label">疗效评估</span>
                <Form.List name="evaluations">
                  {(fields, { add, remove }) => (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 40px', gap: 8, marginBottom: 8 }}>
                        <div style={{ fontSize: 12, color: '#999' }}>评估时间</div><div style={{ fontSize: 12, color: '#999' }}>评估结果</div><div style={{ fontSize: 12, color: '#999' }}>靶病灶评估</div><div />
                      </div>
                      {fields.map(({ key, name }) => (
                        <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 40px', gap: 8, marginBottom: 8 }}>
                          <Form.Item name={[name, 'date']} noStyle><DatePicker placeholder="请选择" style={{ width: '100%' }} /></Form.Item>
                          <Form.Item name={[name, 'result']} noStyle><Input placeholder="请选择" /></Form.Item>
                          <Form.Item name={[name, 'target']} noStyle><Input placeholder="请输入" /></Form.Item>
                          <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                        </div>
                      ))}
                      <Button type="link" icon={<PlusSquareOutlined />} onClick={() => add()} size="small">添加评估</Button>
                    </>
                  )}
                </Form.List>
              </div>
              <div className="drawer-form-section">
                <span className="section-label">是否完成计划疗程</span>
                <Form.Item name="completedPlan">
                  <Radio.Group>
                    <Radio value="是">是</Radio>
                    <Radio value="否">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>

              {editCompletedPlan === '否' && (
                <div className="drawer-form-section">
                  <span className="section-label">原因</span>
                  <Form.Item name="incompletionReason">
                    <Checkbox.Group options={['TTP', 'TTF', '其他']} />
                  </Form.Item>
                </div>
              )}

              <div style={{ display: 'flex', gap: 24 }}>
                <div className="drawer-form-section" style={{ flex: 1 }}>
                  <span className="section-label">身高（CM）</span>
                  <Form.Item name="height">
                    <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </div>
                <div className="drawer-form-section" style={{ flex: 1 }}>
                  <span className="section-label">体重（KG）</span>
                  <Form.Item name="weight">
                    <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </div>
              </div>

              <div className="drawer-form-section">
                <span className="section-label">PS（分）</span>
                <Form.Item name="psScore">
                  <Radio.Group>
                    <Radio value={0}>0</Radio>
                    <Radio value={1}>1</Radio>
                    <Radio value={2}>2</Radio>
                    <Radio value={3}>3</Radio>
                    <Radio value={4}>4</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Form>
          </>
        )
      }
      case 'surgery':
        return (
          <Form form={editForm} layout="vertical">
            <div className="drawer-form-section"><span className="section-label">手术日期</span><Form.Item name="surgeryDate"><DatePicker placeholder="请选择" style={{ width: 240 }} /></Form.Item></div>
            <div className="drawer-form-section"><span className="section-label">手术类型</span><Form.Item name="surgeryType"><Checkbox.Group><Checkbox value="根治性手术">根治性手术</Checkbox><Checkbox value="姑息性手术">姑息性手术</Checkbox><Checkbox value="其他辅助手术">其他辅助手术</Checkbox></Checkbox.Group></Form.Item></div>
            <div className="drawer-form-section"><span className="section-label">手术方式</span><Form.Item name="surgeryMethod"><Checkbox.Group style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 0' }}><Checkbox value="保乳手术">保乳手术</Checkbox><Checkbox value="乳房改良根治术">乳房改良根治术</Checkbox><Checkbox value="乳房根治术">乳房根治术</Checkbox><Checkbox value="乳房扩大根治术">乳房扩大根治术</Checkbox><Checkbox value="腋窝淋巴结清扫">腋窝淋巴结清扫</Checkbox><Checkbox value="前哨淋巴结活检">前哨淋巴结活检</Checkbox><Checkbox value="乳房重建">乳房重建</Checkbox><Checkbox value="卵巢切除">卵巢切除</Checkbox><Checkbox value="局部病灶姑息性手术">局部病灶姑息性手术</Checkbox><Checkbox value="其他">其他</Checkbox></Checkbox.Group></Form.Item></div>
            <div className="drawer-form-section"><span className="section-label">切口类型</span><Form.Item name="incisionType"><Checkbox.Group><Checkbox value="横梭形">横梭形</Checkbox><Checkbox value="纵梭形">纵梭形</Checkbox><Checkbox value="斜梭形">斜梭形</Checkbox><Checkbox value="弧形">弧形</Checkbox><Checkbox value="其他">其他</Checkbox></Checkbox.Group></Form.Item></div>
            <div className="drawer-form-section"><span className="section-label">淋巴结清扫范围</span><Form.Item name="lymphScope"><Checkbox.Group><Checkbox value="I组">I组</Checkbox><Checkbox value="II组">II组</Checkbox><Checkbox value="III组">III组</Checkbox><Checkbox value="内乳淋巴结">内乳淋巴结</Checkbox><Checkbox value="其他">其他</Checkbox></Checkbox.Group></Form.Item></div>
          </Form>
        )
      case 'radiation':
        return (
          <Form form={editForm} layout="vertical">
            <div className="drawer-form-section"><span className="section-label">放疗起始日期</span><Form.Item name="startDate"><DatePicker placeholder="请选择" style={{ width: 240 }} /></Form.Item></div>
            <div className="drawer-form-section"><span className="section-label">放疗结束日期</span><Form.Item name="endDate"><DatePicker placeholder="请选择" style={{ width: 240 }} /></Form.Item></div>
            <div className="drawer-form-section"><span className="section-label">部位</span><Form.Item name="site"><Input placeholder="请输入" style={{ width: 240 }} /></Form.Item></div>
            <div className="drawer-form-section"><span className="section-label">剂量</span><Form.Item name="dose"><Input placeholder="请输入" style={{ width: 240 }} /></Form.Item></div>
            <div className="drawer-form-section"><span className="section-label">次数</span><Form.Item name="count"><Input placeholder="请输入" style={{ width: 240 }} type="number" /></Form.Item></div>
          </Form>
        )
      case 'recurrence':
        return (
          <Form form={editForm} layout="vertical">
            <div className="drawer-form-section"><span className="section-label">复发/转移日期</span><Form.Item name="date"><DatePicker placeholder="请选择" style={{ width: 240 }} /></Form.Item></div>
            <div className="drawer-form-section"><span className="section-label">转移部位</span><Form.Item name="site"><Input placeholder="请输入转移部位" /></Form.Item></div>
          </Form>
        )
      default:
        return null
    }
  }

  return (
    <div className="patient-detail-page">
      <div className="detail-breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('/patients')}>患者列表</span>
        <span className="breadcrumb-sep">&gt;</span>
        <span className="breadcrumb-current">患者详情</span>
      </div>

      <div className="detail-layout">
        {/* Left Panel */}
        <div className="detail-left">
          <div className="patient-name-row">
            <span className="patient-name">{patientInfo.name}</span>
          </div>

          <Button block icon={<EditOutlined />} className="edit-btn">
            编辑
          </Button>

          <div className="medical-images-entry" onClick={() => setImageModalOpen(true)}>
            <div className="images-icon"><PictureOutlined style={{ fontSize: 20, color: '#ccc' }} /></div>
            <div className="images-info">
              <span className="images-count">9</span>
              <span className="images-label">病历图片</span>
            </div>
            <RightOutlined style={{ color: '#ccc', fontSize: 12 }} />
          </div>

          <div className="patient-info-list">
            <div className="info-row"><span className="info-label">性别：</span><span className="info-value">{patientInfo.gender}</span></div>
            <div className="info-row"><span className="info-label">出生年月：</span><span className="info-value">{patientInfo.birthDate}</span></div>
            {patientInfo.gender === '女' && (
              <div className="info-row"><span className="info-label">月经状态：</span><span className="info-value">{patientInfo.menstrualStatus}</span></div>
            )}
            {patientInfo.menstrualStatus === '已绝经' && patientInfo.menopauseDate && (
              <div className="info-row"><span className="info-label">绝经日期：</span><span className="info-value">{patientInfo.menopauseDate}</span></div>
            )}
            <div className="info-row"><span className="info-label">PS评分：</span><span className="info-value">{patientInfo.psScore} 分</span></div>
            <div className="info-row"><span className="info-label">身高：</span><span className="info-value">{patientInfo.height} CM</span></div>
            <div className="info-row"><span className="info-label">体重：</span><span className="info-value">{patientInfo.weight} KG</span></div>
          </div>

          <div className="patient-info-list">
            <div className="info-row"><span className="info-label">个人肿瘤史：</span><span className="info-value">{patientInfo.personalTumorHistory}</span></div>
            <div className="info-row"><span className="info-label">家族肿瘤史：</span><span className="info-value">{patientInfo.familyTumorHistory}</span></div>
            <div className="info-row"><span className="info-label">BRCA1：</span><span className="info-value">{patientInfo.brca1}</span></div>
            <div className="info-row"><span className="info-label">BRCA2：</span><span className="info-value">{patientInfo.brca2}</span></div>
          </div>

          <div className="patient-timestamps">
            <div className="info-row"><span className="info-label">病历更新：</span><span className="info-value">{patientInfo.updatedAt}</span></div>
            <div className="info-row"><span className="info-label">病历创建：</span><span className="info-value">{patientInfo.createdAt}</span></div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="detail-right">
          <Section title="初诊病情" buttonText="初诊病情" onAdd={() => setDiagnosisOpen(true)} onClickBody={() => setPreviewSection('diagnosis')}>
            <div className="diagnosis-grid">
              <div className="diag-row"><span className="diag-label">日期：</span><span>{diagnosisData.date}</span></div>
              <div className="diag-row"><span className="diag-label">临床分期：</span><span>{diagnosisData.tStage} {diagnosisData.nStage} {diagnosisData.mStage}</span></div>
              <div className="diag-row"><span className="diag-label">原发灶部位：</span><span>{enumLabels.primaryLocation[diagnosisData.primaryLocation]}</span></div>
              <div className="diag-row"><span className="diag-label">肿块大小：</span><span>{diagnosisData.cancersizeLong} × {diagnosisData.cancersizeShort} cm</span></div>
              <div className="diag-row"><span className="diag-label">组织学类型：</span><span>{enumLabels.histologytype[diagnosisData.histologytype]}</span></div>
              <div className="diag-row"><span className="diag-label">组织学分级：</span><span>{enumLabels.g[diagnosisData.g]}</span></div>
              <div className="diag-row"><span className="diag-label">HER-2：</span><span>{enumLabels.mammaryHer2[diagnosisData.mammaryHer2]}</span></div>
              <div className="diag-row"><span className="diag-label">ER：</span><span>{enumLabels.mammaryER[diagnosisData.mammaryER]}（{diagnosisData.er}%）</span></div>
              <div className="diag-row"><span className="diag-label">PR：</span><span>{enumLabels.mammaryPR[diagnosisData.mammaryPR]}（{diagnosisData.pr}%）</span></div>
              <div className="diag-row"><span className="diag-label">Ki-67：</span><span>{diagnosisData.ki67}%</span></div>
            </div>
          </Section>

          <Section
            title="新辅助治疗"
            buttonText="新辅助治疗"
            onAdd={() => openTreatment('neoadjuvant')}
            onClickBody={() => setPreviewSection('neoadjuvant')}
            tag={<Tag color="blue" style={{ marginLeft: 8 }}>有更新</Tag>}
          >
            {neoadjuvantData.courses.map((course, idx) => (
              <div key={idx} className="treatment-course">
                <div className="course-header">
                  <span className="course-name">{course.name}</span>
                  <Space>
                    <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={e => e.stopPropagation()} /></Tooltip>
                  </Space>
                </div>
                <div className="course-meta">
                  <span>治疗方案：{course.plan}</span>
                  <span>治疗方式：{course.method}</span>
                  <span>用药方式：{course.drugMethod}</span>
                </div>
                <Table columns={treatmentColumns} dataSource={course.drugs} pagination={false} size="small" bordered className="compact-table" />
                <div className="sub-title">疗效评估</div>
                <Table columns={evaluationColumns} dataSource={course.evaluations} pagination={false} size="small" bordered className="compact-table" />
                <div className="ae-info">
                  <span>有无III度及以上AE事件：{course.hasAE}</span>
                </div>
                <Table
                  columns={[
                    { title: '事件类型', dataIndex: 'type', key: 'type', width: 90 },
                    { title: '类别', dataIndex: 'category', key: 'category' },
                    { title: '发生日期', dataIndex: 'date', key: 'date', width: 110 },
                    { title: '级别', dataIndex: 'level', key: 'level', width: 70 },
                    { title: '转归日期', dataIndex: 'returnDate', key: 'returnDate', width: 110 },
                    { title: '合并用药', dataIndex: 'drug', key: 'drug' },
                  ]}
                  dataSource={course.aeEvents}
                  pagination={false}
                  size="small"
                  bordered
                  className="compact-table"
                />
              </div>
            ))}
          </Section>

          <Section title="手术记录" buttonText="手术记录" onAdd={() => setSurgeryOpen(true)} onClickBody={() => setPreviewSection('surgery')}>
            {surgeryRecords.map((record, idx) => (
              <div key={idx} className="surgery-record">
                <div className="record-date-row">
                  <span className="record-date">{record.date}</span>
                  <Space>
                    <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={e => e.stopPropagation()} /></Tooltip>
                  </Space>
                </div>
                <div className="diagnosis-grid" style={{ marginTop: 8 }}>
                  <div className="diag-row"><span className="diag-label">手术方案：</span><span>{record.plan}</span></div>
                  <div className="diag-row"><span className="diag-label">手术类型：</span><span>{record.type}</span></div>
                  <div className="diag-row"><span className="diag-label">病理分期：</span><span>{record.stage}</span></div>
                  <div className="diag-row"><span className="diag-label">切缘：</span><span>{record.incision}</span></div>
                  <div className="diag-row"><span className="diag-label">血管浸润：</span><span>{record.bloodVessel}</span></div>
                  <div className="diag-row"><span className="diag-label">淋巴转移：</span><span>{record.lymphNode}</span></div>
                  <div className="diag-row"><span className="diag-label">前哨淋巴：</span><span>{record.sentinelNode}</span></div>
                  <div className="diag-row"><span className="diag-label">部位：</span><span>{record.location}</span></div>
                  <div className="diag-row"><span className="diag-label">组织类型：</span><span>{record.tissueType}</span></div>
                  <div className="diag-row"><span className="diag-label">分化等级：</span><span>{record.grade}</span></div>
                  <div className="diag-row"><span className="diag-label">ER：</span><span>{record.er}</span></div>
                  <div className="diag-row"><span className="diag-label">ER(%)：</span><span>{record.erPercent}</span></div>
                  <div className="diag-row"><span className="diag-label">PR：</span><span>{record.pr}</span></div>
                  <div className="diag-row"><span className="diag-label">PR(%)：</span><span>{record.prPercent}</span></div>
                  <div className="diag-row"><span className="diag-label">HER-2：</span><span>{record.her2}</span></div>
                  <div className="diag-row"><span className="diag-label">HER-FISH：</span><span>{record.herFish}</span></div>
                  <div className="diag-row"><span className="diag-label">Ki-67(%)：</span><span>{record.ki67}</span></div>
                </div>
              </div>
            ))}
          </Section>

          <Section title="辅助治疗" buttonText="辅助治疗" onAdd={() => openTreatment('adjuvant')} onClickBody={() => setPreviewSection('adjuvant')}>
            {neoadjuvantData.courses.map((course, idx) => (
              <div key={idx} className="treatment-course">
                <div className="course-header">
                  <span className="course-name">辅助治疗{idx + 1}</span>
                  <Space>
                    <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={e => e.stopPropagation()} /></Tooltip>
                  </Space>
                </div>
                <div className="course-meta">
                  <span>治疗方案：{course.plan}</span>
                  <span>治疗方式：{course.method}</span>
                  <span>用药方式：{course.drugMethod}</span>
                </div>
                <Table columns={treatmentColumns} dataSource={course.drugs} pagination={false} size="small" bordered className="compact-table" />
              </div>
            ))}
          </Section>

          <Section title="放疗记录" buttonText="放疗记录" onAdd={() => setRadiationOpen(true)} onClickBody={() => setPreviewSection('radiation')}>
            <div className="radiation-record">
              <div className="record-date-row">
                <span className="record-date">2019-06-12 ~ 2019-06-14</span>
                <Space>
                  <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={e => e.stopPropagation()} /></Tooltip>
                </Space>
              </div>
              <div className="course-meta" style={{ marginTop: 8 }}>
                <span>部位：左乳</span>
                <span>剂量：xxx</span>
                <span>次数：5</span>
              </div>
            </div>
          </Section>

          <Section title="复发转移记录" buttonText="复发转移记录" onAdd={() => setRecurrenceOpen(true)} onClickBody={() => setPreviewSection('recurrence')}>
            <div className="radiation-record">
              <div className="record-date-row">
                <span className="record-date">2019-06-12</span>
                <Space>
                  <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={e => e.stopPropagation()} /></Tooltip>
                </Space>
              </div>
              <div className="course-meta" style={{ marginTop: 8 }}>
                <span>转移部位：胸部</span>
              </div>
            </div>
          </Section>

          <Section title="解救治疗" buttonText="解救治疗" onAdd={() => openTreatment('salvage')} onClickBody={() => setPreviewSection('salvage')}>
            {neoadjuvantData.courses.map((course, idx) => (
              <div key={idx} className="treatment-course">
                <div className="course-header">
                  <span className="course-name">解救治疗{idx + 1}</span>
                  <Space>
                    <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={e => e.stopPropagation()} /></Tooltip>
                  </Space>
                </div>
                <div className="course-meta">
                  <span>治疗方案：{course.plan}</span>
                  <span>治疗方式：{course.method}</span>
                  <span>用药方式：静脉输注</span>
                </div>
                <Table columns={treatmentColumns} dataSource={course.drugs} pagination={false} size="small" bordered className="compact-table" />
                <div className="sub-title">疗效评估</div>
                <Table columns={evaluationColumns} dataSource={course.evaluations} pagination={false} size="small" bordered className="compact-table" />
                <div className="ae-info"><span>有无III度及以上AE事件：{course.hasAE}</span></div>
                <div className="ae-info"><span>III度及以上AE事件：血液毒性、肠胃毒性</span></div>
                <Table
                  columns={[
                    { title: '事件类型', dataIndex: 'type', key: 'type', width: 90 },
                    { title: '类别', dataIndex: 'category', key: 'category' },
                    { title: '发生日期', dataIndex: 'date', key: 'date', width: 110 },
                    { title: '级别', dataIndex: 'level', key: 'level', width: 70 },
                    { title: '转归日期', dataIndex: 'returnDate', key: 'returnDate', width: 110 },
                    { title: '合并用药', dataIndex: 'drug', key: 'drug' },
                  ]}
                  dataSource={[
                    ...course.aeEvents,
                    { key: '2', type: '血液毒性', category: 'xxxxxx', date: '2019-07-02', level: 'N/度', returnDate: '2019-07-02', drug: '卡铂他滨' },
                    { key: '3', type: '肠胃毒性', category: 'xxxxxx', date: '2019-07-02', level: 'N/度', returnDate: '2019-07-02', drug: '卡铂他滨' },
                    { key: '4', type: '肠胃毒性', category: 'xxxxxx', date: '2019-07-02', level: 'N/度', returnDate: '2019-07-02', drug: '卡铂他滨' },
                  ]}
                  pagination={false}
                  size="small"
                  bordered
                  className="compact-table"
                />
              </div>
            ))}
          </Section>

          <Section title="基因" buttonText="基因" onAdd={() => message.info('上传基因文件')} onClickBody={() => setPreviewSection('gene')}>
            <Table
              columns={[
                { title: '序号', dataIndex: 'seq', key: 'seq', width: 60 },
                { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime', width: 120, render: (t: string) => <span style={{ whiteSpace: 'pre-line' }}>{t}</span> },
                { title: '名称', dataIndex: 'name', key: 'name' },
                {
                  title: '操作',
                  key: 'action',
                  width: 200,
                  render: () => (
                    <Space>
                      <Button type="link" size="small" icon={<DownloadOutlined />}>下载归档</Button>
                      <Button type="link" size="small" icon={<DownloadOutlined />}>下载/查看</Button>
                    </Space>
                  ),
                },
              ]}
              dataSource={geneData}
              pagination={false}
              size="small"
              bordered
              className="compact-table"
            />
          </Section>
        </div>
      </div>

      {/* Edit Drawers */}
      <DiagnosisFormDrawer open={diagnosisOpen} onClose={() => setDiagnosisOpen(false)} />
      <TreatmentFormDrawer open={treatmentOpen} onClose={() => setTreatmentOpen(false)} type={treatmentType} />
      <SurgeryFormDrawer open={surgeryOpen} onClose={() => setSurgeryOpen(false)} />
      <RadiationFormDrawer open={radiationOpen} onClose={() => setRadiationOpen(false)} />
      <RecurrenceFormDrawer open={recurrenceOpen} onClose={() => setRecurrenceOpen(false)} />

      {/* Preview Drawer */}
      <Drawer
        title={previewSection ? previewTitleMap[previewSection] : ''}
        open={!!previewSection}
        onClose={handlePreviewClose}
        width={1280}
        styles={{ body: { padding: 0, display: 'flex', overflow: 'hidden' } }}
        footer={
          isEditing ? (
            <div style={{ textAlign: 'right' }}>
              <Button onClick={handleEditCancel} style={{ marginRight: 12 }}>取消</Button>
              <Button type="primary" onClick={handleEditSave} style={{ width: 120 }}>保存</Button>
            </div>
          ) : null
        }
      >
        <MedicalImagePanel sectionKey={previewSection} />
        <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
          {isEditing ? (
            <>
              <h3 className="preview-title">{previewSection ? previewTitleMap[previewSection] : ''}</h3>
              {renderSectionForm()}
            </>
          ) : (
            <>
              <div className="preview-title-row">
                <h3 className="preview-title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none', flex: 1 }}>
                  {previewSection ? previewTitleMap[previewSection] : ''}
                </h3>
                {previewSection && previewSection !== 'gene' && (
                  <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>编辑</Button>
                )}
              </div>
              <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 16 }} />
              {renderSectionPreview(previewSection)}
            </>
          )}
        </div>
      </Drawer>

      {/* Medical Image Modal */}
      <MedicalImageModal open={imageModalOpen} onClose={() => setImageModalOpen(false)} />
    </div>
  )
}

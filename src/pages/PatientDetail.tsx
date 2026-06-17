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
  message,
} from 'antd'
import {
  EditOutlined,
  PlusSquareOutlined,
  RightOutlined,
  PictureOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import DiagnosisFormDrawer from '../components/DiagnosisFormDrawer'
import DiagnosisFormFields, { enumLabels, diagnosisValuesChangeHandler } from '../components/DiagnosisFormFields'
import TreatmentFormDrawer from '../components/TreatmentFormDrawer'
import NeoadjuvantFormFields, { neoadjuvantEnumLabels, neoadjuvantValuesChangeHandler } from '../components/NeoadjuvantFormFields'
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

function renderNeoadjuvantRecord(record: (typeof neoadjuvantData.records)[number], idx: number) {
  const typeLabel = neoadjuvantEnumLabels.treatType[record.treatType] || record.treatType
  const drugs = record.treatType === 'chemo'
    ? (record as { medicineList?: { medicineName: string; dose: number | null; unit: string }[] }).medicineList || []
    : record.treatType === 'target'
      ? (record as { targetMedicineList?: { medicineName: string; dose: number | null; unit: string }[] }).targetMedicineList || []
      : (record as { endoMedicineList?: { medicineName: string; dose: number | null; unit: string }[] }).endoMedicineList || []
  const planName = record.treatType === 'endo'
    ? neoadjuvantEnumLabels.endoTreatName[(record as { endoTreatName?: string }).endoTreatName || ''] || (record as { endoTreatName?: string }).endoTreatName
    : record.treatType === 'target'
      ? neoadjuvantEnumLabels.targetTreatmentName[(record as { treatmentName?: string }).treatmentName || ''] || (record as { treatmentName?: string }).treatmentName
      : neoadjuvantEnumLabels.chemoTreatmentName[(record as { treatmentName?: string }).treatmentName || ''] || (record as { treatmentName?: string }).treatmentName

  return (
    <div key={idx} style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{typeLabel} - {planName}</div>
      <div className="diagnosis-grid">
        <div className="diag-row"><span className="diag-label">开始时间：</span><span>{record.date}</span></div>
        <div className="diag-row"><span className="diag-label">结束时间：</span><span>{record.endDate}</span></div>
        {record.treatType === 'chemo' && (
          <div className="diag-row"><span className="diag-label">周期数：</span><span>{(record as { treatmentCount?: number }).treatmentCount}</span></div>
        )}
        <div className="diag-row">
          <span className="diag-label">药物：</span>
          <span>{drugs.map(d => `${d.medicineName}${d.dose ? ` ${d.dose}${d.unit}` : ''}`).join('、')}</span>
        </div>
        {record.treatType === 'chemo' && (record as { isUnionTarget?: number }).isUnionTarget === 1 && (
          <>
            <div className="diag-row"><span className="diag-label">联合靶向：</span><span>是</span></div>
            <div className="diag-row"><span className="diag-label">靶向时间：</span><span>{(record as { targetDate?: string }).targetDate} ~ {(record as { targetEndDate?: string }).targetEndDate}</span></div>
            <div className="diag-row">
              <span className="diag-label">靶向药物：</span>
              <span>{((record as { targetMedicineList?: { medicineName: string; dose: number | null; unit: string }[] }).targetMedicineList || []).map(d => d.medicineName).join('、')}</span>
            </div>
          </>
        )}
        {record.treatType === 'endo' && (
          <>
            <div className="diag-row"><span className="diag-label">卵巢抑制：</span><span>{neoadjuvantEnumLabels.ovaryControl[(record as { ovaryControl?: number }).ovaryControl ?? -1]}</span></div>
            {(record as { ovaryControl?: number }).ovaryControl === 1 && (
              <div className="diag-row"><span className="diag-label">抑制方式：</span><span>{(record as { ovaryControlMode?: string }).ovaryControlMode}</span></div>
            )}
          </>
        )}
        <div className="diag-row"><span className="diag-label">最佳疗效：</span><span>{neoadjuvantEnumLabels.progressresult[record.progressresult]}</span></div>
        <div className="diag-row"><span className="diag-label">完成疗程：</span><span>{neoadjuvantEnumLabels.isComplete[record.isComplete]}</span></div>
        {record.isComplete === 0 && record.incompleteReason != null && (
          <div className="diag-row">
            <span className="diag-label">未完成原因：</span>
            <span>{record.incompleteReason === 9999 ? record.resultOtherValue : neoadjuvantEnumLabels.incompleteReason[record.incompleteReason]}</span>
          </div>
        )}
        <div className="diag-row"><span className="diag-label">身高：</span><span>{record.height} CM</span></div>
        <div className="diag-row"><span className="diag-label">体重：</span><span>{record.weight} KG</span></div>
        <div className="diag-row"><span className="diag-label">PS评分：</span><span>{record.ps}</span></div>
      </div>
    </div>
  )
}

const neoadjuvantData = {
  records: [
    {
      treatType: 'chemo' as string,
      date: '2003-01-03',
      endDate: '2003-05-24',
      treatmentName: 'AC_TH',
      otherTreatmentName: '',
      isUnionTarget: 1,
      treatmentCount: 6,
      medicineList: [
        { medicineName: '表柔比星', dose: 150, unit: 'mg' },
        { medicineName: '环磷酰胺', dose: 100, unit: 'mg' },
        { medicineName: '多西他赛', dose: 150, unit: 'mg' },
      ],
      targetDate: '2003-01-03',
      targetEndDate: '2003-05-24',
      targetMedicineList: [{ medicineName: '曲妥珠单抗', dose: null, unit: '' }],
      progressresult: 3,
      isComplete: 1,
      incompleteReason: null as number | null,
      resultOtherValue: '',
      height: 162,
      weight: 58,
      ps: 1,
    },
    {
      treatType: 'endo' as string,
      date: '2003-05-23',
      endDate: '2003-07-07',
      endoTreatName: 'AI',
      otherTreatmentName: '',
      endoMedicineList: [{ medicineName: '来曲唑', dose: null, unit: '' }],
      ovaryControl: 1,
      ovaryControlMode: '手术',
      progressresult: 3,
      isComplete: 0,
      incompleteReason: 2,
      resultOtherValue: '',
      height: 162,
      weight: 58,
      ps: 1,
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
      return (
        <div>
          {neoadjuvantData.records.map((record, idx) => renderNeoadjuvantRecord(record, idx))}
        </div>
      )
    case 'adjuvant':
    case 'salvage':
      return (
        <div>
          <Empty description="暂无记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )
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

  const openTreatment = (type: 'neoadjuvant' | 'adjuvant' | 'salvage') => {
    setTreatmentType(type)
    setTreatmentOpen(true)
  }

  const handlePreviewClose = () => {
    setPreviewSection(null)
    setIsEditing(false)
    editForm.resetFields()
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    editForm.resetFields()
  }

  const handleEditSave = () => {
    message.success('保存成功')
    setIsEditing(false)
    editForm.resetFields()
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
        return (
          <Form form={editForm} layout="vertical" onValuesChange={(changed) => neoadjuvantValuesChangeHandler(editForm, changed)}>
            <NeoadjuvantFormFields form={editForm} />
          </Form>
        )
      case 'adjuvant':
      case 'salvage':
        return (
          <Form form={editForm} layout="vertical">
            <Empty description="暂无编辑表单" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Form>
        )
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
            {neoadjuvantData.records.map((record, idx) => (
              <div key={idx} className="treatment-course">
                <div className="course-header">
                  <span className="course-name">{neoadjuvantEnumLabels.treatType[record.treatType]}</span>
                  <Space>
                    <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={e => e.stopPropagation()} /></Tooltip>
                  </Space>
                </div>
                <div className="course-meta">
                  <span>时间：{record.date} ~ {record.endDate}</span>
                  <span>疗效：{neoadjuvantEnumLabels.progressresult[record.progressresult]}</span>
                  <span>完成疗程：{neoadjuvantEnumLabels.isComplete[record.isComplete]}</span>
                </div>
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

          <Section title="辅助治疗" buttonText="辅助治疗" onAdd={() => openTreatment('adjuvant')} onClickBody={() => setPreviewSection('adjuvant')} hasData={false}>
            <Empty description="暂无记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
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

          <Section title="解救治疗" buttonText="解救治疗" onAdd={() => openTreatment('salvage')} onClickBody={() => setPreviewSection('salvage')} hasData={false}>
            <Empty description="暂无记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
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

import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Table,
  Tag,
  Space,
  Select,
  Input,
  Tooltip,
} from 'antd'
import type { TableProps } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import AddPatientModal from '../components/AddPatientModal'
import './PatientList.css'

interface Patient {
  key: string
  uid: string
  name: string
  gender: string
  birthDate: string
  her2Status: string
  hrStatus: string
  metastasis: string
  modifiedDate: string
  stage: string
}

const initialData: Patient[] = [
  { key: '1', uid: 'PA01', name: '张某某', gender: '女', birthDate: '1976-08', her2Status: '阳性', hrStatus: '阴性', metastasis: '已转移', modifiedDate: '2026-06-10', stage: '晚期' },
  { key: '2', uid: 'PA02', name: '李某某', gender: '女', birthDate: '1980-04', her2Status: '阴性', hrStatus: '阳性', metastasis: '未转移', modifiedDate: '2026-06-09', stage: '早期' },
  { key: '3', uid: 'PA03', name: '王某某', gender: '女', birthDate: '1985-11', her2Status: '0', hrStatus: '阴性', metastasis: '未知', modifiedDate: '2026-06-08', stage: '早期' },
  { key: '4', uid: 'PA04', name: '赵某某', gender: '女', birthDate: '1972-02', her2Status: '阳性', hrStatus: '阴性', metastasis: '未转移', modifiedDate: '2026-06-07', stage: '早期' },
  { key: '5', uid: 'PA05', name: '刘某某', gender: '女', birthDate: '1968-09', her2Status: '临床送检', hrStatus: '阴性', metastasis: '已转移', modifiedDate: '2026-06-06', stage: '早期' },
  { key: '6', uid: 'PA06', name: '陈某某', gender: '女', birthDate: '1990-06', her2Status: '阴性', hrStatus: '阳性', metastasis: '未知', modifiedDate: '2026-06-05', stage: '中期' },
  { key: '7', uid: 'PA07', name: '孙某某', gender: '女', birthDate: '1958-12', her2Status: '阴性', hrStatus: '阴性', metastasis: '已转移', modifiedDate: '2026-06-04', stage: '晚期' },
  { key: '8', uid: 'PA08', name: '周某某', gender: '女', birthDate: '1970-03', her2Status: '阴性', hrStatus: '阳性', metastasis: '已治疗', modifiedDate: '2026-06-03', stage: '早期' },
  { key: '9', uid: 'PA09', name: '吴某某', gender: '女', birthDate: '1963-07', her2Status: '0', hrStatus: '阴性', metastasis: '已转移', modifiedDate: '2026-06-02', stage: '中期' },
  { key: '10', uid: 'PA10', name: '郑某某', gender: '男', birthDate: '1975-01', her2Status: '阳性', hrStatus: '阳性', metastasis: '未转移', modifiedDate: '2026-06-01', stage: '早期' },
  { key: '11', uid: 'PA11', name: '冯某某', gender: '女', birthDate: '1982-05', her2Status: '阴性', hrStatus: '阴性', metastasis: '未知', modifiedDate: '2026-05-30', stage: '早期' },
  { key: '12', uid: 'PA12', name: '何某某', gender: '女', birthDate: '1991-09', her2Status: '阳性', hrStatus: '阳性', metastasis: '未转移', modifiedDate: '2026-05-29', stage: '中期' },
  { key: '13', uid: 'PA13', name: '许某某', gender: '女', birthDate: '1965-11', her2Status: '0', hrStatus: '阴性', metastasis: '已转移', modifiedDate: '2026-05-28', stage: '晚期' },
  { key: '14', uid: 'PA14', name: '朱某某', gender: '女', birthDate: '1978-03', her2Status: '阴性', hrStatus: '阳性', metastasis: '已治疗', modifiedDate: '2026-05-27', stage: '早期' },
  { key: '15', uid: 'PA15', name: '杨某某', gender: '男', birthDate: '1988-07', her2Status: '阳性', hrStatus: '阴性', metastasis: '未转移', modifiedDate: '2026-05-26', stage: '早期' },
]

const her2Options = ['全部', '阳性', '阴性', '0', '临床送检']
const hrOptions = ['全部', '阳性', '阴性']
const metastasisOptions = ['全部', '已转移', '未转移', '已治疗', '未知']
const genderOptions = ['全部', '男', '女']

const statusColorMap: Record<string, string> = {
  '阳性': 'blue',
  '阴性': 'default',
  '0': 'default',
  '临床送检': 'orange',
  '已转移': 'red',
  '未转移': 'green',
  '已治疗': 'cyan',
  '未知': 'default',
  '早期': 'green',
  '中期': 'orange',
  '晚期': 'red',
}

export default function PatientList() {
  const navigate = useNavigate()
  const [data, setData] = useState<Patient[]>(initialData)
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    gender: '全部',
    her2: '全部',
    hr: '全部',
    metastasis: '全部',
  })

  const filteredData = useMemo(() => {
    return data.filter(p => {
      if (search && !p.uid.toLowerCase().includes(search.toLowerCase()) && !p.name.includes(search)) return false
      if (filters.gender !== '全部' && p.gender !== filters.gender) return false
      if (filters.her2 !== '全部' && p.her2Status !== filters.her2) return false
      if (filters.hr !== '全部' && p.hrStatus !== filters.hr) return false
      if (filters.metastasis !== '全部' && p.metastasis !== filters.metastasis) return false
      return true
    })
  }, [data, search, filters])

  const handleReset = useCallback(() => {
    setSearch('')
    setFilters({ gender: '全部', her2: '全部', hr: '全部', metastasis: '全部' })
  }, [])

  const handleAddSuccess = useCallback((values: Record<string, unknown>) => {
    const newId = data.length + 1
    const newPatient: Patient = {
      key: String(newId),
      uid: `PA${String(newId).padStart(2, '0')}`,
      name: values.name as string,
      gender: values.gender as string,
      birthDate: (values.birthDate as dayjs.Dayjs)?.format('YYYY-MM') || '',
      her2Status: '未知',
      hrStatus: '未知',
      metastasis: '未知',
      modifiedDate: dayjs().format('YYYY-MM-DD'),
      stage: '未知',
    }
    setData(prev => [newPatient, ...prev])
    setModalOpen(false)
  }, [data.length])

  const columns: TableProps<Patient>['columns'] = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      width: 100,
      fixed: 'left',
      render: (uid: string, record) => (
        <span style={{ fontWeight: 500, color: '#1677ff', cursor: 'pointer' }} onClick={() => navigate(`/patients/${record.uid}`)}>
          {uid}
          {record.key === '1' && (
            <Tag color="blue" style={{ marginLeft: 6, fontSize: 11 }}>最近更新</Tag>
          )}
        </span>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 70,
    },
    {
      title: '出生日期',
      dataIndex: 'birthDate',
      key: 'birthDate',
      width: 110,
    },
    {
      title: 'HER2 状态',
      dataIndex: 'her2Status',
      key: 'her2Status',
      width: 110,
      render: (v: string) => <Tag color={statusColorMap[v] || 'default'}>{v}</Tag>,
    },
    {
      title: 'HR 状态',
      dataIndex: 'hrStatus',
      key: 'hrStatus',
      width: 100,
      render: (v: string) => <Tag color={statusColorMap[v] || 'default'}>{v}</Tag>,
    },
    {
      title: '是否转移',
      dataIndex: 'metastasis',
      key: 'metastasis',
      width: 100,
      render: (v: string) => <Tag color={statusColorMap[v] || 'default'}>{v}</Tag>,
    },
    {
      title: '修改日期',
      dataIndex: 'modifiedDate',
      key: 'modifiedDate',
      width: 120,
      sorter: (a, b) => a.modifiedDate.localeCompare(b.modifiedDate),
      defaultSortOrder: 'descend',
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: () => (
        <Space size={4}>
          <Tooltip title="编辑">
            <Button type="text" size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="删除">
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div className="patient-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link">科研管理</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">患者列表</span>
          </div>
          <h2 className="page-title">科研管理 · 患者列表</h2>
        </div>
        <div className="page-header-right">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            size="large"
          >
            新增患者
          </Button>
          <span className="patient-count">共 {filteredData.length} 位患者</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-row">
          <span className="filter-label">筛选条件</span>
          <Input
            placeholder="搜索 UID 或姓名"
            prefix={<SearchOutlined style={{ color: '#bbb' }} />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            value={filters.gender}
            onChange={v => setFilters(f => ({ ...f, gender: v }))}
            style={{ width: 100 }}
            options={genderOptions.map(o => ({ label: o === '全部' ? '性别' : o, value: o }))}
          />
          <Select
            value={filters.her2}
            onChange={v => setFilters(f => ({ ...f, her2: v }))}
            style={{ width: 120 }}
            options={her2Options.map(o => ({ label: o === '全部' ? 'HER2 状态' : o, value: o }))}
          />
          <Select
            value={filters.hr}
            onChange={v => setFilters(f => ({ ...f, hr: v }))}
            style={{ width: 120 }}
            options={hrOptions.map(o => ({ label: o === '全部' ? 'HR 状态' : o, value: o }))}
          />
          <Select
            value={filters.metastasis}
            onChange={v => setFilters(f => ({ ...f, metastasis: v }))}
            style={{ width: 120 }}
            options={metastasisOptions.map(o => ({ label: o === '全部' ? '是否转移' : o, value: o }))}
          />
        </div>
        <div className="filter-actions">
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置筛选
          </Button>
          <Button icon={<DownloadOutlined />}>
            导出 CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="patient-table-card">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showTotal: total => `共 ${total} 条记录`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 900 }}
          size="middle"
        />
      </div>

      <AddPatientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}

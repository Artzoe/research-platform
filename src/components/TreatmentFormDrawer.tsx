import { Drawer, Form, Input, Checkbox, DatePicker, Button, Tabs, Space, message } from 'antd'
import { PlusOutlined, MinusCircleOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { useState } from 'react'
import MedicalImagePanel from './MedicalImagePanel'

const titleMap = {
  neoadjuvant: '新辅助治疗',
  adjuvant: '辅助治疗',
  salvage: '解救治疗',
}

const methodOptions: Record<string, string[]> = {
  neoadjuvant: ['化疗', '靶向', '免疫治疗', '放疗', '内分泌治疗'],
  adjuvant: ['化疗', '靶向', '免疫治疗', '放疗', '内分泌治疗'],
  salvage: ['化疗', '靶向', '免疫治疗', '放疗', '内分泌治疗'],
}

interface Props {
  open: boolean
  onClose: () => void
  type: 'neoadjuvant' | 'adjuvant' | 'salvage'
}

export default function TreatmentFormDrawer({ open, onClose, type }: Props) {
  const [form] = Form.useForm()
  const [tabs, setTabs] = useState(['1'])
  const [activeTab, setActiveTab] = useState('1')
  const title = titleMap[type]

  const addTab = () => {
    const next = String(tabs.length + 1)
    setTabs([...tabs, next])
    setActiveTab(next)
  }

  const removeTab = (key: string) => {
    const filtered = tabs.filter(t => t !== key)
    setTabs(filtered)
    if (activeTab === key) setActiveTab(filtered[0])
  }

  const handleSave = () => {
    message.success('保存成功')
    form.resetFields()
    setTabs(['1'])
    setActiveTab('1')
    onClose()
  }

  const handleClose = () => {
    form.resetFields()
    setTabs(['1'])
    setActiveTab('1')
    onClose()
  }

  return (
    <Drawer
      title={title}
      open={open}
      onClose={handleClose}
      width={1080}
      styles={{ body: { padding: 0, display: 'flex', overflow: 'hidden' } }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleClose} style={{ marginRight: 12 }}>取消</Button>
          <Button type="primary" onClick={handleSave} style={{ width: 120 }}>保存</Button>
        </div>
      }
    >
      <MedicalImagePanel />
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="editable-card"
        onEdit={(key, action) => {
          if (action === 'add') addTab()
          else removeTab(key as string)
        }}
        items={tabs.map(t => ({
          key: t,
          label: `${title}${t}`,
          closable: tabs.length > 1,
        }))}
        tabBarExtraContent={
          <Button type="text" icon={<PlusOutlined />} onClick={addTab} size="small" />
        }
      />

      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <div className="drawer-form-section">
          <span className="section-label">治疗方案</span>
          <Form.Item name="plan">
            <Input placeholder="请输入" />
          </Form.Item>
        </div>

        <div className="drawer-form-section">
          <span className="section-label">治疗方式</span>
          <Form.Item name="method">
            <Checkbox.Group options={methodOptions[type]} />
          </Form.Item>
        </div>

        <div className="drawer-form-section">
          <span className="section-label">用药方式</span>
          <Form.Item name="drugMethod">
            <Checkbox.Group options={['静脉输注', '口服', '组合']} />
          </Form.Item>
        </div>

        {/* Drug Sessions */}
        <Form.List name="sessions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <div key={key} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ background: '#fafafa', padding: '4px 12px', borderRadius: 4, fontSize: 13 }}>
                      第{name + 1}次输注
                    </div>
                    <Form.Item name={[name, 'date']} noStyle>
                      <DatePicker placeholder="请选择" style={{ flex: 1 }} />
                    </Form.Item>
                    <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                  </div>
                  <Form.List name={[name, 'drugs']}>
                    {(drugFields, drugOps) => (
                      <>
                        {drugFields.map(({ key: dk, name: dn }) => (
                          <div key={dk} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                            <span style={{ color: '#ccc', fontSize: 18 }}>•</span>
                            <div style={{ background: '#fafafa', padding: '4px 8px', borderRadius: 4, fontSize: 13, flexShrink: 0 }}>药物{dn + 1}</div>
                            <Form.Item name={[dn, 'name']} noStyle>
                              <Input placeholder="请输入" />
                            </Form.Item>
                            <div style={{ background: '#fafafa', padding: '4px 8px', borderRadius: 4, fontSize: 13, flexShrink: 0 }}>剂量</div>
                            <Form.Item name={[dn, 'dose']} noStyle>
                              <Input placeholder="请输入" style={{ width: 100 }} />
                            </Form.Item>
                            <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => drugOps.remove(dn)} />
                          </div>
                        ))}
                        <Button type="link" icon={<PlusSquareOutlined />} onClick={() => drugOps.add()} size="small">
                          添加药物
                        </Button>
                      </>
                    )}
                  </Form.List>
                </div>
              ))}
              <Button type="link" icon={<PlusSquareOutlined />} onClick={() => add({ drugs: [{}] })} block style={{ marginBottom: 24 }}>
                添加输注时间
              </Button>
            </>
          )}
        </Form.List>

        {/* Efficacy Evaluation */}
        <div className="drawer-form-section">
          <span className="section-label">疗效评估</span>
          <Form.List name="evaluations">
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 40px', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: '#999' }}>评估时间</div>
                  <div style={{ fontSize: 12, color: '#999' }}>评估结果</div>
                  <div style={{ fontSize: 12, color: '#999' }}>靶病灶评估</div>
                  <div />
                </div>
                {fields.map(({ key, name }) => (
                  <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 40px', gap: 8, marginBottom: 8 }}>
                    <Form.Item name={[name, 'date']} noStyle>
                      <DatePicker placeholder="请选择" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name={[name, 'result']} noStyle>
                      <Input placeholder="请选择" />
                    </Form.Item>
                    <Form.Item name={[name, 'target']} noStyle>
                      <Input placeholder="请输入" />
                    </Form.Item>
                    <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                  </div>
                ))}
                <Button type="link" icon={<PlusSquareOutlined />} onClick={() => add()} size="small">添加评估</Button>
              </>
            )}
          </Form.List>
        </div>

        {/* AE Events */}
        <div className="drawer-form-section">
          <span className="section-label">有无III度及以上AE事件</span>
          <Form.Item name="hasAE">
            <Checkbox.Group options={['有', '无']} />
          </Form.Item>
        </div>

        <div className="drawer-form-section">
          <span className="section-label">III度及以上AE事件</span>
          <Form.Item name="aeTypes">
            <Checkbox.Group>
              <Checkbox value="血液毒性">血液毒性</Checkbox>
              <Checkbox value="肠胃毒性">肠胃毒性</Checkbox>
              <Checkbox value="item03">item03</Checkbox>
              <Checkbox value="item04">item04</Checkbox>
              <Checkbox value="item05">item05</Checkbox>
              <Checkbox value="item06">item06</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </div>

        <div className="drawer-form-section">
          <span className="section-label">血液毒性</span>
          <Form.List name="aeDetails">
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr 1fr 1.2fr 40px', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: '#999' }}>类别</div>
                  <div style={{ fontSize: 12, color: '#999' }}>发生日期</div>
                  <div style={{ fontSize: 12, color: '#999' }}>级别</div>
                  <div style={{ fontSize: 12, color: '#999' }}>转归日期</div>
                  <div style={{ fontSize: 12, color: '#999' }}>合并用药</div>
                  <div />
                </div>
                {fields.map(({ key, name }) => (
                  <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr 1fr 1.2fr 40px', gap: 8, marginBottom: 8 }}>
                    <Form.Item name={[name, 'category']} noStyle><Input placeholder="请输入" /></Form.Item>
                    <Form.Item name={[name, 'date']} noStyle><DatePicker placeholder="请选择" style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name={[name, 'level']} noStyle><Input placeholder="请选择" /></Form.Item>
                    <Form.Item name={[name, 'returnDate']} noStyle><DatePicker placeholder="请选择" style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name={[name, 'drug']} noStyle><Input placeholder="请输入" /></Form.Item>
                    <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                  </div>
                ))}
                <Button type="link" icon={<PlusSquareOutlined />} onClick={() => add()} size="small">添加记录</Button>
              </>
            )}
          </Form.List>
        </div>
      </Form>
      </div>
    </Drawer>
  )
}

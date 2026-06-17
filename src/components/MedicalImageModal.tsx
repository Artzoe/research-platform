import { useState } from 'react'
import { Modal, Tag, Tooltip, Radio } from 'antd'
import {
  PictureOutlined,
  FileTextOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import { allImagesSorted, groupByDate, getImageAssociations } from '../data/mockMedicalImages'
import './MedicalImageModal.css'

interface Props {
  open: boolean
  onClose: () => void
}

export default function MedicalImageModal({ open, onClose }: Props) {
  const [selectedId, setSelectedId] = useState(allImagesSorted[0]?.id || '')
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [viewMode, setViewMode] = useState<'image' | 'markdown'>('image')

  const selectedImage = allImagesSorted.find(img => img.id === selectedId)
  const groups = groupByDate(allImagesSorted)
  const associations = getImageAssociations()

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setRotation(0)
    setZoom(1)
  }

  const rotateLeft = () => setRotation(r => r - 90)
  const rotateRight = () => setRotation(r => r + 90)
  const zoomIn = () => setZoom(z => Math.min(z + 0.25, 3))
  const zoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5))
  const resetView = () => { setRotation(0); setZoom(1) }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="90vw"
      centered
      destroyOnClose
      className="medical-image-modal"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PictureOutlined />
          <span>全部病历图片</span>
          <span style={{ color: '#1677ff', fontWeight: 500, fontSize: 12, background: '#e6f4ff', borderRadius: 10, padding: '1px 8px', lineHeight: '20px' }}>{allImagesSorted.length}</span>
        </div>
      }
      styles={{ body: { padding: 0, height: '78vh', display: 'flex', overflow: 'hidden' } }}
    >
      {/* Thumbnail sidebar */}
      <div className="mim-sidebar">
        {groups.map(group => (
          <div key={group.date} className="mim-group">
            <div className="mim-group-date">{group.date}</div>
            <div className="mim-group-grid">
              {group.images.map(img => (
                <div
                  key={img.id}
                  className={`mim-thumb ${img.id === selectedId ? 'selected' : ''}`}
                  onClick={() => handleSelect(img.id)}
                >
                  <img src={img.url} alt="" />
                  {associations[img.id] && <Tag className="mim-thumb-tag" color="blue">关联资料</Tag>}
                  {img.id === selectedId && <div className="mim-thumb-check" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="mim-preview-area">
        {selectedImage && (
          <div className="mim-preview-time">
            <span>上传时间：{selectedImage.uploadTime}</span>
            <Radio.Group
              size="small"
              value={viewMode}
              onChange={e => setViewMode(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="image"><PictureOutlined style={{ marginRight: 4 }} />图片</Radio.Button>
              <Radio.Button value="markdown"><FileTextOutlined style={{ marginRight: 4 }} />Markdown</Radio.Button>
            </Radio.Group>
          </div>
        )}

        {viewMode === 'image' ? (
          <>
            <div className="mim-preview">
              {selectedImage ? (
                <img
                  src={selectedImage.url}
                  alt="病历图片预览"
                  className="mim-preview-img"
                  style={{ transform: `rotate(${rotation}deg) scale(${zoom})` }}
                  draggable={false}
                />
              ) : (
                <div className="mim-preview-empty">
                  <PictureOutlined style={{ fontSize: 48, color: '#555' }} />
                  <span>暂无图片</span>
                </div>
              )}
            </div>
            <div className="mim-toolbar">
              <div className="mim-toolbar-left">
                <Tooltip title="左旋 90°"><button className="mim-toolbar-btn" onClick={rotateLeft}><RotateLeftOutlined /></button></Tooltip>
                <Tooltip title="右旋 90°"><button className="mim-toolbar-btn" onClick={rotateRight}><RotateRightOutlined /></button></Tooltip>
                <div className="mim-toolbar-divider" />
                <Tooltip title="放大"><button className="mim-toolbar-btn" onClick={zoomIn} disabled={zoom >= 3}><ZoomInOutlined /></button></Tooltip>
                <span className="mim-toolbar-zoom">{Math.round(zoom * 100)}%</span>
                <Tooltip title="缩小"><button className="mim-toolbar-btn" onClick={zoomOut} disabled={zoom <= 0.5}><ZoomOutOutlined /></button></Tooltip>
                <div className="mim-toolbar-divider" />
                <Tooltip title="重置"><button className="mim-toolbar-btn" onClick={resetView}><UndoOutlined /></button></Tooltip>
              </div>
            </div>
          </>
        ) : (
          <div className="mim-markdown">
            {selectedImage ? (
              <div
                className="mim-markdown-content"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(selectedImage.markdown) }}
              />
            ) : (
              <div className="mim-preview-empty">
                <FileTextOutlined style={{ fontSize: 48, color: '#555' }} />
                <span>暂无识别内容</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

function markdownToHtml(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/^---$/gm, '<hr/>')
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
  html = html.replace(/&amp;emsp;/g, '&emsp;')

  html = html.replace(/((?:^\|.+\|$\n?)+)/gm, (block) => {
    const rows = block.trim().split('\n').filter(r => !r.match(/^\|\s*-/))
    if (rows.length === 0) return block
    const headerCells = rows[0].split('|').filter(c => c.trim())
    let table = '<table><thead><tr>' + headerCells.map(c => `<th>${c.trim()}</th>`).join('') + '</tr></thead><tbody>'
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].split('|').filter(c => c.trim())
      table += '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>'
    }
    table += '</tbody></table>'
    return table
  })

  html = html.replace(/\n{2,}/g, '</p><p>')
  html = '<p>' + html + '</p>'
  html = html.replace(/<p>\s*(<h[123]>)/g, '$1')
  html = html.replace(/(<\/h[123]>)\s*<\/p>/g, '$1')
  html = html.replace(/<p>\s*(<hr\/>)/g, '$1')
  html = html.replace(/(<hr\/>)\s*<\/p>/g, '$1')
  html = html.replace(/<p>\s*(<table>)/g, '$1')
  html = html.replace(/(<\/table>)\s*<\/p>/g, '$1')
  html = html.replace(/<p>\s*(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1')
  html = html.replace(/<p>\s*<\/p>/g, '')

  return html
}

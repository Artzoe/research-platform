import { useState } from 'react'
import { PictureOutlined, RotateLeftOutlined, RotateRightOutlined, ZoomInOutlined, ZoomOutOutlined, UndoOutlined, FileTextOutlined, LinkOutlined, DisconnectOutlined } from '@ant-design/icons'
import { Tag, Tooltip, Radio, Button, message } from 'antd'
import { allImagesSorted, groupByDate, getImageAssociations, associateImage, disassociateImage } from '../data/mockMedicalImages'
import type { SectionKey } from '../data/mockMedicalImages'
import './MedicalImagePanel.css'

interface Props {
  sectionKey?: SectionKey | null
}

export default function MedicalImagePanel({ sectionKey }: Props = {}) {
  const [selectedId, setSelectedId] = useState(allImagesSorted[0]?.id || '')
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [viewMode, setViewMode] = useState<'image' | 'markdown'>('image')
  const [associations, setAssociations] = useState<Record<string, SectionKey>>(getImageAssociations)

  const selectedImage = allImagesSorted.find(img => img.id === selectedId)
  const groups = groupByDate(allImagesSorted)
  const isAssociatedWithCurrent = !!(sectionKey && associations[selectedId] === sectionKey)

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

  const handleToggleAssociation = () => {
    if (!selectedId || !sectionKey) return
    if (isAssociatedWithCurrent) {
      disassociateImage(selectedId)
      message.success('已取消关联')
    } else {
      associateImage(selectedId, sectionKey)
      message.success('已关联')
    }
    setAssociations(getImageAssociations())
  }

  return (
    <div className="medical-image-panel">
      <div className="mip-header">
        <PictureOutlined style={{ marginRight: 6 }} />
        <span className="mip-title">全部病历图片</span>
        <span className="mip-count">{allImagesSorted.length}</span>
      </div>

      <div className="mip-body">
        <div className="mip-thumb-column">
          {groups.map(group => (
            <div key={group.date} className="mip-thumb-group">
              <div className="mip-thumb-date">{group.date}</div>
              {group.images.map(img => (
                <div
                  key={img.id}
                  className={`mip-thumb ${img.id === selectedId ? 'selected' : ''}`}
                  onClick={() => handleSelect(img.id)}
                >
                  <img src={img.url} alt="" />
                  {associations[img.id] && (
                    <Tag className="mip-thumb-tag" color="blue">关联资料</Tag>
                  )}
                  {img.id === selectedId && <div className="mip-thumb-check" />}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mip-preview-area">
          {selectedImage && (
            <div className="mip-preview-time">
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
              <div className="mip-preview">
                {selectedImage ? (
                  <img
                    src={selectedImage.url}
                    alt="病历图片预览"
                    className="mip-preview-img"
                    style={{ transform: `rotate(${rotation}deg) scale(${zoom})` }}
                    draggable={false}
                  />
                ) : (
                  <div className="mip-preview-empty">
                    <PictureOutlined style={{ fontSize: 40, color: '#d9d9d9' }} />
                    <span>暂无图片</span>
                  </div>
                )}
              </div>
              <div className="mip-toolbar">
                <div className="mip-toolbar-left">
                  <Tooltip title="左旋 90°">
                    <button className="mip-toolbar-btn" onClick={rotateLeft}><RotateLeftOutlined /></button>
                  </Tooltip>
                  <Tooltip title="右旋 90°">
                    <button className="mip-toolbar-btn" onClick={rotateRight}><RotateRightOutlined /></button>
                  </Tooltip>
                  <div className="mip-toolbar-divider" />
                  <Tooltip title="放大">
                    <button className="mip-toolbar-btn" onClick={zoomIn} disabled={zoom >= 3}><ZoomInOutlined /></button>
                  </Tooltip>
                  <span className="mip-toolbar-zoom">{Math.round(zoom * 100)}%</span>
                  <Tooltip title="缩小">
                    <button className="mip-toolbar-btn" onClick={zoomOut} disabled={zoom <= 0.5}><ZoomOutOutlined /></button>
                  </Tooltip>
                  <div className="mip-toolbar-divider" />
                  <Tooltip title="重置">
                    <button className="mip-toolbar-btn" onClick={resetView}><UndoOutlined /></button>
                  </Tooltip>
                </div>
                {sectionKey && (
                  <Button
                    size="small"
                    type={isAssociatedWithCurrent ? 'default' : 'primary'}
                    danger={isAssociatedWithCurrent}
                    icon={isAssociatedWithCurrent ? <DisconnectOutlined /> : <LinkOutlined />}
                    onClick={handleToggleAssociation}
                  >
                    {isAssociatedWithCurrent ? '取消关联' : '关联'}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="mip-markdown">
              {selectedImage ? (
                <div
                  className="mip-markdown-content"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(selectedImage.markdown) }}
                />
              ) : (
                <div className="mip-preview-empty">
                  <FileTextOutlined style={{ fontSize: 40, color: '#d9d9d9' }} />
                  <span>暂无识别内容</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
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

  // tables
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

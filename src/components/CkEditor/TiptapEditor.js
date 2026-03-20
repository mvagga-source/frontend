import React, { useRef, useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import {StarterKit} from '@tiptap/starter-kit'
//import {Image} from '@tiptap/extension-image'
import ResizeImage from 'tiptap-extension-resize-image'; // 추가
//import {Link} from '@tiptap/extension-link'
import {Youtube} from '@tiptap/extension-youtube'
import {Table} from '@tiptap/extension-table'
import {TableRow} from '@tiptap/extension-table-row'
import {TableCell} from '@tiptap/extension-table-cell'
import {TableHeader} from '@tiptap/extension-table-header'
import {TextStyle} from '@tiptap/extension-text-style'
import {Color} from '@tiptap/extension-color'
import {Highlight} from '@tiptap/extension-highlight'
import {TextAlign} from '@tiptap/extension-text-align'
import {Placeholder} from '@tiptap/extension-placeholder'
import { Extension } from '@tiptap/core'

import styles from './TiptapEditor.module.css'
import { NeonBtn } from '../button/Button';

/* 🔥 FontSize extension */
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: el => el.style.fontSize,
            renderHTML: attrs => {
              if (!attrs.fontSize) return {}
              return { style: `font-size:${attrs.fontSize}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize:
        size =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize: size }).run(),
    }
  },
})

export default function TiptapEditor({ onChange }) {
  const fileRef = useRef();
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [grid, setGrid] = useState({ rows: 3, cols: 3 });
  const [activeMenu, setActiveMenu] = useState(null); // 'image' | 'video' | null
  const [urlInput, setUrlInput] = useState("");
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [tempSize, setTempSize] = useState({ width: '', height: '' });

  // HTML 편집기 열기
  const openHtmlEditor = () => {
    setHtmlContent(editor.getHTML()); // 현재 에디터 내용을 HTML로 가져옴
    setShowHtmlModal(true);
  };

  // HTML 수정한 내용 에디터에 적용하기
  const applyHtml = () => {
    editor.commands.setContent(htmlContent, true); // true: 변경사항 이력(undo/redo) 유지
    setShowHtmlModal(false);
  };

  // 메뉴 토글 함수
  const toggleMenu = (menu) => setActiveMenu(activeMenu === menu ? null : menu);

  // URL 삽입 실행
  const insertUrlContent = () => {
    if (!urlInput) return;
    if (activeMenu === 'image') {
      editor.chain().focus().setImage({ src: urlInput }).run();
    } else if (activeMenu === 'video') {
      editor.chain().focus().setYoutubeVideo({ src: urlInput }).run();
    }
    setUrlInput("");
    setActiveMenu(null);
  };

  // SVG 아이콘 컴포넌트들 (툴바 안에서 사용)
  const Icons = {
    Bold: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>,
    Italic: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
    Strike: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>,
    Highlighter: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>,
    AlignLeft: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
    AlignCenter: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>,
    AlignRight: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>,
    BulletList: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.2" fill="currentColor"/><circle cx="4" cy="12" r="1.2" fill="currentColor"/><circle cx="4" cy="18" r="1.2" fill="currentColor"/></svg>,
    OrderedList: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>,
    Link: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    Image: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    Youtube: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><path d="m10 9 5 3-5 3z"/></svg>,
    Undo: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
    Redo: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      //Link.configure({ openOnClick: false }),   //이미 존재
      ResizeImage.configure({
        allowBase64: true,
      }),
      Youtube.configure({
        width: 480,
        height: 320,
        HTMLAttributes: {
          class: 'resizable-video',
        },
      }),

      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,

      TextStyle,
      Color,
      Highlight,

      TextAlign.configure({
        types: ['heading', 'paragraph', 'tableCell', 'image'],
      }),

      Placeholder.configure({
        placeholder: '내용을 입력하세요...',
      }),

      FontSize,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  // 유튜브 노드 선택 시 값을 동기화하는 로직 (useEffect 등 활용 가능)
  useEffect(() => {
    // 내부에서 editor 존재 여부와 활성화 여부를 체크
    if (editor && editor.isActive('youtube')) {
      const attrs = editor.getAttributes('youtube');
      setTempSize({ 
        width: attrs.width || '', 
        height: attrs.height || '' 
      });
    }
  }, [editor?.isActive('youtube')]); // 훅의 순서는 항상 일정하게 유지됨

  if (!editor) return null

  /* 이미지 업로드 */
  const uploadImage = async e => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('upload', file)

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/editorimg/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await res.json()

    if (data.url) {
      editor.chain().focus().setImage({ src: data.url }).run()
    }
  }

  const addLink = () => {
    const url = prompt('URL 입력')
    if (!url) return
    editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        {/* 1. 글자 스타일 그룹 */}
        <select 
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: parseInt(val) }).run();
          }}
          value={
            editor.isActive('heading', { level: 1 }) ? '1' : 
            editor.isActive('heading', { level: 2 }) ? '2' : 
            editor.isActive('heading', { level: 3 }) ? '3' : 'p'
          }
        >
          <option value="p">본문</option>
          <option value="1">제목 1</option>
          <option value="2">제목 2</option>
          <option value="3">제목 3</option>
        </select>

        {/* 2. 서식 그룹 */}
        <div className={styles.buttonGroup}>
          <button 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            className={editor.isActive('bold') ? styles.active : ''} 
            title="굵게"
          >
            <Icons.Bold />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            className={editor.isActive('italic') ? styles.active : ''} 
            title="기울임"
          >
            <Icons.Italic />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleStrike().run()} 
            className={editor.isActive('strike') ? styles.active : ''} 
            title="취소선"
          >
            <Icons.Strike />
          </button>
          
          <select onChange={e => editor.chain().focus().setFontSize(e.target.value).run()} style={{width:'70px'}}>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
          </select>

          <input type="color" defaultValue={"#ffffff"} onChange={e => editor.chain().focus().setColor(e.target.value).run()} title="글자 색상" />
          
          <button 
            onClick={() => editor.chain().focus().toggleHighlight().run()} 
            className={editor.isActive('highlight') ? styles.active : ''} 
            title="형광펜"
          >
            <Icons.Highlighter />
          </button>
        </div>

        {/* 3. 정렬 및 리스트 */}
        <div className={styles.buttonGroup}>
        {/* 정렬 버튼들 */}
        <button 
          onClick={() => editor.chain().focus().setTextAlign('left').run()} 
          className={editor.isActive({ textAlign: 'left' }) ? styles.active : ''} 
          title="좌측 정렬"
        >
          <Icons.AlignLeft />
        </button>
        <button 
          onClick={() => editor.chain().focus().setTextAlign('center').run()} 
          className={editor.isActive({ textAlign: 'center' }) ? styles.active : ''} 
          title="중앙 정렬"
        >
          <Icons.AlignCenter />
        </button>
        <button 
          onClick={() => editor.chain().focus().setTextAlign('right').run()} 
          className={editor.isActive({ textAlign: 'right' }) ? styles.active : ''} 
          title="우측 정렬"
        >
          <Icons.AlignRight />
        </button>

        {/* 리스트 버튼들 */}
        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          className={editor.isActive('bulletList') ? styles.active : ''} 
          title="불렛 리스트"
        >
          <Icons.BulletList />
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          className={editor.isActive('orderedList') ? styles.active : ''} 
          title="숫자 리스트"
        >
          <Icons.OrderedList />
        </button>
      </div>

        {/* 4. 표 추가 (활성화됨) */}
        <div className={styles.tableWrapper}>
          <button 
            onClick={() => setShowTablePicker(!showTablePicker)}
            className={editor.isActive('table') ? styles.active : ''}
          >
            표 삽입 ▾
          </button>

          {showTablePicker && (
            <div className={styles.tablePickerPopup}>
              <div className={styles.tablePickerInputGroup}>
                행 <input type="number" min="1" max="10" value={grid.rows} 
                  onChange={(e) => setGrid({...grid, rows: e.target.value})} />
                열 <input type="number" min="1" max="10" value={grid.cols} 
                  onChange={(e) => setGrid({...grid, cols: e.target.value})} />
              </div>
              <button 
                className={styles.tableCreateBtn}
                onClick={() => {
                  editor.chain().focus().insertTable({ rows: grid.rows, cols: grid.cols, withHeaderRow: true }).run();
                  setShowTablePicker(false);
                }}
              >
                생성 ({grid.rows}x{grid.cols})
              </button>
            </div>
          )}
        </div>

        {/* 표 선택 시 보조 도구 (활성화됨) */}
        {editor.isActive('table') && (
          <div className={styles.tableMiniToolbar}>
            <button onClick={() => editor.chain().focus().addRowAfter().run()} title="행 추가">행+</button>
            <button onClick={() => editor.chain().focus().addColumnAfter().run()} title="열 추가">열+</button>
            <button 
              onClick={() => editor.chain().focus().deleteTable().run()} 
              className={styles.deleteBtn}
              title="표 삭제"
            >
              삭제
            </button>
          </div>
        )}

        {/* 4. 이미지 & 영상 복합 삽입 그룹 */}
        <div className={styles.buttonGroup}>
          {/* 이미지 메뉴 */}
          <div className={styles.tableWrapper}>
            <button onClick={() => toggleMenu('image')} title="이미지 삽입">
              <Icons.Image /> ▾
            </button>
            {activeMenu === 'image' && (
              <div className={styles.tablePickerPopup}>
                <button className={styles.tableCreateBtn} onClick={() => { fileRef.current.click(); setActiveMenu(null); }}>
                  내 컴퓨터에서 업로드
                </button>
                <div className={styles.divider}>또는 URL 입력</div>
                <input 
                  className={styles.urlInput} 
                  placeholder="https://..." 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <button className={styles.tableCreateBtn} onClick={insertUrlContent}>삽입</button>
              </div>
            )}
          </div>

          {/* 영상 메뉴 */}
          <div className={styles.tableWrapper}>
            <button onClick={() => toggleMenu('video')} title="영상 삽입">
              <Icons.Youtube /> ▾
            </button>
            {activeMenu === 'video' && (
              <div className={styles.tablePickerPopup}>
                <div className={styles.tablePickerInputGroup}>YouTube URL</div>
                <input 
                  className={styles.urlInput} 
                  placeholder="https://youtu.be..." 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <button className={styles.tableCreateBtn} onClick={insertUrlContent}>영상 삽입</button>
              </div>
            )}
          </div>
          
          <button onClick={addLink} title="링크 추가"><Icons.Link /></button>
        </div>

        {/* 사이즈 조절 그룹 (유튜브 선택 시에만 노출) */}
        {editor.isActive('youtube') && (
          <div className={styles.buttonGroup} style={{ borderLeft: '2px solid #00f2ff', display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '10px' }}>
            <span style={{ fontSize: '11px', color: '#00f2ff' }}>YT Size:</span>
            
            <input 
              type="text"
              className={styles.sizeInput}
              placeholder="W"
              value={tempSize.width}
              onChange={(e) => setTempSize({ ...tempSize, width: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  editor.chain().focus().updateAttributes('youtube', { width: e.target.value }).run();
                }
              }}
              onBlur={() => {
                editor.chain().focus().updateAttributes('youtube', { width: tempSize.width }).run();
              }}
            />
            
            <span style={{ color: '#00f2ff', fontSize: '12px' }}>×</span>
            
            <input 
              type="text"
              className={styles.sizeInput}
              placeholder="H"
              value={tempSize.height}
              onChange={(e) => setTempSize({ ...tempSize, height: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  editor.chain().focus().updateAttributes('youtube', { height: e.target.value }).run();
                }
              }}
              onBlur={() => {
                editor.chain().focus().updateAttributes('youtube', { height: tempSize.height }).run();
              }}
            />

            {/* 정렬 버튼 */}
            <div style={{ display: 'flex', gap: '2px', marginLeft: '5px' }}>
              {['left', 'center', 'right'].map((pos) => (
                <button
                  key={pos}
                  style={{ width: '22px', height: '22px', padding: 0, fontSize: '10px' }}
                  onClick={() => {
                    let margin = '0 auto';
                    if (pos === 'left') margin = '0 auto 0 0';
                    if (pos === 'right') margin = '0 0 0 auto';
                    editor.chain().focus().updateAttributes('youtube', { containerstyle: `display: block; margin: ${margin};` }).run();
                  }}
                >
                  {pos === 'left' ? 'L' : pos === 'center' ? 'C' : 'R'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* HTML 소스 보기 버튼 */}
        <div className={styles.buttonGroup} style={{borderRight: 'none'}}>
          <button onClick={openHtmlEditor} title="HTML 소스 수정">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
          </button>
        </div>

        {/* 6. 실행 취소 */}
        <div className={styles.buttonGroup} style={{borderRight: 'none'}}>
          <button onClick={() => editor.chain().focus().undo().run()} title="되돌리기"><Icons.Undo /></button>
          <button onClick={() => editor.chain().focus().redo().run()} title="다시실행"><Icons.Redo /></button>
        </div>

        <input type="file" hidden ref={fileRef} onChange={uploadImage} />
      </div>

      {/* HTML 편집 모달 (포털이나 절대 위치로 구현) */}
      {showHtmlModal && (
        <div className={styles.htmlModalOverlay}>
          <div className={styles.htmlModal}>
            <div className={styles.htmlModalHeader}>
              <span>HTML 소스 편집</span>
              <div style={{ cursor: 'pointer' }} onClick={() => setShowHtmlModal(false)}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
            </div>
            <textarea 
              className={styles.htmlTextArea}
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
            />
            <div className={styles.htmlModalFooter}>
              <NeonBtn className={styles.applyBtn} onClick={applyHtml}>적용하기</NeonBtn>
            </div>
          </div>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
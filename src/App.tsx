import { useState } from 'react'
import { generateStoryBeats, refineStoryBeats } from './api/claude'
import type { Beat } from './api/claude'

const genres = [
  { value: 'drama', label: '剧情' },
  { value: 'action', label: '动作' },
  { value: 'comedy', label: '喜剧' },
  { value: 'thriller', label: '惊悚' },
  { value: 'romance', label: '爱情' },
  { value: 'scifi', label: '科幻' },
]

const refineActions = [
  { label: '加强冲突', prompt: '加强每个阶段的外部阻力和关键对抗，让主角的选择更有代价。' },
  { label: '加快节奏', prompt: '压缩铺垫，提前引爆事件，让每个节拍都推动剧情向前。' },
  { label: '深化人物', prompt: '强化主角的欲望、恐惧和内在变化，让人物弧光更清晰。' },
]

function SparkIcon() {
  return <span className="spark-icon" aria-hidden="true">✦</span>
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="button-icon">
      <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EditIcon({ done = false }: { done?: boolean }) {
  return done ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="button-icon"><path d="m4 10 4 4 8-8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="button-icon"><path d="m4 14-.5 2.5L6 16l9.5-9.5a1.8 1.8 0 0 0-2.5-2.5L3.5 13.5M11.5 5.5l3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  )
}

function App() {
  const [concept, setConcept] = useState('')
  const [genre, setGenre] = useState('drama')
  const [beats, setBeats] = useState<Beat[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [activeRefinement, setActiveRefinement] = useState('')
  const [editingBeatId, setEditingBeatId] = useState('')

  const generateBeats = async () => {
    if (!concept.trim()) return
    setIsGenerating(true)
    setError('')

    try {
      setBeats(await generateStoryBeats(concept, genre))
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请稍后重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const refineBeats = async (label: string, direction: string) => {
    if (!beats.length) return
    setIsGenerating(true)
    setActiveRefinement(label)
    setError('')

    try {
      setBeats(await refineStoryBeats(concept, genre, beats, direction))
    } catch (err) {
      setError(err instanceof Error ? err.message : '修改失败，请稍后重试')
    } finally {
      setIsGenerating(false)
      setActiveRefinement('')
    }
  }

  const updateBeat = (id: string, field: 'title' | 'description', value: string) => {
    setBeats((current) => current.map((beat) => beat.id === id ? { ...beat, [field]: value } : beat))
  }

  const exportMarkdown = () => {
    const markdown = `# Story Beats 故事结构\n\n故事概念：${concept}\n故事类型：${genres.find((item) => item.value === genre)?.label ?? genre}\n\n${beats.map((beat, index) => `## ${index + 1}. ${beat.title}\n\n${beat.description}\n\n时间：${beat.timing}`).join('\n\n')}`
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'story-beats.md'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><SparkIcon /></div>
          <div>
            <p className="brand-name">STORY BEATS</p>
            <p className="brand-caption">故事创作工作台</p>
          </div>
        </div>
        <div className="topbar-meta"><span className="status-dot" /> AI 结构顾问</div>
      </header>

      <section className="workspace-heading">
        <div>
          <p className="eyebrow">从灵感到结构</p>
          <h1>让故事先站稳，<em>再开始写。</em></h1>
          <p className="heading-copy">把一句模糊的故事想法，推进成一份可以继续创作的叙事骨架。</p>
        </div>
        <div className="model-note"><span>15</span><small>个关键节拍<br />Save the Cat</small></div>
      </section>

      <section className="workbench">
        <aside className="input-panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">01 / 故事种子</p>
              <h2>先告诉我，你想讲什么？</h2>
            </div>
            <span className="panel-count">{concept.length}/500</span>
          </div>

          <label htmlFor="concept">故事概念</label>
          <textarea
            id="concept"
            value={concept}
            maxLength={500}
            onChange={(event) => setConcept(event.target.value)}
            placeholder="例如：一个退休特工发现女儿被绑架，只能重返地下世界，却发现绑架案和自己过去的一次任务有关。"
          />
          <p className="field-hint">写下人物、欲望和阻碍，不需要完整。</p>

          <label className="genre-label">故事气质</label>
          <div className="genre-grid" role="group" aria-label="故事类型">
            {genres.map((item) => (
              <button
                type="button"
                key={item.value}
                className={`genre-chip ${genre === item.value ? 'selected' : ''}`}
                onClick={() => setGenre(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {error && <div className="error-message" role="alert">{error}</div>}

          <button className="generate-button" onClick={generateBeats} disabled={!concept.trim() || isGenerating}>
            <span>{isGenerating ? '正在整理故事结构…' : '生成故事节拍'}</span>
            {isGenerating ? <span className="loading-dot" aria-hidden="true" /> : <ArrowIcon />}
          </button>
          <p className="privacy-note">你的故事只用于本次生成，不会保存到这里。</p>
        </aside>

        <section className="results-panel" aria-live="polite">
          <div className="results-header">
            <div>
              <p className="section-kicker">02 / 故事骨架</p>
              <h2>{beats.length ? '你的故事节拍' : '等待一颗故事种子'}</h2>
            </div>
            {beats.length > 0 && (
              <div className="result-actions">
                <button className="export-button" onClick={exportMarkdown} title="下载 Markdown 文件">下载 Markdown</button>
                <button className="reset-button" onClick={() => setBeats([])} title="清空当前结果">重新开始</button>
              </div>
            )}
          </div>

          {beats.length > 0 && !isGenerating && (
            <div className="refine-strip">
              <span>继续调整</span>
              {refineActions.map((action) => (
                <button key={action.label} type="button" onClick={() => refineBeats(action.label, action.prompt)}>
                  {action.label}<ArrowIcon />
                </button>
              ))}
            </div>
          )}

          {isGenerating && <div className="loading-state"><div className="loading-line" /><p>{activeRefinement ? `正在${activeRefinement}…` : '正在寻找故事里的转折点…'}</p></div>}

          {!isGenerating && beats.length === 0 && (
            <div className="empty-state">
              <div className="empty-number">15</div>
              <h3>一个好故事，先从结构开始。</h3>
              <p>输入左侧的故事概念后，AI 会帮你梳理开场、冲突、转折与结局。</p>
              <div className="empty-steps"><span>灵感</span><i>→</i><span>冲突</span><i>→</i><span>节拍</span></div>
            </div>
          )}

          {!isGenerating && beats.length > 0 && (
            <div className="beat-list">
              {beats.map((beat, index) => (
                <article className="beat-row" key={beat.id}>
                  <div className="beat-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="beat-content">
                    <div className="beat-title-row">
                      {editingBeatId === beat.id ? (
                        <input className="beat-title-input" value={beat.title} onChange={(event) => updateBeat(beat.id, 'title', event.target.value)} aria-label={`${beat.title} 标题`} />
                      ) : <h3>{beat.title}</h3>}
                      <div className="beat-meta">
                        <span>{beat.timing}</span>
                        <button className="edit-button" onClick={() => setEditingBeatId(editingBeatId === beat.id ? '' : beat.id)} title={editingBeatId === beat.id ? '保存节拍' : '编辑节拍'}>
                          <EditIcon done={editingBeatId === beat.id} />
                          <span>{editingBeatId === beat.id ? '保存' : '编辑'}</span>
                        </button>
                      </div>
                    </div>
                    {editingBeatId === beat.id ? (
                      <textarea className="beat-description-input" value={beat.description} onChange={(event) => updateBeat(beat.id, 'description', event.target.value)} aria-label={`${beat.title} 描述`} />
                    ) : <p>{beat.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <footer className="footer"><span>STORY BEATS</span><span>结构清晰，创作自由。</span></footer>
    </main>
  )
}

export default App

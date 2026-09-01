import { useState } from 'react'
import { generateStoryBeats } from './api/claude'
import type { Beat } from './api/claude'

function App() {
  const [concept, setConcept] = useState('')
  const [genre, setGenre] = useState('drama')
  const [beats, setBeats] = useState<Beat[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(true)

  const generateBeats = async () => {
    if (!concept.trim() || !apiKey.trim()) return

    setIsGenerating(true)
    setError('')

    try {
      const generatedBeats = await generateStoryBeats(concept, genre, apiKey)
      setBeats(generatedBeats)
      setShowApiKeyInput(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请检查 API Key 或稍后重试')
      console.error('Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-1 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            故事节拍规划器
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            将你的创意转化为清晰的叙事结构
          </p>
        </header>

        {/* Input Section */}
        <div className="bg-surface-3 rounded-2xl p-8 mb-8 border border-surface-4">
          {showApiKeyInput && (
            <div className="mb-6">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-3">
                Anthropic API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full bg-surface-2 border border-surface-4 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
              <p className="text-xs text-gray-500 mt-2">
                API Key 仅在浏览器本地使用，不会被存储或上传
              </p>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="concept" className="block text-sm font-medium text-gray-300 mb-3">
              故事概念
            </label>
            <textarea
              id="concept"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="描述你的故事概念。例如：一个退休杀手为了救被绑架的狗，不得不重操旧业..."
              className="w-full h-32 bg-surface-2 border border-surface-4 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-3">
              类型
            </label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-surface-2 border border-surface-4 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="drama">剧情</option>
              <option value="action">动作</option>
              <option value="comedy">喜剧</option>
              <option value="thriller">惊悚</option>
              <option value="romance">爱情</option>
              <option value="scifi">科幻</option>
            </select>
          </div>

          {error && (
            <div className="mb-6 bg-red-900 bg-opacity-20 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={generateBeats}
            disabled={!concept.trim() || !apiKey.trim() || isGenerating}
            className="w-full bg-accent-primary text-white font-medium py-4 rounded-pill hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? '生成中...' : '生成故事节拍'}
          </button>
        </div>

        {/* Beats Display */}
        {beats.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">
                故事结构节拍
              </h2>
              <button
                onClick={() => {
                  setBeats([])
                  setShowApiKeyInput(true)
                }}
                className="text-sm text-accent-primary hover:text-opacity-80 transition-colors"
              >
                重新生成
              </button>
            </div>
            {beats.map((beat, index) => (
              <div
                key={beat.id}
                className="bg-surface-3 border border-surface-4 rounded-xl p-6 hover:border-accent-primary transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-primary bg-opacity-20 rounded-full flex items-center justify-center text-accent-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {beat.title}
                      </h3>
                      <span className="text-sm text-accent-primary font-medium">
                        {beat.timing}
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      {beat.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {beats.length === 0 && !isGenerating && (
          <div className="text-center py-16 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">输入故事概念开始生成节拍</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

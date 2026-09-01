import { useState } from 'react'
import { generateStoryBeats } from './api/claude'
import type { Beat } from './api/claude'

function App() {
  const [concept, setConcept] = useState('')
  const [genre, setGenre] = useState('drama')
  const [beats, setBeats] = useState<Beat[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const generateBeats = async () => {
    if (!concept.trim()) return

    setIsGenerating(true)
    setError('')

    try {
      const generatedBeats = await generateStoryBeats(concept, genre)
      setBeats(generatedBeats)
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请稍后重试')
      console.error('Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-1">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-16">
        {/* Header with enhanced typography */}
        <header className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="w-14 h-14 bg-accent-primary/20 rounded-2xl flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
              <svg className="w-7 h-7 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-5 tracking-tight leading-tight">
            故事节拍规划器
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            用 AI 将创意转化为专业的叙事结构
          </p>
        </header>

        {/* Input Section with glass morphism */}
        <div className="bg-surface-3/80 backdrop-blur-xl rounded-3xl p-10 mb-10 border border-surface-4/50 shadow-2xl shadow-black/20">
          <div className="mb-8">
            <label htmlFor="concept" className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">
              故事概念
            </label>
            <textarea
              id="concept"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="描述你的故事核心想法。例如：一个退休杀手为了救被绑架的狗，不得不重操旧业，对抗整个地下犯罪网络..."
              className="w-full h-40 bg-surface-2/80 backdrop-blur-sm border border-surface-4/50 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary/50 resize-none transition-all duration-200 leading-relaxed"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="genre" className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">
              故事类型
            </label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-surface-2/80 backdrop-blur-sm border border-surface-4/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary/50 transition-all duration-200 cursor-pointer"
            >
              <option value="drama">剧情 Drama</option>
              <option value="action">动作 Action</option>
              <option value="comedy">喜剧 Comedy</option>
              <option value="thriller">惊悚 Thriller</option>
              <option value="romance">爱情 Romance</option>
              <option value="scifi">科幻 Sci-Fi</option>
            </select>
          </div>

          {error && (
            <div className="mb-8 bg-red-900/30 backdrop-blur-sm border border-red-800/50 rounded-2xl px-5 py-4 text-red-300 text-sm leading-relaxed">
              {error}
            </div>
          )}

          <button
            onClick={generateBeats}
            disabled={!concept.trim() || isGenerating}
            className="group relative w-full bg-gradient-to-r from-accent-primary to-accent-primary/90 text-white font-semibold py-5 rounded-pill hover:shadow-lg hover:shadow-accent-primary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  生成中...
                </>
              ) : (
                <>
                  生成故事节拍
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
        </div>

        {/* Beats Display with enhanced cards */}
        {beats.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  故事结构节拍
                </h2>
                <p className="text-sm text-gray-400">基于 Save the Cat 叙事模型</p>
              </div>
              <button
                onClick={() => {
                  setBeats([])
                }}
                className="px-5 py-2.5 text-sm text-accent-primary bg-accent-primary/10 hover:bg-accent-primary/20 rounded-pill transition-all duration-200 font-medium"
              >
                重新生成
              </button>
            </div>
            <div className="grid gap-5">
              {beats.map((beat, index) => (
                <div
                  key={beat.id}
                  className="group bg-surface-3/80 backdrop-blur-xl border border-surface-4/50 rounded-2xl p-7 hover:border-accent-primary/50 hover:shadow-lg hover:shadow-accent-primary/10 transition-all duration-300"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-accent-primary/30 to-accent-primary/10 rounded-2xl flex items-center justify-center text-accent-primary font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-semibold text-white leading-tight">
                          {beat.title}
                        </h3>
                        <span className="flex-shrink-0 text-sm text-accent-primary font-semibold bg-accent-primary/10 px-3 py-1 rounded-full">
                          {beat.timing}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-base">
                        {beat.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {beats.length === 0 && !isGenerating && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-surface-3/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <p className="text-xl text-gray-400 font-medium">输入故事概念，开始创作之旅</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-surface-4/30 text-center text-sm text-gray-500">
          <p>基于 DeepSeek AI 驱动 · 遵循 Save the Cat 叙事模型</p>
        </footer>
      </div>
    </div>
  )
}

export default App

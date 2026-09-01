# Story Beats

面向短剧创作者的 AI 故事结构工作台：把一句故事灵感推进成 15 个可继续创作的叙事节拍。

## 核心路径

1. 输入人物、欲望和阻碍
2. 选择故事气质
3. 生成 Save the Cat 结构节拍
4. 选择“加强冲突”“加快节奏”或“深化人物”继续调整

## 当前完成边界

已完成真实 DeepSeek API 生成、15 个故事节拍、加载状态、错误处理、响应式 UI、AI 二次调整、单节拍编辑和 Markdown 导出。

尚未完成历史记录和 PDF 导出。继续开发时，第一优先级是历史版本对比，让创作者可以回看不同的故事结构方案。

## 本地运行

```bash
npm install
cp .env .env.local
# 在 .env.local 中填写服务端密钥：DEEPSEEK_API_KEY=your_key
npm run dev
```

本地 `npm run dev` 会通过 Vite 适配 `/api/generate`，直接支持完整体验。也可以使用 Vercel CLI 模拟线上环境：

```bash
npx vercel dev
```

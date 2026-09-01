# 部署指南

## 快速部署到 Vercel

### 方式一：通过 Vercel CLI（推荐）

1. 安装 Vercel CLI（如果还没有）：
```bash
npm install -g vercel
```

2. 在项目目录下运行：
```bash
vercel
```

3. 按照提示完成部署，选择：
   - 项目名称：story-beats（或自定义）
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. 部署完成后会得到一个 `.vercel.app` 的访问链接

### 方式二：通过 Vercel Dashboard

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入 Git 仓库（GitHub/GitLab/Bitbucket）
4. Vercel 会自动检测 Vite 项目配置
5. 点击 "Deploy" 完成部署

### 方式三：使用 GitHub 自动部署

1. 将代码推送到 GitHub 仓库：
```bash
git remote add origin <your-github-repo-url>
git push -u origin master
```

2. 在 Vercel Dashboard 导入该 GitHub 仓库
3. 每次推送代码到 master 分支会自动触发部署

## 环境变量

本项目不需要配置环境变量。用户需要在使用时输入自己的 Anthropic API Key。

## 构建验证

在部署前，可以本地验证构建：

```bash
npm run build
npm run preview
```

访问 http://localhost:4173 查看生产构建的效果。

## 域名配置（可选）

1. 在 Vercel Dashboard 进入项目设置
2. 点击 "Domains"
3. 添加自定义域名
4. 按照提示配置 DNS 记录

## 故障排查

### 构建失败
- 检查 Node.js 版本（建议 18+）
- 运行 `npm install` 确保依赖完整
- 检查 TypeScript 类型错误：`npm run build`

### 运行时错误
- 确认用户输入了有效的 Anthropic API Key
- 检查浏览器控制台的错误信息
- 确认 API Key 有足够的配额

## 性能优化建议

1. **启用 Vercel Analytics**：已集成，自动收集访问数据
2. **配置 CDN**：Vercel 自动提供全球 CDN
3. **图片优化**：如需添加图片，使用 Vercel Image Optimization

## 安全注意事项

- ✅ API Key 仅在浏览器本地使用
- ✅ 不会上传或存储用户的 API Key
- ✅ 使用 HTTPS 加密传输
- ⚠️ 提醒用户不要在公共设备上使用

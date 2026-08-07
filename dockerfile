# ===== 本地构建模式（dist/ 已在本地预构建并上传） =====
FROM node:24.15-alpine

ENV NODE_ENV=production

WORKDIR /app

# 启用 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 复制依赖文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 仅安装生产依赖
RUN pnpm install --frozen-lockfile --prod

# 复制本地预构建产物
COPY dist ./dist
COPY public ./public
# 复制 skills 规范目录（read_file / write_file 的沙箱根），
# 通过 SKILLS_DIR 覆盖代码中基于 process.cwd() 的默认定位
COPY src/video/skills ./skills
ENV SKILLS_DIR=/app/skills

# 声明端口
EXPOSE 3000

# 启动命令
CMD ["node", "dist/main.js"]
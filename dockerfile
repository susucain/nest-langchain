# ===== 构建阶段 =====
FROM node:24.15-alpine AS builder

WORKDIR /app

# 启用 pnpm（Node.js 20+ 已内置 corepack）
RUN corepack enable && corepack prepare pnpm@latest --activate

# 复制依赖文件（利用缓存）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 安装所有依赖（包括 devDependencies，用于构建）
RUN pnpm install --frozen-lockfile

# 复制项目代码
COPY . .

# 构建 NestJS 项目
RUN pnpm run build

# ===== 生产阶段 =====
FROM node:24.15-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# 启用 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 复制 package.json 和 lock 文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 只安装生产依赖
RUN pnpm install --frozen-lockfile --prod

# 复制构建产物
COPY --from=builder /app/dist ./dist

# 复制静态文件（如果需要）
COPY --from=builder /app/public ./public

# 声明端口
EXPOSE 3000

# 启动命令
CMD ["node", "dist/main.js"]
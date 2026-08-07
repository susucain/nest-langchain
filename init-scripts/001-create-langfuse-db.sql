-- 为 Langfuse 创建独立数据库
-- hello_pg 已被项目（agent 对话持久化）占用，Langfuse 的 Prisma 迁移要求空库，故单独建库
CREATE DATABASE langfuse;

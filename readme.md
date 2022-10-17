# rackar-cms
## 介绍
Rackar-CMS 是一套TypeScript编写的开源轻量级CMS系统。

后端使用：
Node.js
Koa.js
Prisma ORM
MongoDB

前端使用：
Vue.js v3
Element-Plus
TailwindCSS

主要参考了https://github.com/unix/koa-ts 和 vue3-element-admin 两个库的结构。

## 特点
主要是利用了Prisma ORM结合了routing-controllers。开发时首先编写数据表结构和关系，然后使用路由装饰器添加API路由和数据库交互。管理查询非常优雅简便。

Prisma数据库Schema同时也是TypeScript的类型，不用额外编写数据类型，智能提示友好。

## 使用
```s
# 安装
pnpm i

# 复制环境变量
cp .env.development .env

# 顺序执行以下3个命令：

# schema generate interface 每次修改完schema要执行 
pnpm db 
# 清空所有数据表，灌入初始化数据 修改完schema如果有结构性变动（如添加必须字段） 需要清空数据
pnpm re 
# nodemon调试并监视变动
pnpm dev 

```
api默认会启用到localhost:3001
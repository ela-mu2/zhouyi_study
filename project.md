# PROJECT.md

## 项目
名称：周易学习与测验系统 (zhouyi_study)
类型：Web Application (Full Stack MERN)
用途：提供六十四卦浏览、易经相关文章阅读及交互式八卦测验功能。

## 技术栈
Frontend: React (React DOM), Vite, Axios
Backend: Node.js, Express.js
Database: MongoDB (Mongoose ORM)
Authentication: JWT (JSON Web Token), bcryptjs

## 项目结构
zhouyi_study/
├── backend/
│   ├── src/
│   │   ├── config/          # 数据库连接 (db.js)
│   │   ├── models/          # Mongoose Schema
│   │   ├── controllers/     # 业务逻辑控制器
│   │   ├── routes/          # Express 路由入口
│   │   ├── middlewares/     # JWT 鉴权中间件
│   │   └── index.js         # 后端服务入口 (app.listen)
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── utils/           # Axios 实例及 API 请求封装 (api.js)
    │   ├── pages/           # 页面组件 (Home, QuizDetail, Login 等)
    │   ├── components/      # 可复用 UI 组件 (Navbar, Footer 等)
    │   ├── context/         # 全局状态管理 (AuthContext.jsx)
    │   ├── App.jsx          # React Router 配置
    │   └── main.jsx         # React 渲染入口
    ├── .env                 # 环境配置 (VITE_API_BASE_URL)
    └── package.json

## 核心模块
- Auth：用户注册、登录与 JWT 身份认证
- Hexagram：六十四卦浏览与查询
- Article：易经入门与进阶文章系统
- Quiz：互动式测验系统（三合一嵌套结构）
- Attempt：用户答题历史与准确率记录

## 数据模型 (MongoDB Collections)
User
- _id (ObjectId)
- email (String, Unique)
- password_hash (String)
- role (Number: 0-普通用户, 1-管理员)
- createdAt / updatedAt (Date)

Quiz
- _id (ObjectId)
- category_title (String)
- category_description (String)
- questions: [
    {
      _id (ObjectId),
      question_text (String),
      options: [
        { _id (ObjectId), option_text (String), is_correct (Boolean) }
      ]
    }
  ]

Hexagram
- _id (ObjectId)
- name (String)
- symbol (String)
- description (String)

Article
- _id (ObjectId)
- title (String)
- content (String)
- createdAt / updatedAt (Date)

UserQuizAttempt
- _id (ObjectId)
- user_id (ObjectId -> User)
- quiz_id (ObjectId -> Quiz)
- question_id (ObjectId)
- selected_option_id (ObjectId)
- is_correct (Boolean)
- createdAt / updatedAt (Date)
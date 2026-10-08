# CONVENTIONS.md

## 命名

变量：camelCase
函数：camelCase
类：PascalCase
常量：UPPER_SNAKE_CASE
文件：kebabCase

例如：
getUserById()
userProfile
UserService
API_BASE_URL
userProfile.js

## JavaScript
- 使用 const / let，不使用 var
- 优先 async/await
- 函数保持单一职责
- 不随意引入第三方库
- 不修改既有 API，除非明确要求

## 文件规则
- 一个模块一个文件
- utils 只放通用工具
- services 负责业务逻辑
- components 不直接操作数据库

## 修改原则
修改代码前先理解现有结构。
不要重写整个文件。
优先最小修改。
保持已有命名和架构。
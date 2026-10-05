import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 1. 引入你的各个页面 (pages)
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
// import GuaList from "./pages/GuaList";
// import ArticleDetail from "./pages/ArticleDetail";
// import Quiz from "./pages/Quiz";
// import QuizHistory from "./pages/QuizHistory";
// import AdminDashboard from "./pages/AdminDashboard";

// 2. 如果有公共导航栏，可以放在这里（可选）
// import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      {/* 如果写了 Navbar，可以放在 Routes 外面，这样每个页面顶端都会有导航栏 */}
      {/* <Navbar /> */}

      <Routes>
        {/* 默认访问根路径时，重定向到首页 */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* 基础页面 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />

        {/* 周易学习业务页面 */}
        {/* <Route path="/gua-list" element={<GuaList />} /> */}
        {/* <Route path="/article/:id" element={<ArticleDetail />} /> */}

        {/* 测验与记录 */}
        {/* <Route path="/quiz" element={<Quiz />} /> */}
        {/* <Route path="/quiz-history" element={<QuizHistory />} /> */}

        {/* 管理员仪表盘 */}
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
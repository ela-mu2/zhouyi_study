import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  function logout() { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/home"); }
  return <div className="home-container">
    <header className="home-navbar"><button className="logo text-button" onClick={() => navigate("/home")}>周易学苑</button>
      <nav className="nav-links" aria-label="主导航"><button onClick={() => navigate("/hexagrams")}>卦象目录</button><button onClick={() => navigate("/articles")}>学习文章</button><button onClick={() => navigate("/quiz")}>知识测验</button>
        {token && <><button onClick={() => navigate("/profile")}>个人中心</button><button onClick={() => navigate("/quiz-history")}>答题记录</button></>}{user?.role === 1 && <button onClick={() => navigate("/admin")}>管理面板</button>}</nav>
      <div className="user-action">{token ? <button className="btn-secondary" onClick={logout}>退出登录</button> : <><button className="btn-secondary" onClick={() => navigate("/login")}>登录</button><button className="btn-primary" onClick={() => navigate("/register")}>注册</button></>}</div>
    </header>
    <section className="hero-section"><p className="eyebrow">入门学习 · 循序渐进</p><h1>用简单方式认识《周易》</h1><p>从六十四卦、学习文章和互动测验开始，逐步了解古典易学知识。</p>
      <div className="hero-buttons"><button className="btn-primary" onClick={() => navigate("/hexagrams")}>浏览六十四卦</button><button className="btn-secondary" onClick={() => navigate("/articles")}>开始阅读</button></div>
    </section>
    <section className="feature-grid"><button className="feature-card" onClick={() => navigate("/hexagrams")}><h2>卦象目录</h2><p>按名称搜索卦象并查看相关说明。</p><span>浏览卦象 →</span></button>
      <button className="feature-card" onClick={() => navigate("/articles")}><h2>学习文章</h2><p>通过主题文章逐步认识周易基础概念。</p><span>浏览文章 →</span></button>
      <button className="feature-card" onClick={() => navigate("/quiz")}><h2>知识测验</h2><p>完成选择题并查看答题结果。</p><span>开始测验 →</span></button>
      {token && <button className="feature-card" onClick={() => navigate("/profile")}><h2>我的学习</h2><p>管理个人资料和收藏内容。</p><span>打开个人中心 →</span></button>}
    </section>
  </div>;
}

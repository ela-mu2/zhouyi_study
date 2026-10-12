import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <header className="home-navbar">
        <button className="logo text-button" onClick={() => navigate("/home")}>周易学习网</button>
        <nav className="nav-links" aria-label="主导航">
          <button onClick={() => navigate("/hexagrams")}>经卦大全</button>
          <button onClick={() => navigate("/articles")}>文章</button>
          <button onClick={() => navigate("/quiz")}>在线测验</button>
          {token && <button onClick={() => navigate("/quiz-history")}>答题记录</button>}
        </nav>
        <div className="user-action">
          {token ? <button className="btn-secondary" onClick={handleLogout}>退出登录</button> : <button className="btn-primary" onClick={() => navigate("/login")}>去登录</button>}
        </div>
      </header>
      <section className="hero-section">
        <p className="eyebrow">从经典出发，循序学习</p>
        <h1>大道至简，领略《周易》智慧</h1>
        <p>浏览卦象与学习文章，通过测验巩固所学。</p>
        <div className="hero-buttons">
          <button className="btn-primary large" onClick={() => navigate("/hexagrams")}>探索卦象</button>
          <button className="btn-secondary large" onClick={() => navigate("/quiz")}>开始测验</button>
        </div>
      </section>
      <section className="feature-grid">
        <button className="feature-card" onClick={() => navigate("/hexagrams")}><h2>经卦大全</h2><p>查看已收录卦象及其说明。</p><span>浏览卦象 →</span></button>
        <button className="feature-card" onClick={() => navigate("/articles")}><h2>学习文章</h2><p>阅读关于周易的学习内容。</p><span>浏览文章 →</span></button>
        <button className="feature-card" onClick={() => navigate("/quiz")}><h2>知识测验</h2><p>用测验检查并巩固学习成果。</p><span>开始测验 →</span></button>
        <button className="feature-card" onClick={() => navigate("/quiz-history")}><h2>答题记录</h2><p>查看保存在本机的测验成绩。</p><span>查看记录 →</span></button>
      </section>
    </div>
  );
}

export default Home;

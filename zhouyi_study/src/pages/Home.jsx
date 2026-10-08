import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("已退出登录");
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* 顶部导航栏 */}
      <header className="home-navbar">
        <div className="logo" onClick={() => navigate("/home")}>
          周易学习网
        </div>
        <nav className="nav-links">
          <span onClick={() => navigate("/gua-list")}>经卦大全</span>
          <span onClick={() => navigate("/quiz")}>在线测验</span>
          {token && <span onClick={() => navigate("/quiz-history")}>答题记录</span>}
        </nav>
        <div className="user-action">
          {token ? (
            <button className="btn-secondary" onClick={handleLogout}>
              退出登录
            </button>
          ) : (
            <button className="btn-primary" onClick={() => navigate("/login")}>
              去登录
            </button>
          )}
        </div>
      </header>

      {/* Hero 模块：主视觉banner */}
      <section className="hero-section">
        <h1>大道至简，领略《周易》智慧</h1>
        <p>系统化学习八卦与六十四卦解析，测试巩固知识，记录你的学习足迹。</p>
        <div className="hero-buttons">
          <button className="btn-primary large" onClick={() => navigate("/gua-list")}>
            探索经卦大全
          </button>
          <button className="btn-primary large" onClick={() => navigate("/quiz")}>
            开始测试
          </button>
        </div>
      </section>

      {/* 快速入口卡片 */}
      <section className="feature-grid">
        <div className="feature-card" onClick={() => navigate("/gua-list")}>
          <h3>经卦大全</h3>
          <p>涵盖八卦与六十四卦详细详解，深入了解卦辞与爻辞。</p>
        </div>
        <div className="feature-card" onClick={() => navigate("/quiz")}>
          <h3>知识测验</h3>
          <p>检验学习成果，多维度测试周易基础知识与应用。</p>
        </div>
        <div className="feature-card" onClick={() => navigate("/articles")}>
          <h3>文章</h3>
          <p>賽看很貴吧李桑本來;吃哇中</p>
        </div>
        <div className="feature-card" onClick={() => navigate("/quiz-history")}>
          <h3>答题记录</h3>
          <p>回顾历史测验，追踪正确率，查漏补缺。</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
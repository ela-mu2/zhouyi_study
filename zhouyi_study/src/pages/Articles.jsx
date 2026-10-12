import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api.get("/articles")
      .then(({ data }) => { if (active) setArticles(Array.isArray(data) ? data : []); })
      .catch(() => { if (active) setError("文章加载失败，请检查后端服务和 API 地址。"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className="page-shell">
      <button className="text-button" onClick={() => navigate("/home")}>← 返回首页</button>
      <header className="page-heading"><p className="eyebrow">阅读与思考</p><h1>周易文章</h1><p>从文章中继续探索周易的概念与应用。</p></header>
      {loading && <p role="status">正在加载文章…</p>}
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      {!loading && !error && articles.length === 0 && <p className="notice">暂时没有已发布的文章。</p>}
      <section className="card-grid">
        {articles.map((article) => (
          <article className="content-card" key={article._id}>
            <p className="eyebrow">{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "周易学习"}</p>
            <h2>{article.title}</h2>
            <p className="article-excerpt">{article.content || "暂无正文。"}</p>
            <Link className="action-link" to={`/article/${article._id}`}>阅读文章 →</Link>
          </article>
        ))}
      </section>
    </main>
  );
}

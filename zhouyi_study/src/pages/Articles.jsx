import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        let active = true;
        api.get("/articles", { params: search ? { q: search } : {} })
            .then(({ data }) => {
                if (active) setArticles(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (active) setError("文章加载失败，请检查后端服务和 API 地址。");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [search]);
    return (
        <main className="page-shell">
            <button className="text-button" onClick={() => navigate("/home")}>
                ← 返回首页
            </button>
            <header className="page-heading">
                <p className="eyebrow">阅读与思考</p>
                <h1>学习文章</h1>
                <p>从文章中逐步认识周易基础概念。</p>
                <label className="search-box">
                    搜索文章
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="输入标题或关键词" />
                </label>
            </header>
            {loading && <p role="status">正在加载文章…</p>}
            {error && (
                <p className="notice notice-error" role="alert">
                    {error}
                </p>
            )}
            {!loading && !error && articles.length === 0 && <p className="notice">暂时没有找到文章。</p>}
            <section className="card-grid">
                {articles.map((article) => (
                    <article className="content-card" key={article._id}>
                        <p className="eyebrow">{article.category || "周易学习"}</p>
                        <h2>{article.title}</h2>
                        <p className="article-excerpt">{article.summary || article.content || "暂无正文。"}</p>
                        <Link className="action-link" to={"/article/" + article._id}>
                            阅读文章 →
                        </Link>
                    </article>
                ))}
            </section>
        </main>
    );
}

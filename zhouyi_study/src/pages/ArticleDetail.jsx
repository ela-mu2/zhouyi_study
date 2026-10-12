import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

export default function ArticleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loadedId, setLoadedId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        api.get(`/articles/${id}`)
            .then(({ data }) => {
                if (active) {
                    setArticle(data);
                    setError("");
                    setLoadedId(id);
                }
            })
            .catch((requestError) => {
                if (active) {
                    setArticle(null);
                    setError(requestError.response?.status === 404 ? "没有找到这篇文章。" : "文章加载失败，请检查后端服务和 API 地址。");
                    setLoadedId(id);
                }
            });
        return () => {
            active = false;
        };
    }, [id]);

    if (loadedId !== id)
        return (
            <main className="page-shell">
                <p role="status">正在加载文章…</p>
            </main>
        );

    return (
        <main className="page-shell article-page">
            <button className="text-button" onClick={() => navigate("/articles")}>
                ← 返回文章列表
            </button>
            {error ? (
                <p className="notice notice-error" role="alert">
                    {error}
                </p>
            ) : (
                article && (
                    <article className="article-body">
                        <p className="eyebrow">{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "周易学习"}</p>
                        <h1>{article.title}</h1>
                        {article.createdAt && <p className="muted">发布于 {new Date(article.createdAt).toLocaleDateString()}</p>}
                        <div className="article-content">{article.content}</div>
                        <Link className="action-link" to="/articles">
                            浏览其他文章 →
                        </Link>
                    </article>
                )
            )}
        </main>
    );
}

import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Hexagrams() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        let active = true;
        api.get("/hexagrams", { params: search ? { q: search } : {} })
            .then(({ data }) => {
                if (active) setItems(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (active) setError("卦象加载失败，请检查后端服务和 API 地址。");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [search]);
    async function addFavorite(id) {
        if (!localStorage.getItem("token")) {
            setError("请先登录后收藏卦象。");
            return;
        }
        try {
            await api.post("/users/favorites/" + id);
            setError("已加入收藏，可在个人中心查看。");
        } catch (err) {
            setError(err.response?.data?.message || "收藏失败。");
        }
    }

    return (
        <main className="page-shell">
            <button className="text-button" onClick={() => navigate("/home")}>
                ← 返回首页
            </button>
            <header className="page-heading">
                <p className="eyebrow">周易知识库</p>
                <h1>六十四卦</h1>
                <p>按卦名搜索已收录的卦象与说明。</p>
                <label className="search-box">
                    搜索卦名
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="输入卦名" />
                </label>
            </header>
            {loading && <p role="status">正在加载卦象…</p>}
            {error && (
                <p className="notice notice-error" role="alert">
                    {error}
                </p>
            )}
            {!loading && !error && items.length === 0 && <p className="notice">没有找到卦象。</p>}
            <section className="card-grid" aria-label="卦象列表">
                {items.map((item) => (
                    <article className="content-card" key={item._id || item.id || item.name}>
                        <div className="hexagram-symbol" aria-hidden="true">
                            {item.symbol || "☯"}
                        </div>
                        <p className="muted">{item.number ? "第 " + item.number + " 卦" : item.category}</p>
                        <h2>{item.name || "未命名卦象"}</h2>
                        <p>{item.modernMeaning || item.description || item.guaText || "释义内容待补充。"}</p>
                        {item._id && (
                            <button className="secondary-button" onClick={() => addFavorite(item._id)}>
                                收藏
                            </button>
                        )}
                        {item.lineTexts && item.lineTexts.length > 0 && (
                            <details>
                                <summary>查看爻辞</summary>
                                <ol>
                                    {item.lineTexts.map((line, index) => (
                                        <li key={index}>{line || "内容待补充"}</li>
                                    ))}
                                </ol>
                            </details>
                        )}
                    </article>
                ))}
            </section>
        </main>
    );
}

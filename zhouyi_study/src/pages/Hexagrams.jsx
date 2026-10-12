import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Hexagrams() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api.get("/hexagrams")
      .then(({ data }) => { if (active) setItems(Array.isArray(data) ? data : []); })
      .catch(() => { if (active) setError("卦象加载失败，请检查后端服务和 API 地址。"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className="page-shell">
      <button className="text-button" onClick={() => navigate("/home")}>← 返回首页</button>
      <header className="page-heading"><p className="eyebrow">周易知识库</p><h1>经卦大全</h1><p>浏览已收录的卦象与说明。</p></header>
      {loading && <p role="status">正在加载卦象…</p>}
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="notice">暂时没有卦象数据。</p>}
      <section className="card-grid" aria-label="卦象列表">
        {items.map((item) => (
          <article className="content-card" key={item._id || item.id || item.name}>
            <div className="hexagram-symbol" aria-hidden="true">{item.symbol || "☯"}</div>
            <h2>{item.name || "未命名卦象"}</h2>
            <p>{item.description || "暂无说明。"}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

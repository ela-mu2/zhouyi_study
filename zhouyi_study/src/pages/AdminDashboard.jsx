import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ quizzes: 0, hexagrams: 0, articles: 0 });
  const [message, setMessage] = useState("正在读取内容概况…");

  useEffect(() => {
    let active = true;
    Promise.allSettled([api.get("/quizzes"), api.get("/hexagrams"), api.get("/articles")]).then((results) => {
      if (!active) return;
      const values = results.map((result) => result.status === "fulfilled" && Array.isArray(result.value.data) ? result.value.data.length : null);
      setCounts({ quizzes: values[0] ?? 0, hexagrams: values[1] ?? 0, articles: values[2] ?? 0 });
      setMessage(values.some((value) => value === null) ? "部分数据暂时无法读取；请确认后端服务和 API 路由已启用。" : "内容统计已更新。");
    });
    return () => { active = false; };
  }, []);

  return (
    <main className="page-shell">
      <button className="text-button" onClick={() => navigate("/home")}>← 返回首页</button>
      <header className="page-heading"><p className="eyebrow">内容管理</p><h1>管理概览</h1><p>{message}</p></header>
      <section className="stats-row">
        <div className="stat-card"><strong>{counts.quizzes}</strong><span>套测验</span></div>
        <div className="stat-card"><strong>{counts.hexagrams}</strong><span>条卦象</span></div>
        <div className="stat-card"><strong>{counts.articles}</strong><span>篇文章</span></div>
      </section>
      <p className="notice">当前后端提供内容读取接口；管理页面暂未连接新增、编辑或删除内容的管理接口。</p>
    </main>
  );
}

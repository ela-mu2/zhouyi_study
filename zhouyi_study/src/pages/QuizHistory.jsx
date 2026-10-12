import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const HISTORY_KEY = "zhouyi-quiz-history";

function readLocalHistory() {
  try {
    const value = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function QuizHistory() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [history, setHistory] = useState(readLocalHistory);
  const [loading, setLoading] = useState(Boolean(token));
  const [usingServer, setUsingServer] = useState(false);
  const [notice, setNotice] = useState("");
  const average = useMemo(() => history.length ? Math.round(history.reduce((sum, item) => sum + (item.total ? item.score / item.total : 0), 0) / history.length * 100) : 0, [history]);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    api.get("/quizzes/attempts", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        if (!active || !Array.isArray(data)) return;
        const localEntries = readLocalHistory();
        if (data.length === 0) {
          setHistory(localEntries);
          setNotice(localEntries.length ? "账号还没有同步记录，当前显示本机保存的历史成绩。" : "");
          return;
        }
        const serverIds = new Set(data.map((item) => String(item.id)));
        const merged = [...data, ...localEntries.filter((item) => !serverIds.has(String(item.id)))]
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        setHistory(merged);
        setUsingServer(true);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(merged));
      })
      .catch(() => { if (active) setNotice("账号记录暂时无法读取，以下显示本机保存的记录。"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return (
    <main className="page-shell">
      <button className="text-button" onClick={() => navigate("/home")}>← 返回首页</button>
      <header className="page-heading"><p className="eyebrow">学习进度</p><h1>答题记录</h1><p>{usingServer ? "显示账号同步记录与本机尚未同步的记录。" : "记录保存在当前浏览器中。"}</p></header>
      {notice && <p className="notice notice-error" role="status">{notice}</p>}
      {loading && <p role="status">正在同步账号记录…</p>}
      <section className="stats-row">
        <div className="stat-card"><strong>{history.length}</strong><span>次测验</span></div>
        <div className="stat-card"><strong>{average}%</strong><span>平均正确率</span></div>
      </section>
      {!loading && history.length === 0 ? <div className="notice"><p>还没有答题记录，完成一次测验后会显示在这里。</p><button className="action-button" onClick={() => navigate("/quiz")}>开始测验</button></div> : <>
        <div className="history-heading"><h2>最近完成</h2>{!usingServer && <button className="text-button" onClick={clearHistory}>清除本机记录</button>}</div>
        <div className="history-list">{history.map((item) => <article className="history-item" key={item.id}>
          <div><h3>{item.quizTitle}</h3><p className="muted">{new Date(item.completedAt).toLocaleString()}</p></div>
          <strong>{item.score} / {item.total}<small>{item.total ? Math.round(item.score / item.total * 100) : 0}%</small></strong>
        </article>)}</div>
      </>}
    </main>
  );
}


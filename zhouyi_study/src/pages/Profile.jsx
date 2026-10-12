import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([api.get("/users/profile"), api.get("/users/favorites")])
      .then(([profile, saved]) => { if (active) { setUser(profile.data); setName(profile.data.displayName || ""); setFavorites(saved.data); } })
      .catch(err => { if (active) setMessage(err.response?.data?.message || "无法读取个人资料，请重新登录。"); });
    return () => { active = false; };
  }, []);
  async function save(event) {
    event.preventDefault();
    try {
      const { data } = await api.put("/users/profile", { displayName: name });
      setUser(data.user || data);
      localStorage.setItem("user", JSON.stringify(data.user || data));
      setMessage("个人资料已保存。");
    } catch (err) { setMessage(err.response?.data?.message || "资料保存失败。"); }
  }
  async function remove(id) {
    try { await api.delete("/users/favorites/" + id); setFavorites(favorites.filter(item => item._id !== id)); }
    catch (err) { setMessage(err.response?.data?.message || "取消收藏失败。"); }
  }
  return <main className="page-shell"><Link to="/home">← 返回首页</Link><header className="page-heading"><p className="eyebrow">个人中心</p><h1>我的学习</h1></header>
    {message && <p className="notice" role="status">{message}</p>}
    <form className="login-card profile-form" onSubmit={save}><h2>个人资料</h2><p className="muted">{user?.email || "正在读取账号…"}</p><label>昵称<input value={name} onChange={event => setName(event.target.value)} maxLength={40} /></label><button className="action-button">保存资料</button></form>
    <div className="history-heading"><h2>收藏的卦象</h2><Link to="/quiz-history">查看答题记录</Link></div>
    <section className="card-grid">{favorites.map(item => <article className="content-card" key={item._id}><div className="hexagram-symbol">{item.symbol || "☯"}</div><h3>{item.name}</h3><p>{item.modernMeaning || item.description || "暂无说明。"}</p><button className="secondary-button" onClick={() => remove(item._id)}>取消收藏</button></article>)}
      {!favorites.length && <p className="notice">暂时没有收藏卦象。</p>}</section>
  </main>;
}

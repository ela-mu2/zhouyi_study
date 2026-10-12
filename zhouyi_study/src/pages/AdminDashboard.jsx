import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const labels = {
  articles: { title: "文章", fields: [["title", "标题"], ["category", "类别"], ["summary", "摘要"], ["content", "正文"]] },
  hexagrams: { title: "卦象", fields: [["number", "卦序"], ["name", "卦名"], ["symbol", "卦象符号"], ["category", "类别"], ["upperTrigram", "上卦"], ["lowerTrigram", "下卦"], ["guaText", "卦辞"], ["modernMeaning", "现代解释"], ["lineTexts", "爻辞（每行一条）"]] },
  quizzes: { title: "测验", fields: [["category_title", "测验标题"], ["category_description", "测验说明"], ["questions", "题目 JSON"]] },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [kind, setKind] = useState("articles");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const { data } = await api.get("/" + kind);
      setItems(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (err) { setMessage(err.response?.data?.message || "读取失败，请确认已使用管理员账号登录。"); }
  }
  useEffect(() => {
    let active = true;
    api.get("/" + kind)
      .then(({ data }) => {
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
        setMessage("");
      })
      .catch(err => {
        if (active) setMessage(err.response?.data?.message || "读取失败，请确认已使用管理员账号登录。");
      });
    return () => { active = false; };
  }, [kind]);

  function startEdit(item) {
    const next = { ...item };
    if (kind === "hexagrams") next.lineTexts = (item.lineTexts || []).join("\n");
    if (kind === "quizzes") next.questions = JSON.stringify(item.questions || [], null, 2);
    setForm(next);
    setEditId(item._id);
  }

  async function save(event) {
    event.preventDefault();
    const body = { ...form };
    if (kind === "hexagrams") body.lineTexts = String(body.lineTexts || "").split("\n").filter(Boolean);
    if (kind === "quizzes") {
      try { body.questions = JSON.parse(body.questions || "[]"); }
      catch { setMessage("题目 JSON 格式不正确，请检查括号和逗号。"); return; }
    }
    try {
      if (editId) await api.put("/" + kind + "/" + editId, body);
      else await api.post("/" + kind, body);
      setForm({}); setEditId(""); setMessage("保存成功。"); await load();
    } catch (err) { setMessage(err.response?.data?.message || "保存失败，请检查内容和管理员权限。"); }
  }

  async function remove(id) {
    if (!window.confirm("确定删除这条内容吗？")) return;
    try { await api.delete("/" + kind + "/" + id); await load(); setMessage("已删除。"); }
    catch (err) { setMessage(err.response?.data?.message || "删除失败。"); }
  }

  return <main className="page-shell"><button className="text-button" onClick={() => navigate("/home")}>← 返回首页</button>
    <header className="page-heading"><p className="eyebrow">内容管理</p><h1>管理面板</h1><p>可以新增、编辑和删除文章、卦象及测验。</p></header>
    <div className="admin-tabs">{Object.keys(labels).map(key => <button className={kind === key ? "action-button" : "secondary-button"} key={key} onClick={() => { setKind(key); setForm({}); setEditId(""); }}>{labels[key].title}</button>)}</div>
    {message && <p className="notice" role="status">{message}</p>}
    <form className="admin-form" onSubmit={save}><h2>{editId ? "编辑" : "添加"}{labels[kind].title}</h2>
      {labels[kind].fields.map(([key, title]) => <label key={key}>{title}
        {key === "content" || key === "summary" || key === "guaText" || key === "modernMeaning" || key === "lineTexts" || key === "questions"
          ? <textarea rows={key === "questions" || key === "content" ? 8 : 3} value={form[key] ?? ""} onChange={event => setForm({ ...form, [key]: event.target.value })} />
          : <input type={key === "number" ? "number" : "text"} value={form[key] ?? ""} onChange={event => setForm({ ...form, [key]: event.target.value })} />}
      </label>)}
      {kind === "quizzes" && <p className="muted">题目请填写 JSON 数组。每题包含 question_text 和 options，每个选项包含 option_text 与 is_correct。</p>}
      <div className="button-row"><button className="action-button">{editId ? "保存修改" : "添加内容"}</button>{editId && <button type="button" className="secondary-button" onClick={() => { setEditId(""); setForm({}); }}>取消</button>}</div>
    </form>
    <section className="card-grid">{items.map(item => <article className="content-card" key={item._id}><h2>{item.title || item.name || item.category_title}</h2><p>{item.summary || item.modernMeaning || item.category_description}</p><div className="button-row"><button className="secondary-button" onClick={() => startEdit(item)}>编辑</button><button className="secondary-button" onClick={() => remove(item._id)}>删除</button></div></article>)}</section>
    {!items.length && <p className="muted">当前没有内容。</p>}
  </main>;
}



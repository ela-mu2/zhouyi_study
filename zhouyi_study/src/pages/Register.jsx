import { useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    async function submit(event) {
        event.preventDefault();
        setError("");
        try {
            const { data } = await api.post("/users/register", { email, password });
            setMessage(data.message || "注册成功，请登录。");
            setTimeout(() => navigate("/login"), 900);
        } catch (err) {
            setError(err.response?.data?.message || "注册失败，请稍后重试。");
        }
    }
    return (
        <main className="login-wrapper">
            <form onSubmit={submit} className="login-card">
                <h2>周易学苑 · 注册</h2>
                <div className="form-group">
                    <label htmlFor="email">邮箱地址</label>
                    <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">设置密码（至少 8 位）</label>
                    <input id="password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                {message && (
                    <p className="notice" role="status">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="notice notice-error" role="alert">
                        {error}
                    </p>
                )}
                <button className="login-btn">注册账号</button>
                <p>
                    已有账号？<Link to="/login">返回登录</Link>
                </p>
            </form>
        </main>
    );
}

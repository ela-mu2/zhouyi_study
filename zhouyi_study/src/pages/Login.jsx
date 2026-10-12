import { useState } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    async function submit(event) {
        event.preventDefault();
        setError("");
        try {
            const { data } = await api.post("/users/login", { email, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.message || "登录失败，请检查账号和密码。");
        }
    }
    return (
        <main className="login-wrapper">
            <form onSubmit={submit} className="login-card">
                <h2>周易学苑 · 登录</h2>
                <div className="form-group">
                    <label htmlFor="email">邮箱地址</label>
                    <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">密码</label>
                    <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                {error && (
                    <p className="notice notice-error" role="alert">
                        {error}
                    </p>
                )}
                <button className="login-btn">登录</button>
                <p>
                    还没有账号？<Link to="/register">注册账号</Link>
                </p>
            </form>
        </main>
    );
}

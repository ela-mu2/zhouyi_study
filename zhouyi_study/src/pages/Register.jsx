import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 调用后端的注册接口
            await api.post("/users/register", { email, password });
            alert("注册成功！请登录");
            navigate("/login");
        } catch (error) {
            console.error("注册失败:", error);
            alert("注册失败，请稍后重试");
        }
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit} className="login-card">
                <h2>周易学习网 - 注册</h2>

                <div className="form-group">
                    <label htmlFor="email">邮箱地址</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
                </div>

                <div className="form-group">
                    <label htmlFor="password">设置密码</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>

                <button type="submit" className="login-btn">
                    注册账号
                </button>

                <button className="register-btn" type="button" style={{ marginTop: "12px" }} onClick={() => navigate("/login")}>
                    已有账号？返回登录
                </button>
            </form>
        </div>
    );
}

export default Register;

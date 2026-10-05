import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 如果已经登录过，自动跳到首页
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) navigate("/home");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. 发送登录请求
      const response = await api.post("/users/login", { email, password });

      // 2. 存 Token 到本地
      localStorage.setItem("token", response.data.token);

      alert("登录成功！");
      
      // 3. 跳转到首页（或经卦大全页）
      navigate("/home");
    } catch (error) {
      console.error("登录失败:", error);
      alert("登录失败，请检查账号和密码");
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-card">
        <h2>周易学习网 - 登录</h2>

        <div className="form-group">
          <label htmlFor="email">邮箱地址</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="login-btn">
          登录
        </button>

        <button
          className="register-btn"
          type="button"
          style={{ marginTop: "12px" }}
          onClick={() => navigate("/register")}
        >
          还没有账号？点击注册
        </button>
      </form>
    </div>
  );
}

export default Login;
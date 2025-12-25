import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email,
        password,
      });

      setSuccess("Login exitoso! espere un momento");

      // Usar la función login del contexto con accessToken y refreshToken
      login(response.data.user, response.data.accessToken, response.data.refreshToken);


      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Error en el login");
      } else {
        setError("Error de conexión");
      }
    }
  };

  return (
    <div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-input">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-input">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login-button" type="submit">
          Iniciar Sesión
        </button>
      </form>
      {error && <div className="login-message error">{error}</div>}
      {success && <div className="login-message success">{success}</div>}
    </div>
  );
};

export default LoginForm;


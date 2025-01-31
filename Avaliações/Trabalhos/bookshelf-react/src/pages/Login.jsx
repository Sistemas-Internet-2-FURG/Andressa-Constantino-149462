import axios from "axios";
import "../login.css";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/login", Object.fromEntries(formData));
      console.log("Login bem-sucedido:", response.data);
      navigate("/index")
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro no login");
    }
  };

  return (
    <main className="LoginBody">
      <div className="besideForm">
        <h1>BookShelf</h1>
        <h2>Gerencie seus livros de forma simples e eficiente!</h2>
        <p>
          Cadastre suas obras, gerencie autores e editoras, e acompanhe tudo em um só lugar. 
          Experimente uma forma descomplicada de organizar suas publicações.
        </p>
        <img src="/static/books.png" alt="Livros" />
        <span id="pictureCredits">
          Illustration by <a href="https://icons8.com/illustrations/author/zD2oqC8lLBBA">Icons 8</a> 
          from <a href="https://icons8.com/illustrations">Ouch!</a>
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <span className="inputSpan">
          <label htmlFor="email">E-mail</label>
          <input name="email" type="email" placeholder="Digite seu email" required />
        </span>
        <span className="inputSpan">
          <label htmlFor="senha">Senha</label>
          <input name="senha" type="password" placeholder="Digite sua senha" required />
        </span>
        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}

export default Login;

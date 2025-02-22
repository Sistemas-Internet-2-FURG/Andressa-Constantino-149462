import axios from "axios";
import "../login.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/register", Object.fromEntries(formData));
      console.log("Cadastro bem-sucedido:", response.data);
      navigate("/login")
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro no registro");
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
        <h1>Cadastrar</h1>
        <span className="inputSpan">
          <label htmlFor="nome">Nome</label>
          <input name="nome" type="text" placeholder="Digite seu nome completo" required />
        </span>
        <span className="inputSpan">
          <label htmlFor="email">E-mail</label>
          <input name="email" type="email" placeholder="Digite seu email" required />
        </span>
        <span className="inputSpan">
          <label htmlFor="senha">Senha</label>
          <input name="senha" type="password" placeholder="Digite sua senha" required />
        </span>
        <button type="submit">Cadastrar</button>
      </form>
    </main>
  );
}

export default Register;

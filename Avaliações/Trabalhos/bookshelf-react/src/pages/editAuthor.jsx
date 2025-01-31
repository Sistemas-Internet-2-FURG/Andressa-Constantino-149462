import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles.css";

function EditAuthor() {
  const { id } = useParams();
  const [author, setAuthor] = useState({ nome: "", email: "", senha: "" });

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/autores/${id}`)
      .then((response) => setAuthor(response.data))
      .catch((error) => console.error("Erro ao buscar autor:", error));
  }, [id]);

  const handleChange = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://127.0.0.1:5000/api/editar_autor/${id}`, author);
      alert("Autor atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar autor:", error);
    }
  };

  return (
    <div>
      <header>
        <img src="../static/logo-icon.png" alt="Logo" />
        <h1>BookShelf</h1>
      </header>
      <main>
        <div id="formBox">
          <form onSubmit={handleSubmit}>
            <h3>Editar Autor</h3>
            <label htmlFor="nome">Nome:</label>
            <input type="text" id="nome" name="nome" value={author.nome} onChange={handleChange} required />
            <input type="email" id="email" name="email" value={author.email} onChange={handleChange} required />
            <input type="password" id="senha" name="senha" value={author.senha} onChange={handleChange} required />
            <input type="submit" value="Salvar" />
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditAuthor;
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles.css";
import { useNavigate } from "react-router-dom";

function EditAuthor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [author, setAuthor] = useState({ nome: "", email: "", senha: "" });

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/autores")
      .then((response) => {
        const autorEncontrado = response.data.find((autor) => autor.id === Number(id));
        if (autorEncontrado) setAuthor(autorEncontrado);
      })
      .catch((error) => console.error("Erro ao buscar livros:", error));
  }, [id]);

  const handleChange = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/autores/${id}`, author);
      alert("Autor atualizado com sucesso!");
      navigate("/index")
    } catch (error) {
      console.error("Erro ao atualizar autor:", error);
    }
  };

  return (
    <div>
      <main>
        <div id="formBox">
          <form onSubmit={handleSubmit}>
            <h3>Editar Autor</h3>
            <label htmlFor="nome">Nome:</label>
            <input type="text" id="nome" name="nome" value={author.nome} onChange={handleChange} required />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={author.email} onChange={handleChange} required />
            <label htmlFor="senha">Senha:</label>
            <input type="password" id="senha" name="senha" value={author.senha} onChange={handleChange} required />
            <input type="submit" value="Salvar" />
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditAuthor;
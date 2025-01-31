import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({ nome: "", autor_nome: "", editora: "" });
  const [editors, setEditors] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/livros/${id}`)
      .then(response => setBook(response.data))
      .catch(error => console.error("Erro ao buscar livro:", error));

    axios.get("http://127.0.0.1:5000/api/editoras")
      .then(response => setEditors(response.data))
      .catch(error => console.error("Erro ao buscar editoras:", error));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/editar_livro/${id}`, book);
      navigate("/");
    } catch (error) {
      console.error("Erro ao editar livro:", error);
    }
  };

  return (
    <main>
      <div id="formBox">
        <form onSubmit={handleSubmit}>
          <h3>Editar Livro</h3>
          <label htmlFor="nome">Nome:</label>
          <input 
            type="text" 
            id="nome" 
            name="nome" 
            value={book.nome} 
            onChange={(e) => setBook({ ...book, nome: e.target.value })} 
          />

          <label htmlFor="autor">Autor:</label>
          <input type="text" id="autor" name="autor" value={book.autor_nome} readOnly />

          <label htmlFor="editora">Editora:</label>
          <select 
            id="editora" 
            name="editora" 
            value={book.editora}
            onChange={(e) => setBook({ ...book, editora: e.target.value })}
          >
            {editors.map(editora => (
              <option key={editora.id} value={editora.id}>
                {editora.nome}
              </option>
            ))}
          </select>

          <input type="submit" value="Salvar" />
        </form>
      </div>
    </main>
  );
}

export default EditBook;
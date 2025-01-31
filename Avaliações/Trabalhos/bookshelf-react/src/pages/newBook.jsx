import { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";
import { useNavigate } from "react-router-dom";

function NewBook() {
  const navigate = useNavigate();
  const [editors, setEditors] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [bookName, setBookName] = useState("");
  const [selectedEditor, setSelectedEditor] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/editoras")
      .then((response) => setEditors(response.data))
      .catch((error) => console.error("Erro ao buscar editoras:", error));
    
    axios.get("http://127.0.0.1:5000/api/autores")
      .then((response) => setAuthors(response.data))
      .catch((error) => console.error("Erro ao buscar autores:", error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { nome: bookName, autor: selectedAuthor, editora: selectedEditor };
    
    try {
      await axios.post("http://127.0.0.1:5000/api/livros", formData);
      alert("Livro cadastrado com sucesso!");
      navigate("/index")
    } catch (error) {
      console.error("Erro ao cadastrar livro:", error);
      alert("Erro ao cadastrar livro");
    }
  };

  return (
    <div>
      <main>
        <div id="formBox">
          <form onSubmit={handleSubmit}>
            <h3>Cadastrar Livro</h3>
            <label htmlFor="nome">Nome:</label>
            <input 
              type="text" 
              id="nome" 
              name="nome" 
              placeholder="Digite o nome do livro" 
              value={bookName} 
              onChange={(e) => setBookName(e.target.value)} 
              required
            />
            
            <label htmlFor="autor">Autor:</label>
            <select 
              id="autor" 
              name="autor" 
              value={selectedAuthor} 
              onChange={(e) => setSelectedAuthor(e.target.value)}
              required
            >
              <option value="">Selecione um autor</option>
              {authors.map((autor) => (
                <option key={autor.id} value={autor.id}>{autor.nome}</option>
              ))}
            </select>
            
            <label htmlFor="editora">Editora:</label>
            <select 
              id="editora" 
              name="editora" 
              value={selectedEditor} 
              onChange={(e) => setSelectedEditor(e.target.value)}
              required
            >
              <option value="">Selecione uma editora</option>
              {editors.map((editora) => (
                <option key={editora.id} value={editora.id}>{editora.nome}</option>
              ))}
            </select>
            
            <input type="submit" value="Enviar" />
          </form>
        </div>
      </main>
    </div>
  );
}

export default NewBook;
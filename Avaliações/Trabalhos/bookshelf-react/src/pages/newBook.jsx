import { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

function NewBook() {
  const [editors, setEditors] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [bookName, setBookName] = useState("");
  const [selectedEditor, setSelectedEditor] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/editoras")
      .then((response) => setEditors(response.data))
      .catch((error) => console.error("Erro ao buscar editoras:", error));
    
    axios.get("http://127.0.0.1:5000/api/autor_logado")
      .then((response) => setAuthorName(response.data.nome))
      .catch((error) => console.error("Erro ao buscar autor logado:", error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { nome: bookName, autor: authorName, editora: selectedEditor };
    
    try {
      await axios.post("http://127.0.0.1:5000/api/adicionar_livro", formData);
      alert("Livro cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar livro:", error);
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
            <input 
              type="text" 
              id="autor" 
              name="autor" 
              value={authorName} 
              readOnly
            />
            
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
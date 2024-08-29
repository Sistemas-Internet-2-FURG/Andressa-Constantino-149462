from flask import Flask, render_template, request, redirect, url_for
import mysql.connector
from config import MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB

app = Flask(__name__)

def get_db_connection():
    return mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB
    )

@app.route('/')
def index():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Consulta para obter informações de livros
    query_livros = '''
    SELECT l.id, l.nome, l.autor, l.editora, 
           a.nome AS autor_nome, 
           e.nome AS editora_nome
    FROM livros l
    LEFT JOIN autores a ON l.autor = a.id
    LEFT JOIN editoras e ON l.editora = e.id
    '''
    cursor.execute(query_livros)
    livros = cursor.fetchall()

    # Consulta para obter as informações de autores
    query_autores = 'SELECT id, nome, livros_count FROM autores'
    cursor.execute(query_autores)
    autores = cursor.fetchall()
    
    # Consulta para obter as informações de editoras
    query_editoras = 'SELECT id, nome, livros_count FROM editoras'
    cursor.execute(query_editoras)
    editoras = cursor.fetchall()

    cursor.close()
    conn.close()
    
    return render_template('index.html', livros=livros, autores=autores, editoras=editoras)

#livros
@app.route('/newBook', methods=('GET', 'POST'))
def adicionar_livro():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        nome = request.form['nome']
        autor = request.form['autor']
        editora = request.form['editora']
        
        cursor.execute('INSERT INTO livros (nome, autor, editora) VALUES (%s, %s, %s)',
                       (nome, autor, editora))
        conn.commit()
        return redirect(url_for('index'))
    else:
        # Consultar as tabelas necessárias
        cursor.execute('SELECT * FROM autores')
        autores = cursor.fetchall()
        cursor.execute('SELECT * FROM editoras')
        editoras = cursor.fetchall()

        cursor.close()
        conn.close()

        # Enviar os resultados para o template
        return render_template('newBook.html', autores=autores, editoras=editoras)


@app.route('/editBook/<int:id>', methods=('GET', 'POST'))
def editar_livro(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        nome = request.form['nome']
        autor = request.form['autor']
        editora = request.form['editora']
        
        cursor.execute('UPDATE livros SET nome = %s, autor = %s, editora = %s WHERE id = %s',
                       (nome, autor, editora, id))
        conn.commit()
        return redirect(url_for('index'))
    else:
        # Consultar as tabelas necessárias
        cursor.execute('SELECT * FROM livros')
        livros = cursor.fetchall()
        cursor.execute('SELECT * FROM autores')
        autores = cursor.fetchall()
        cursor.execute('SELECT * FROM editoras')
        editoras = cursor.fetchall()

        # Buscar o livro atual
        cursor.execute('SELECT * FROM livros WHERE id = %s', (id,))
        livro = cursor.fetchone()

        cursor.close()
        conn.close()

        # Enviar os resultados para o template
        return render_template('editBook.html', livro=livro, autores=autores, editoras=editoras)


@app.route('/excluir_livro/<int:id>', methods=('POST',))
def excluir_livro(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM livros WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return redirect(url_for('index'))

#autores
@app.route('/newAuthor', methods=('GET', 'POST'))
def adicionar_autor():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        nome = request.form['nome']
        
        cursor.execute('INSERT INTO autores (nome) VALUES (%s)',
                       (nome,))
        conn.commit()
        return redirect(url_for('index'))
    else:
        cursor.close()
        conn.close()

        # Enviar os resultados para o template
        return render_template('newAuthor.html')


@app.route('/editAuthor/<int:id>', methods=('GET', 'POST'))
def editar_autor(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        nome = request.form['nome']
        
        cursor.execute('UPDATE autores SET nome = %s WHERE id = %s',
                       (nome, id))
        conn.commit()
        return redirect(url_for('index'))
    else:
        # Buscar o autor atual
        cursor.execute('SELECT * FROM autores WHERE id = %s', (id,))
        autor = cursor.fetchone()

        cursor.close()
        conn.close()

        # Enviar os resultados para o template
        return render_template('editAuthor.html', autor=autor)


@app.route('/excluir_autor/<int:id>', methods=('POST',))
def excluir_autor(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM autores WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return redirect(url_for('index'))

#editoras
@app.route('/newEditor', methods=('GET', 'POST'))
def adicionar_editora():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        nome = request.form['nome']
        
        cursor.execute('INSERT INTO editoras (nome) VALUES (%s)',
                       (nome,))
        conn.commit()
        return redirect(url_for('index'))
    else:
        cursor.close()
        conn.close()
        # Enviar os resultados para o template
        return render_template('newEditor.html')


@app.route('/editEditor/<int:id>', methods=('GET', 'POST'))
def editar_editora(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        nome = request.form['nome']
        
        cursor.execute('UPDATE editoras SET nome = %s WHERE id = %s',
                       (nome, id))
        conn.commit()
        return redirect(url_for('index'))
    else:
        # Buscar a editora atual
        cursor.execute('SELECT * FROM editoras WHERE id = %s', (id,))
        editora = cursor.fetchone()

        cursor.close()
        conn.close()

        # Enviar os resultados para o template
        return render_template('editEditor.html', editora=editora)


@app.route('/excluir_editora/<int:id>', methods=('POST',))
def excluir_editora(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM editoras WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
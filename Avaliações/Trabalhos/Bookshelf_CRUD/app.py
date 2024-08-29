from flask import Flask, render_template, request, redirect, url_for, session, flash
import mysql.connector
from config import MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB

import secrets
secret_key = secrets.token_hex(16)
app = Flask(__name__)
app.secret_key = secret_key

def get_db_connection():
    return mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB
    )

@app.route('/', methods=('GET', 'POST'))
def login():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        email = request.form['email']
        senha = request.form['senha']

        cursor.execute('SELECT id, nome FROM autores WHERE email = %s AND senha = %s', (email, senha))
        autor = cursor.fetchone()
        
        if autor:
            session['autor_id'] = autor['id']
            session['autor_nome'] = autor['nome']
            return redirect(url_for('index'))
        else:
            return render_template('login.html', error='Credenciais inválidas.')
    
    return render_template('login.html')

@app.route('/register', methods=('GET', 'POST'))
def registrar():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        email = request.form['email']
        senha = request.form['senha']
        nome = request.form['nome']

        cursor.execute('INSERT INTO autores (nome, email, senha) VALUES (%s, %s, %s)',
                       (nome, email, senha))
        conn.commit()
        cursor.close()
        conn.close()
        return redirect(url_for('login'))
    else:
        cursor.close()
        conn.close()
        return render_template('register.html')

@app.route('/logout')
def sair():
    session.clear()
    return redirect(url_for('login'))

@app.route('/home')
def index():
    if 'autor_id' not in session:
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
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

    query_autores = 'SELECT id, nome, livros_count FROM autores'
    cursor.execute(query_autores)
    autores = cursor.fetchall()
    
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
        autor_id = session.get('autor_id')
        editora = request.form['editora']
        
        cursor.execute('INSERT INTO livros (nome, autor, editora) VALUES (%s, %s, %s)',
                       (nome, autor_id, editora))
        conn.commit()
        return redirect(url_for('index'))
    else:
        cursor.execute('SELECT * FROM editoras')
        editoras = cursor.fetchall()

        autor_id = session.get('autor_id')
        autor_logado_nome = None
        if autor_id:
            cursor.execute('SELECT nome FROM autores WHERE id = %s', (autor_id,))
            autor = cursor.fetchone()
            autor_logado_nome = autor['nome'] if autor else 'Desconhecido'

        cursor.close()
        conn.close()

        return render_template('newBook.html', editoras=editoras, autor_logado_nome=autor_logado_nome)


@app.route('/editBook/<int:id>', methods=('GET', 'POST'))
def editar_livro(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        nome = request.form['nome']
        editora = request.form['editora']
        
        cursor.execute('UPDATE livros SET nome = %s, editora = %s WHERE id = %s',
                       (nome, editora, id))
        conn.commit()
        return redirect(url_for('index'))
    else:
        cursor.execute('SELECT * FROM editoras')
        editoras = cursor.fetchall()

        cursor.execute('SELECT l.id, l.nome, l.editora, a.nome AS autor_nome '
                       'FROM livros l '
                       'LEFT JOIN autores a ON l.autor = a.id '
                       'WHERE l.id = %s', (id,))
        livro = cursor.fetchone()

        cursor.close()
        conn.close()

        return render_template('editBook.html', livro=livro, editoras=editoras)



@app.route('/excluir_livro/<int:id>', methods=('POST',))
def excluir_livro(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM livros WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return redirect(url_for('index'))


@app.route('/editAuthor/<int:id>', methods=('GET', 'POST'))
def editar_autor(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        nome = request.form['nome']
        email = request.form['email']
        senha = request.form['senha']
        
        cursor.execute('UPDATE autores SET nome = %s, email = %s, senha = %s WHERE id = %s',
                       (nome, email, senha, id))
        conn.commit()
        return redirect(url_for('index'))
    else:
        cursor.execute('SELECT * FROM autores WHERE id = %s', (id,))
        autor = cursor.fetchone()

        cursor.close()
        conn.close()

        return render_template('editAuthor.html', autor=autor)



@app.route('/excluir_autor/<int:id>', methods=('POST',))
def excluir_autor(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM autores WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return redirect(url_for('sair'))

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
        cursor.execute('SELECT * FROM editoras WHERE id = %s', (id,))
        editora = cursor.fetchone()

        cursor.close()
        conn.close()

        return render_template('editEditor.html', editora=editora)


@app.route('/excluir_editora/<int:id>', methods=('POST',))
def excluir_editora(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM livros WHERE editora = %s', (id,))
    livro_count = cursor.fetchone()[0]
    
    if livro_count > 0:
        cursor.close()
        conn.close()
        return redirect(url_for('index', error='Não é possível excluir a editora porque há livros associados a ela'))
    
    cursor.execute('DELETE FROM editoras WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
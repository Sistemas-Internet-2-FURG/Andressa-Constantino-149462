import os
from flask import Flask, render_template, redirect, url_for
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from app.models import db
from app.controllers import auth_controller, livros_controller, editoras_controller, autores_controller


def create_app():
    load_dotenv()  # Carrega o .env automaticamente
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DB')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret_key')

    db.init_app(app)

    # Rotas de autenticação
    @app.route('/api/login', methods=['POST'])
    def login():
        response, status_code = auth_controller.login()
        if status_code == 200:
            return redirect(url_for('index'))
        else:
            return redirect(url_for('login_page'))
        
    @app.route('/api/register', methods=['POST'])
    def register():
        response, status_code = auth_controller.register()
        if status_code == 201:  # Se o status for de sucesso
            return redirect(url_for('login_page'))
        else:
            return redirect(url_for('register_page'))



    # Rotas de livros
    @app.route('/api/livros', methods=['GET'])
    def get_livros():
        return livros_controller.get_livros()

    @app.route('/api/livros', methods=['POST'])
    def create_livro():
        return livros_controller.create_livro()

    @app.route('/api/livros/<int:livro_id>', methods=['PUT'])
    def update_livro(livro_id):
        return livros_controller.update_livro(livro_id)

    @app.route('/api/livros/<int:livro_id>', methods=['DELETE'])
    def delete_livro(livro_id):
        return livros_controller.delete_livro(livro_id)

    # Rotas de autores
    @app.route('/api/autores', methods=['GET'])
    def get_autores():
        return autores_controller.get_autores()

    @app.route('/api/autores/<int:autor_id>', methods=['PUT'])
    def update_autor(autor_id):
        return autores_controller.update_autor(autor_id)

    @app.route('/api/autores/<int:autor_id>', methods=['DELETE'])
    def delete_autor(autor_id):
        return autores_controller.delete_autor(autor_id)

    # Rotas de editoras
    @app.route('/api/editoras', methods=['GET'])
    def get_editoras():
        return editoras_controller.get_editoras()

    @app.route('/api/editoras', methods=['POST'])
    def create_editora():
        return editoras_controller.create_editora()

    @app.route('/api/editoras/<int:editora_id>', methods=['PUT'])
    def update_editora(editora_id):
        return editoras_controller.update_editora(editora_id)

    @app.route('/api/editoras/<int:editora_id>', methods=['DELETE'])
    def delete_editora(editora_id):
        return editoras_controller.delete_editora(editora_id)
    
    #renderizar paginas
    @app.route('/login', methods=['GET'])
    def login_page():
        return render_template('login.html')
    @app.route('/register', methods=['GET'])
    def register_page():
        return render_template('register.html')
    @app.route('/index')
    def index():
        return render_template('index.html') 
    return app

import os
from flask import Flask, render_template, redirect, url_for, jsonify, request
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
        
    # Rotas de livros
    @app.route('/api/livros', methods=['GET'])
    def get_livros():
        return livros_controller.get_livros()

    @app.route('/api/livros', methods=['POST'])
    def adicionar_livro():
        return livros_controller.adicionar_livro()

    @app.route('/api/livros/<int:livro_id>', methods=['PUT'])
    def editar_livro(livro_id):
        return livros_controller.editar_livro(livro_id)

    @app.route('/api/livros/<int:livro_id>', methods=['DELETE'])
    def excluir_livro(livro_id):
        return livros_controller.excluir_livro(livro_id)

    # Rotas de autores
    @app.route('/api/autores', methods=['GET'])
    def get_autores():
        return autores_controller.get_autores()

    @app.route('/api/autores/<int:autor_id>', methods=['PUT'])
    def editar_autor(autor_id):
        return autores_controller.editar_autor(autor_id)

    @app.route('/api/autores/<int:autor_id>', methods=['DELETE'])
    def excluir_autor(autor_id):
        return autores_controller.excluir_autor(autor_id)

    # Rotas de editoras
    @app.route('/api/editoras', methods=['GET'])
    def get_editoras():
        return editoras_controller.get_editoras()

    @app.route('/api/editoras', methods=['POST'])
    def adicionar_editora():
        return editoras_controller.adicionar_editora()

    @app.route('/api/editoras/<int:editora_id>', methods=['PUT'])
    def editar_editora(editora_id):
        return editoras_controller.editar_editora(editora_id)

    @app.route('/api/editoras/<int:editora_id>', methods=['DELETE'])
    def excluir_editora(editora_id):
        return editoras_controller.excluir_editora(editora_id)

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'GET':
            return render_template('login.html')
        
        # POST
        data = request.get_json()
        email = data.get('email')
        password = data.get('senha')

        response, status_code = auth_controller.login()

        if status_code == 200:
            return jsonify({'status': 'success', 'redirect': url_for('index')}), 200
        return jsonify({'status': 'error', 'message': 'Credenciais inválidas'}), 401


    @app.route('/register', methods=['GET', 'POST'])
    def register():
        if request.method == 'GET':
            return render_template('register.html')
        
        response, status_code = auth_controller.register()
        
        if status_code == 201:
            return jsonify({"status": "success", "redirect": url_for('login')})
        else:
            return jsonify({"status": "error", "error": response['error']}), status_code



    @app.route('/index', methods=['GET'], endpoint='index')
    def index():
        return render_template('index.html') 

    return app


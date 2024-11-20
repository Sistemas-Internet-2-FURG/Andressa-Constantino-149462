import os
from flask import Flask
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
        return auth_controller.login()

    @app.route('/api/register', methods=['POST'])
    def register():
        return auth_controller.register()

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

    return app

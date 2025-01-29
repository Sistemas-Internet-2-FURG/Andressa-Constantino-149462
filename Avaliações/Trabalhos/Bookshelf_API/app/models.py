from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Autor(db.Model):
    __tablename__ = 'autores'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)

class Livro(db.Model):
    __tablename__ = 'livros'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    autor_id = db.Column(db.Integer, db.ForeignKey('autores.id'), nullable=False)
    editora_id = db.Column(db.Integer, db.ForeignKey('editoras.id'), nullable=True)

class Editora(db.Model):
    __tablename__ = 'editoras'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)

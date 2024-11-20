from app.routes import create_app  # Importa a função create_app do arquivo routes.py

app = create_app()  # Cria o aplicativo Flask

if __name__ == '__main__':
    app.run(debug=True)  # Roda o aplicativo no modo debug

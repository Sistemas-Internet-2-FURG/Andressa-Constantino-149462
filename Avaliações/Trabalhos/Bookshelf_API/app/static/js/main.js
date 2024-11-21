document.addEventListener('DOMContentLoaded', function () {
    // Handle login form submission
    const loginForm = document.querySelector('form[action="{{ url_for("login") }}"]');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(loginForm);

            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });

            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Certificando-se de que o Content-Type está correto
                },
                body: JSON.stringify(jsonData),  // Convertendo os dados para JSON
            })
                .then(response => response.json())  // Certificando-se de que a resposta é tratada como JSON
                .then(data => {
                    if (data.token) {  // Verifica se o token foi retornado
                        window.location.href = '/index';  // Redireciona para a página inicial após login
                    } else {
                        alert('Credenciais inválidas');
                        window.location.href = '/login';  // Redireciona para login em caso de falha
                    }
                })
                .catch(err => console.error('Erro:', err));
        });
    }





    const registerForm = document.querySelector('form[action="{{ url_for("register") }}"]');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
    
            // Criando um objeto JSON com os dados do formulário
            const jsonData = {
                nome: registerForm.querySelector('input[name="nome"]').value,
                email: registerForm.querySelector('input[name="email"]').value,
                senha: registerForm.querySelector('input[name="senha"]').value
            };
    
            // Enviando a requisição para o backend
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Definindo o tipo do conteúdo como JSON
                },
                body: JSON.stringify(jsonData),  // Convertendo o objeto para JSON
            })
            .then(response => response.json())  // Espera a resposta no formato JSON
            .then(data => {
                if (data.message) {  // Se o registro foi bem-sucedido
                    window.location.href = '/login';  // Redireciona para login
                } else {
                    alert(data.error || 'Erro no cadastro');
                }
            })
            .catch(err => console.error('Erro:', err));
        });
    }
    


    // Handle book form submissions
    const bookForms = document.querySelectorAll('form[action="{{ url_for("adicionar_livro") }}"], form[action="{{ url_for("editar_livro") }}"]');
    bookForms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(form);
            const method = form.method.toUpperCase();
            const url = form.action;

            fetch(url, {
                method: method,
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = '/';
                    } else {
                        alert('Erro ao salvar livro');
                    }
                })
                .catch(err => console.error('Erro:', err));
        });
    });

    // Handle author and editor form submissions
    const authorEditorForms = document.querySelectorAll('form[action="{{ url_for("editar_autor") }}"], form[action="{{ url_for("editar_editora") }}"], form[action="{{ url_for("adicionar_editora") }}"]');
    authorEditorForms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(form);
            const method = form.method.toUpperCase();
            const url = form.action;

            fetch(url, {
                method: method,
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = '/';
                    } else {
                        alert('Erro ao salvar dados');
                    }
                })
                .catch(err => console.error('Erro:', err));
        });
    });

    // Handle delete operations
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const form = button.closest('form');
            fetch(form.action, {
                method: 'POST',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        form.closest('li').remove();
                    } else {
                        alert('Erro ao excluir item');
                    }
                })
                .catch(err => console.error('Erro:', err));
        });
    });
});

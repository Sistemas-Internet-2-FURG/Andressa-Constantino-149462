document.addEventListener('DOMContentLoaded', function () {
    // Handle login form submission
    const loginForm = document.querySelector('form[action="{{ url_for("login") }}"]');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(loginForm);
            fetch('/api/login', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = '/';
                    } else {
                        alert('Credenciais inválidas');
                    }
                })
                .catch(err => console.error('Erro:', err));
        });
    }

    // Handle registration form submission
    const registerForm = document.querySelector('form[action="{{ url_for("registrar") }}"]');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(registerForm);
            fetch('/api/register', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = '/login';
                    } else {
                        alert('Erro no cadastro');
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

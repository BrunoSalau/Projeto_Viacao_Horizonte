/**
 * Login.js
 * Script para gerenciar funcionalidades do formulário de login
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const form = document.getElementById('loginForm');
    const cpfInput = document.getElementById('cpf');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const rememberCheckbox = document.getElementById('remember');
    const loginBtn = form.querySelector('.btn-login');

    // ===================================
    // TOGGLE DE VISIBILIDADE DA SENHA
    // ===================================
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // ===================================
    // MÁSCARA DE CPF
    // ===================================
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limita a 11 dígitos
            value = value.slice(0, 11);
            
            // Formata: XXX.XXX.XXX-XX
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value.replace(/(\d{1,3})/, '$1');
                } else if (value.length <= 6) {
                    value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
                } else if (value.length <= 9) {
                    value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
                } else {
                    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
                }
            }
            
            e.target.value = value;
        });
    }

    // ===================================
    // VALIDAÇÃO DE CPF
    // ===================================
    function validarCPF(cpf) {
        // Remove a máscara
        const cpfLimpo = cpf.replace(/\D/g, '');
        
        // Verifica se tem 11 dígitos
        if (cpfLimpo.length !== 11) {
            return false;
        }
        
        // Verifica se não é uma sequência repetida
        if (/^(\d)\1{10}$/.test(cpfLimpo)) {
            return false;
        }
        
        // Validação do primeiro dígito verificador
        let soma = 0;
        let resto;
        
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) {
            resto = 0;
        }
        if (resto !== parseInt(cpfLimpo.substring(9, 10))) {
            return false;
        }
        
        // Validação do segundo dígito verificador
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) {
            resto = 0;
        }
        if (resto !== parseInt(cpfLimpo.substring(10, 11))) {
            return false;
        }
        
        return true;
    }

    // ===================================
    // RECUPERAR DADOS DO LOCALSTORAGE
    // ===================================
    function recuperarDadosArmazenados() {
        const cpfArmazenado = localStorage.getItem('viacao_horizonte_cpf');
        
        if (cpfArmazenado) {
            cpfInput.value = cpfArmazenado;
            rememberCheckbox.checked = true;
        }
    }

    // ===================================
    // SUBMISSÃO DO FORMULÁRIO
    // ===================================
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const cpf = cpfInput.value.trim();
        const password = passwordInput.value.trim();

        // Validações
        if (!cpf) {
            exibirErro('Por favor, insira seu CPF');
            cpfInput.focus();
            return;
        }

        if (!validarCPF(cpf)) {
            exibirErro('CPF inválido. Por favor, verifique');
            cpfInput.focus();
            cpfInput.select();
            return;
        }

        if (!password) {
            exibirErro('Por favor, insira sua senha');
            passwordInput.focus();
            return;
        }

        if (password.length < 6) {
            exibirErro('Senha deve ter no mínimo 6 caracteres');
            passwordInput.focus();
            return;
        }

        // Armazenar CPF se checkbox estiver marcado
        if (rememberCheckbox.checked) {
            localStorage.setItem('viacao_horizonte_cpf', cpf);
        } else {
            localStorage.removeItem('viacao_horizonte_cpf');
        }

        // Desabilita o botão durante o envio
        loginBtn.disabled = true;
        const textoOriginal = loginBtn.innerHTML;
        loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Entrando...';

        try {
            // Simula o envio do formulário
            // Substitua por sua chamada AJAX/Fetch real
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cpf: cpf.replace(/\D/g, ''),
                    password: password,
                    remember: rememberCheckbox.checked
                })
            });

            if (response.ok) {
                exibirSucesso('Login realizado com sucesso!');
                setTimeout(() => {
                    // Redirecionar para página principal
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                const data = await response.json();
                exibirErro(data.message || 'Erro ao fazer login. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            exibirErro('Erro de conexão. Por favor, tente novamente.');
        } finally {
            // Reabilita o botão
            loginBtn.disabled = false;
            loginBtn.innerHTML = textoOriginal;
        }
    });

    // ===================================
    // FUNÇÃO PARA EXIBIR MENSAGEM DE ERRO
    // ===================================
    function exibirErro(mensagem) {
        // Remove alertas anteriores
        removerAlerts();

        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.setAttribute('role', 'alert');
        alert.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Insere o alert antes do formulário
        form.insertAdjacentElement('beforebegin', alert);

        // Scroll para o alert
        alert.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove automaticamente após 6 segundos
        setTimeout(() => {
            alert.remove();
        }, 6000);
    }

    // ===================================
    // FUNÇÃO PARA EXIBIR MENSAGEM DE SUCESSO
    // ===================================
    function exibirSucesso(mensagem) {
        removerAlerts();

        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.setAttribute('role', 'alert');
        alert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        form.insertAdjacentElement('beforebegin', alert);
    }

    // ===================================
    // FUNÇÃO PARA REMOVER ALERTS
    // ===================================
    function removerAlerts() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => alert.remove());
    }

    // ===================================
    // VALIDAÇÃO EM TEMPO REAL
    // ===================================
    cpfInput.addEventListener('blur', function() {
        if (this.value && !validarCPF(this.value)) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    cpfInput.addEventListener('focus', function() {
        this.classList.remove('is-invalid');
    });

    passwordInput.addEventListener('focus', function() {
        this.classList.remove('is-invalid');
    });

    // ===================================
    // INICIALIZAÇÃO
    // ===================================
    recuperarDadosArmazenados();

    // Adiciona estilos para validação
    const style = document.createElement('style');
    style.textContent = `
        .form-control.is-invalid {
            border-color: #ff6b6b;
            box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.15);
        }

        .alert {
            margin-bottom: 20px;
            border-radius: 12px;
            border: 1px solid rgba(255, 215, 0, 0.3);
            background-color: rgba(30, 30, 30, 0.85);
            backdrop-filter: blur(10px);
        }

        .alert-danger {
            color: #ff6b6b;
            border-color: rgba(255, 107, 107, 0.3);
        }

        .alert-success {
            color: #51cf66;
            border-color: rgba(81, 207, 102, 0.3);
        }

        .spinner-border-sm {
            width: 1rem;
            height: 1rem;
            border-width: 0.15em;
        }
    `;
    document.head.appendChild(style);
});

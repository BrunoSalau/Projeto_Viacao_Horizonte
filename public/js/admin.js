let cpfSelecionadoDelete = null;


        function abrirAba(nomeAba) {

            document.querySelectorAll('.tab-content').forEach(el => {
                el.classList.remove('active');
            });
            document.querySelectorAll('.tab-button').forEach(el => {
                el.classList.remove('active');
            });


            document.getElementById(nomeAba).classList.add('active');
            event.target.classList.add('active');


            if (nomeAba === 'listar') {
                carregarSupervisores();
            }
        }


        document.getElementById('cpf').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            if (value.length > 8) {
                value = value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6, 9) + '-' + value.substring(9);
            } else if (value.length > 6) {
                value = value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6);
            } else if (value.length > 3) {
                value = value.substring(0, 3) + '.' + value.substring(3);
            }
            e.target.value = value;
        });


        document.getElementById('formulario').addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const cpf = document.getElementById('cpf').value;
            const telefone = document.getElementById('telefone').value;
            const senha = document.getElementById('senha').value;

            if (!nome || !cpf || !telefone || !senha) {
                mostrarMensagem('Todos os campos são obrigatórios', 'error', 'mensagem-criar');
                return;
            }

            document.getElementById('loading').style.display = 'block';

            try {
                const response = await fetch('/usuario/criarSupervisorAdmin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nome, cpf, telefone, senha
                    })
                });

                const data = await response.json();

                if (data.sucesso) {
                    mostrarMensagem(
                        `✓ Supervisor "${nome}" criado com sucesso!`,
                        'success',
                        'mensagem-criar'
                    );
                    document.getElementById('formulario').reset();
                    setTimeout(() => {
                        abrirAba('listar');
                    }, 1500);
                } else {
                    mostrarMensagem(data.mensagem, 'error', 'mensagem-criar');
                }
            } catch (error) {
                mostrarMensagem('Erro ao criar supervisor: ' + error.message, 'error', 'mensagem-criar');
            } finally {
                document.getElementById('loading').style.display = 'none';
            }
        });


        async function carregarSupervisores() {
            const loading = document.getElementById('loading-lista');
            const container = document.getElementById('supervisores-container');

            loading.style.display = 'block';
            container.innerHTML = '';

            try {
                const response = await fetch('/supervisor/listarSupervisores');
                const data = await response.json();

                loading.style.display = 'none';

                if (data.sucesso && data.dados.length > 0) {
                    container.innerHTML = data.dados.map(item => `
                        <div class="supervisor-card">
                            <div class="supervisor-info">
                                <h3>${item.supervisor.nome}</h3>
                                <p><strong>CPF:</strong> ${item.supervisor.cpf}</p>
                                <p><strong>Telefone:</strong> ${item.supervisor.telefone}</p>
                            </div>
                            <div class="supervisor-actions">
                                <button class="btn-delete" onclick="abrirModalDelete('${item.supervisor.cpf}', '${item.supervisor.nome}')">
                                     Deletar
                                </button>
                            </div>
                        </div>
                    `).join('');
                } else {
                    container.innerHTML = `
                        <div class="empty-state">
                            <p> Nenhum supervisor cadastrado ainda</p>
                        </div>
                    `;
                }
            } catch (error) {
                loading.style.display = 'none';
                container.innerHTML = `
                    <div class="message error">
                        Erro ao carregar supervisores: ${error.message}
                    </div>
                `;
            }
        }


        function abrirModalDelete(cpf, nome) {
            cpfSelecionadoDelete = cpf;
            document.getElementById('nomeSupervisor').textContent = nome;
            document.getElementById('modalDelete').style.display = 'block';
        }

        function fecharModal() {
            document.getElementById('modalDelete').style.display = 'none';
            cpfSelecionadoDelete = null;
        }

        async function confirmarDelete() {
            if (!cpfSelecionadoDelete) return;

            try {
                const response = await fetch('/usuario/deletarUsuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cpf: cpfSelecionadoDelete
                    })
                });

                const data = await response.json();

                fecharModal();

                if (data.sucesso) {
                    mostrarMensagem('✓ ' + data.mensagem, 'success', 'mensagem-listar');
                    setTimeout(() => {
                        carregarSupervisores();
                    }, 1000);
                } else {
                    mostrarMensagem(data.mensagem, 'error', 'mensagem-listar');
                }
            } catch (error) {
                mostrarMensagem('Erro ao deletar supervisor: ' + error.message, 'error', 'mensagem-listar');
                fecharModal();
            }
        }

        
        window.onclick = function(event) {
            const modal = document.getElementById('modalDelete');
            if (event.target === modal) {
                fecharModal();
            }
        }

        
        function mostrarMensagem(texto, tipo, elementId) {
            const div = document.getElementById(elementId);
            div.className = `message ${tipo}`;
            div.textContent = texto;
            setTimeout(() => {
                div.textContent = '';
                div.className = '';
            }, 5000);
        }

        
        function logout() {
            fetch('/usuario/logout', { method: 'POST' })
                .then(() => {
                    window.location.href = '/';
                });
        }

        
        window.addEventListener('load', () => {
            
        });
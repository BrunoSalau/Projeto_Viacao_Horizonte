import { modelViagem } from '../model/viagemModel.js';
import { modelRota } from '../model/rotaModel.js';
import { modelVeiculo } from '../model/veiculoModel.js';
import { modelMotorista } from '../model/motoristaModel.js';
import { modelUsuario } from '../model/usuarioModel.js';

export class controllerViagem {

    static telaViagem(req, res) {
        res.render('viagens');
    }

    // LISTAR VIAGENS COM JOINS
    // Retorna todas as viagens com dados de rota, veículo, motorista e supervisor
    static async listarViagens(req, res) {
        try {
            const viagens = await modelViagem.listarViagens();

            if (!viagens || viagens.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Nenhuma viagem cadastrada.'
                });
            }

            console.log('Listando viagens...');
            return res.status(200).json({
                sucesso: true,
                total: viagens.length,
                dados: viagens
            });

        } catch (error) {
            console.error('Erro ao listar viagens:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao listar viagens.',
                erro: error.message
            });
        }
    }

    // PROCURAR VIAGEM POR ID
    static async procurarViagem(req, res) {
        try {
            const { id } = req.body;

            const viagem = await modelViagem.buscarViagemPorId(id);

            if (!viagem) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Viagem não encontrada.'
                });
            }

            console.log('Viagem buscada:', JSON.stringify(viagem));
            return res.status(200).json({
                sucesso: true,
                dados: viagem
            });

        } catch (error) {
            console.error('Erro ao procurar viagem:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao procurar viagem.',
                erro: error.message
            });
        }
    }

    // CRIAR VIAGEM
    // Requer: id_rota, id_veiculo, id_motorista, data_viagem, horario_viagem
    // Status inicial: 'Agendada'
    static async criarViagem(req, res) {
        try {
            const { id_rota, id_veiculo, id_motorista, data_viagem, horario_viagem} = req.body;

            // Validação: verifica se rota existe
            const rota = await modelRota.buscarRotaPorId(id_rota);
            if (!rota) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Rota não encontrada.'
                });
            }

            // Validação: verifica se veículo existe e não está em manutenção
            const veiculo = await modelVeiculo.buscarVeiculoPorId(id_veiculo);
            if (!veiculo) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Veículo não encontrado.'
                });
            }

            if (veiculo.status && veiculo.status.toLowerCase() === 'manutencao') {
                return res.status(409).json({
                    sucesso: false,
                    mensagem: 'Este veículo está em manutenção e não pode ser utilizado.'
                });
            }

            // Validação: verifica se motorista existe
            const motorista = await modelMotorista.buscarMotoristaPorId(id_motorista);
            if (!motorista) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Motorista não encontrado.'
                });
            }


            // Cria a viagem com status inicial 'Agendada'
            const novaViagem = await modelViagem.criarViagem(id_veiculo, id_rota, id_motorista, data_viagem, horario_viagem);

            console.log(`Viagem ${novaViagem.id} agendada com sucesso!`);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Viagem agendada com sucesso!',
                dados: novaViagem
            });

        } catch (error) {
            console.error('Erro ao criar viagem:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao agendar viagem.',
                erro: error.message
            });
        }
    }

    // ALTERAR STATUS DA VIAGEM
    // Motorista: pode ir de Agendada → Em andamento, ou Em andamento → Finalizada
    // Supervisor: pode ir de Agendada → Cancelada
    static async alterarStatusViagem(req, res) {
        try {
            const { id, novoStatus, tipoUsuario } = req.body;

            // Busca a viagem
            const viagemAtual = await modelViagem.buscarStatusViagem(id);

            if (!viagemAtual) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Viagem não encontrada.'
                });
            }

            const statusAtual = viagemAtual.status;

            // Validação: regras de transição de status
            const statusValido = validarTransicaoStatus(statusAtual, novoStatus, tipoUsuario);

            if (!statusValido) {
                return res.status(409).json({
                    sucesso: false,
                    mensagem: 'Esta transição de status não é permitida.'
                });
            }

            // Atualiza o status
            const viagemAtualizada = await modelViagem.alterarStatusViagem(id, novoStatus);

            console.log(`Viagem ${id} alterada de ${statusAtual} para ${novoStatus}`);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Status da viagem atualizado com sucesso.',
                dados: viagemAtualizada
            });

        } catch (error) {
            console.error('Erro ao alterar status:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao alterar status da viagem.',
                erro: error.message
            });
        }
    }

    // DELETAR VIAGEM
    static async deletarViagem(req, res) {
        try {
            const { id } = req.body;

            const viagem = await modelViagem.deletarViagem(id);

            if (!viagem) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Viagem não encontrada.'
                });
            }

            console.log(`Viagem ${id} deletada com sucesso!`);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Viagem cancelada com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao deletar viagem:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao deletar viagem.',
                erro: error.message
            });
        }
    }

    // ATUALIZAR VIAGEM (apenas dados, não status)
    static async atualizarViagem(req, res) {
        try {
            const { id, id_rota, id_veiculo, id_motorista, data_viagem, horario_viagem } = req.body;

            // Busca os dados atuais da viagem para não sobrescrever com nulo
            const viagemAtual = await modelViagem.buscarViagemPorId(id);

            if (!viagemAtual) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Viagem não encontrada.'
                });
            }

            // Validações: se novo valor foi informado, valida existência
            if (id_rota) {
                const rota = await modelRota.buscarRotaPorId(id_rota);
                if (!rota) {
                    return res.status(404).json({
                        sucesso: false,
                        mensagem: 'Rota não encontrada.'
                    });
                }
            }

            if (id_veiculo) {
                const veiculo = await modelVeiculo.buscarVeiculoPorId(id_veiculo);
                if (!veiculo) {
                    return res.status(404).json({
                        sucesso: false,
                        mensagem: 'Veículo não encontrado.'
                    });
                }
                if (veiculo.status && veiculo.status.toLowerCase() === 'manutencao') {
                    return res.status(409).json({
                        sucesso: false,
                        mensagem: 'Este veículo está em manutenção.'
                    });
                }
            }

            if (id_motorista) {
                const motorista = await modelMotorista.buscarMotoristaPorId(id_motorista);
                if (!motorista) {
                    return res.status(404).json({
                        sucesso: false,
                        mensagem: 'Motorista não encontrado.'
                    });
                }
            }

            // Monta o payload: usa novo valor se preenchido, senão mantém atual
            const payload = {
                id_rota: id_rota || viagemAtual.id_rota,
                id_veiculo: id_veiculo || viagemAtual.id_veiculo,
                id_motorista: id_motorista || viagemAtual.id_motorista,
                data_viagem: data_viagem || viagemAtual.data_viagem,
                horario_viagem: horario_viagem || viagemAtual.horario_viagem
            };

            const viagem = await modelViagem.atualizarViagem(
                id,
                payload.id_rota,
                payload.id_veiculo,
                payload.id_motorista,
                payload.data_viagem,
                payload.horario_viagem
            );

            console.log(`Viagem ${id} atualizada com sucesso!`);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Viagem atualizada com sucesso!',
                dados: viagem
            });

        } catch (error) {
            console.error('Erro ao atualizar viagem:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao atualizar viagem.',
                erro: error.message
            });
        }
    }

    // LISTAR ROTAS DISPONÍVEIS (para select no modal)
    static async listarRotasDisponiveis(req, res) {
        try {
            const rotas = await modelRota.listarRotas();

            if (!rotas || rotas.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Nenhuma rota cadastrada.'
                });
            }

            return res.status(200).json({
                sucesso: true,
                total: rotas.length,
                dados: rotas
            });

        } catch (error) {
            console.error('Erro ao listar rotas:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao listar rotas.',
                erro: error.message
            });
        }
    }

    // LISTAR VEÍCULOS DISPONÍVEIS (para select no modal)
    // Filtra apenas veículos que NÃO estão em manutenção
    static async listarVeiculosDisponiveis(req, res) {
        try {
            const veiculos = await modelVeiculo.listarVeiculos();

            // Filtra apenas os que não estão em manutenção
            const disponíveis = veiculos.filter(v => 
                !v.status || v.status.toLowerCase() !== 'manutencao'
            );

            if (!disponíveis || disponíveis.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Nenhum veículo disponível.'
                });
            }

            return res.status(200).json({
                sucesso: true,
                total: disponíveis.length,
                dados: disponíveis
            });

        } catch (error) {
            console.error('Erro ao listar veículos disponíveis:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao listar veículos.',
                erro: error.message
            });
        }
    }

    // LISTAR MOTORISTAS DISPONÍVEIS (para select no modal)
    static async listarMotoristasDisponiveis(req, res) {
        try {
            const motoristas = await modelMotorista.listarMotoristas();

            if (!motoristas || motoristas.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Nenhum motorista cadastrado.'
                });
            }

            return res.status(200).json({
                sucesso: true,
                total: motoristas.length,
                dados: motoristas
            });

        } catch (error) {
            console.error('Erro ao listar motoristas:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao listar motoristas.',
                erro: error.message
            });
        }
    }
}

// FUNÇÃO AUXILIAR: Valida transição de status
// Motorista: Agendada → Em andamento, ou Em andamento → Finalizada
// Supervisor: Agendada → Cancelada
// Nunca permitir: Finalizada/Cancelada como estado anterior para transições inválidas
function validarTransicaoStatus(statusAtual, novoStatus, tipoUsuario) {
    const transicoes = {
        'Motorista': {
            'Agendada': ['Em andamento'],
            'Em andamento': ['Finalizada']
        },
        'Supervisor': {
            'Agendada': ['Cancelada']
        }
    };

    if (!transicoes[tipoUsuario]) {
        return false;
    }

    const transicoesPossiveis = transicoes[tipoUsuario][statusAtual];
    
    if (!transicoesPossiveis) {
        return false;
    }

    return transicoesPossiveis.includes(novoStatus);
}
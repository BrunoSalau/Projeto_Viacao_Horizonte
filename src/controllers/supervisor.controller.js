import { modelSupervisor } from '../model/supervisorModel.js';
import { modelUsuario } from '../model/usuarioModel.js';

export class controllerSupervisor {

    // LISTAR SUPERVISORES
    static async listarSupervisores(req, res) {
        try {
            const supervisores = await modelSupervisor.listarSupervisores();
            const usuarios = await modelUsuario.listarUsuarios();

            const resultado = supervisores.map((supervisor, index) => {
                const usuario = usuarios.find(u => u.id === supervisor.usuario_id);
                return {
                    indice: index + 1,
                    usuario: usuario
                        ? { id: usuario.id, cpf: usuario.cpf, tipo: usuario.tipo_usuario }
                        : null,
                    supervisor: {
                        nome: supervisor.nome,
                        cpf: supervisor.cpf,
                        telefone: supervisor.telefone
                    }
                };
            });

            return res.status(200).json({
                sucesso: true,
                total: resultado.length,
                dados: resultado
            });

        } catch (error) {
            console.error('Erro ao listar supervisores:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao listar supervisores.',
                erro: error.message
            });
        }
    }

    // BUSCAR SUPERVISOR POR CPF
    static async buscarSupervisor(req, res) {
        try {
            const { cpf } = req.body;

            const supervisores = await modelSupervisor.listarSupervisores();
            const supervisor = supervisores.find(s => s.cpf === cpf);

            if (!supervisor) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Supervisor não encontrado.'
                });
            }

            const usuario = await modelUsuario.buscarUsuarioCPF(cpf);

            return res.status(200).json({
                sucesso: true,
                dados: {
                    usuario: usuario
                        ? { id: usuario.id, cpf: usuario.cpf, tipo: usuario.tipo_usuario }
                        : null,
                    supervisor: {
                        nome: supervisor.nome,
                        cpf: supervisor.cpf,
                        telefone: supervisor.telefone
                    }
                }
            });

        } catch (error) {
            console.error('Erro ao buscar supervisor:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao buscar supervisor.',
                erro: error.message
            });
        }
    }

    // ATUALIZAR SUPERVISOR
    static async atualizarSupervisor(req, res) {
        try {
            const { cpf, nome, telefone } = req.body;

            const supervisores = await modelSupervisor.listarSupervisores();
            const supervisorExistente = supervisores.find(s => s.cpf === cpf);

            if (!supervisorExistente) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Supervisor não encontrado.'
                });
            }

            const supervisorAtualizado = await modelSupervisor.atualizarSupervisor(cpf, nome, telefone);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Supervisor atualizado com sucesso.',
                dados: {
                    nome: supervisorAtualizado.nome,
                    cpf: supervisorAtualizado.cpf,
                    telefone: supervisorAtualizado.telefone
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar supervisor:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao atualizar supervisor.',
                erro: error.message
            });
        }
    }
}

import { modelMotorista } from '../model/motoristaModel.js';
import { modelUsuario } from '../model/usuarioModel.js';

export class controllerMotorista {

    static mostrarTela(req,res){
        res.render('motoristas');
    }

    // LISTAR MOTORISTAS
    static async listarMotoristas(req, res) {
        try {
            const motoristas = await modelMotorista.listarMotoristas();
            const usuarios = await modelUsuario.listarUsuarios();

            const resultado = motoristas.map((motorista, index) => {
                const usuario = usuarios.find(u => u.id === motorista.usuario_id);
                return {
                    indice: index + 1,
                    usuario: usuario
                        ? { id: usuario.id, cpf: usuario.cpf, tipo: usuario.tipo_usuario }
                        : null,
                    motorista: {
                        nome: motorista.nome,
                        cpf: motorista.cpf,
                        cnh: motorista.cnh,
                        telefone: motorista.telefone
                    }
                };
            });

            return res.status(200).json({
                sucesso: true,
                total: resultado.length,
                dados: resultado
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

    // BUSCAR MOTORISTA POR CPF
    static async buscarMotorista(req, res) {
        try {
            const { cpf } = req.body;

            const motoristas = await modelMotorista.listarMotoristas();
            const motorista = motoristas.find(m => m.cpf === cpf);

            if (!motorista) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Motorista não encontrado.'
                });
            }

            const usuario = await modelUsuario.buscarUsuarioCPF(cpf);

            return res.status(200).json({
                sucesso: true,
                dados: {
                    usuario: usuario
                        ? { id: usuario.id, cpf: usuario.cpf, tipo: usuario.tipo_usuario }
                        : null,
                    motorista: {
                        nome: motorista.nome,
                        cpf: motorista.cpf,
                        cnh: motorista.cnh,
                        telefone: motorista.telefone
                    }
                }
            });

        } catch (error) {
            console.error('Erro ao buscar motorista:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao buscar motorista.',
                erro: error.message
            });
        }
    }

    // ATUALIZAR MOTORISTA
    static async atualizarMotorista(req, res) {
        try {
            const { cpf, nome, cnh, telefone } = req.body;

            const motoristas = await modelMotorista.listarMotoristas();
            const motoristaExistente = motoristas.find(m => m.cpf === cpf);

            if (!motoristaExistente) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Motorista não encontrado.'
                });
            }

            const motoristaAtualizado = await modelMotorista.atualizarMotorista(nome, cnh, telefone, cpf);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Motorista atualizado com sucesso.',
                dados: {
                    nome: motoristaAtualizado.nome,
                    cpf: motoristaAtualizado.cpf,
                    cnh: motoristaAtualizado.cnh,
                    telefone: motoristaAtualizado.telefone
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar motorista:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao atualizar motorista.',
                erro: error.message
            });
        }
    }
}

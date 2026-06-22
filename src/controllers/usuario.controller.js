import { modelUsuario } from '../model/usuarioModel.js';
import { modelMotorista } from '../model/motoristaModel.js';
import { modelSupervisor } from '../model/supervisorModel.js';
import jwt from 'jsonwebtoken';

export class controllerUsuario {

    static mostrarInfo(req,res){
        res.json({ dados: req.usuario });
    }

    // CRIAR USUARIO
    static async criarUsuario(req, res) {
        try {
            const info = req.body;

            const usuariosCPF = await modelUsuario.listarUsuarios();

            const cpfRepetido = usuariosCPF.some(usuario => usuario.cpf === info.cpf);

            if (cpfRepetido) {
                return res.status(409).json({
                    sucesso: false,
                    mensagem: 'CPF já cadastrado.'
                });
            }

            if (info.opcao === 'Motorista') {
                if (!info.cnh) {
                    return res.status(400).json({
                        sucesso: false,
                        mensagem: 'Campo CNH não preenchido.'
                    });
                }

                const usuario = await modelUsuario.criarUsuario(info.cpf, info.senha, 'Motorista');
                const motorista = await modelMotorista.criarMotorista(info.nome, info.cpf, info.cnh, info.telefone, usuario.id);

                return res.status(201).json({
                    sucesso: true,
                    mensagem: 'Usuário motorista criado com sucesso.',
                    dados: {
                        usuario: { id: usuario.id, cpf: usuario.cpf, tipo: usuario.tipo_usuario },
                        motorista: { nome: motorista.nome, cpf: motorista.cpf, cnh: motorista.cnh }
                    }
                });
            }

            if (info.opcao === 'Supervisor') {
                const usuario = await modelUsuario.criarUsuario(info.cpf, info.senha, 'Supervisor');
                const supervisor = await modelSupervisor.criarSupervisor(info.nome, info.cpf, info.telefone, usuario.id);

                return res.status(201).json({
                    sucesso: true,
                    mensagem: 'Usuário supervisor criado com sucesso.',
                    dados: {
                        usuario: { id: usuario.id, cpf: usuario.cpf, tipo: usuario.tipo_usuario },
                        supervisor: { nome: supervisor.nome, cpf: supervisor.cpf }
                    }
                });
            }

            return res.status(400).json({
                sucesso: false,
                mensagem: 'Opção de tipo de usuário inválida. Use "Motorista" ou "Supervisor".'
            });

        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao criar usuário.',
                erro: error.message
            });
        }
    }

    // LOGIN
    static async login(req, res) {
        try {
            const { cpfInput, senhaInput } = req.body;

            const cpf = cpfInput.replace(/\D/g, '');
            const senha = senhaInput;

            const usuario = await modelUsuario.buscarUsuarioCPF(cpf);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado.'
                });
            }

            if (senha !== usuario.senha) {
                return res.status(401).json({
                    sucesso: false,
                    mensagem: 'Senha incorreta.'
                });
            }

            let userName;
            if(usuario.tipo_usuario == "Supervisor"){
                userName = await modelSupervisor.buscarSupervisorCPF(usuario.cpf);
            }
            if(usuario.tipo_usuario == "Motorista"){
                userName = await modelMotorista.buscarMotoristaCPF(usuario.cpf);
            }
            if(usuario.tipo_usuario == "Admin"){
                userName = { nome: "Admin Master" };  // ← Novo tipo tratado
            }


            const token = jwt.sign(
                { id: usuario.id, cpf: usuario.cpf, tipo: usuario.tipo_usuario, nome: userName.nome },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );
            
            // salva o token também em cookie httpOnly, pra rotas de página (GET) funcionarem sem precisar mandar header
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 8 * 60 * 60 * 1000 // 8h, igual ao expiresIn do token
            });

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso.',
                token,
                tipo: usuario.tipo_usuario
            });

        } catch (error) {
            console.error('Erro ao realizar login:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao realizar login.',
                erro: error.message
            });
        }
    }

    // LOGOUT
    static logout(req, res) {
        res.clearCookie('token');
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Logout realizado com sucesso.'
        });
    }

    // DELETAR USUARIO
    static async deletarUsuario(req, res) {
        try {
            const { cpf } = req.body;

            const usuarios = await modelUsuario.listarUsuarios();
            const user = usuarios.find(u => u.cpf === cpf);

            if (!user) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Usuário não encontrado.'
                });
            }

            if (user.tipo_usuario === 'Motorista') {
                const deleteMotorista = await modelMotorista.deletarMotorista(cpf);
                const deleteUsuario = await modelUsuario.deletarUsuario(cpf);

                return res.status(200).json({
                    sucesso: true,
                    mensagem: `Usuário motorista de CPF ${deleteUsuario.cpf} (${deleteMotorista.nome}) deletado com sucesso.`
                });
            }

            if (user.tipo_usuario === 'Supervisor' || user.tipo_usuario === 'Admin') {
                const deleteSupervisor = await modelSupervisor.deletarSupervisor(cpf);
                const deleteUsuario = await modelUsuario.deletarUsuario(cpf);

                return res.status(200).json({
                    sucesso: true,
                    mensagem: `Usuário supervisor de CPF ${deleteUsuario.cpf} (${deleteSupervisor.nome}) deletado com sucesso.`
                });
            }

            return res.status(400).json({
                sucesso: false,
                mensagem: 'Tipo de usuário desconhecido. Não foi possível deletar.'
            });

        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno ao deletar usuário.',
                erro: error.message
            });
        }
    }

/*================================*/

    static mostrarTelaCriarSupervisor(req, res) {
        if (req.usuario?.tipo !== 'Admin') {
            return res.status(403).redirect('/');
        }
        res.render('criar-supervisor');
    }

    static async criarSupervisorAdmin(req, res) {
        try {
            const { senha, nome, telefone } = req.body;

            const cpf = req.body.cpf.replace(/\D/g, '');

            const supervisores = await modelSupervisor.listarSupervisores();

            if (!cpf || !senha || !nome || !telefone) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'CPF, Senha, Nome e Telefone são obrigatórios.'
                });
            }

            const usuarioExiste = await modelUsuario.buscarUsuarioCPF(cpf);
            if (usuarioExiste) {
                return res.status(409).json({
                    sucesso: false,
                    mensagem: 'CPF já cadastrado.'
                });
            }

            const usuario = await modelUsuario.criarUsuario(cpf, senha, 'Supervisor');
            const supervisor = await modelSupervisor.criarSupervisor(nome, cpf, telefone, usuario.id);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Supervisor criado com sucesso!',
                dados: {
                    usuario: { id: usuario.id, cpf: usuario.cpf, tipo: usuario.tipo_usuario },
                    supervisor: { nome: supervisor.nome, cpf: supervisor.cpf, telefone: supervisor.telefone }
                }
            });

        } catch (error) {
            console.error('Erro ao criar supervisor:', error);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro interno.',
                erro: error.message
            });
        }
    }
}
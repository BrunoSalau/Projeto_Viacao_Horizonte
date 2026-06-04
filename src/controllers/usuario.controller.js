import { modelUsuario } from '../model/usuarioModel.js';
import { modelMotorista } from '../model/motoristaModel.js';
import { modelSupervisor } from '../model/supervisorModel.js';

export class controllerUsuario{
    //CRIAR USUARIO------------
    static async criarUsuario(req,res){
        
        const info = req.body;
    
        const usuarioCPF = await modelUsuario.listarUsuarios();
    
        let cpfRepetido = false;
    
        usuarioCPF.forEach(usuario => {
            if(info.cpf === usuario.cpf){
                cpfRepetido = true;
            }
        });
    //===============================
        if(cpfRepetido === false){
    
            if(info.opcao === 'Motorista'){
    
                if(!info.cnh){
                    return res.send("CAMPO CNH NAO ESCRITO")
                }
                    //cpf,senha,tipo_usuario
                const usuario = await modelUsuario.criarUsuario(info.cpf, info.senha, 'Motorista');
            
                    //nome,cpf,cnh,telefone,usuario_id
                const motorista = await modelMotorista.criarMotorista(info.nome, info.cpf, info.cnh, info.telefone, usuario.id)
            
                if(usuario && motorista){
                    console.log('USUARIO E MOTORISTA CRIADOS!')
                    console.log(usuario)
                    console.log(motorista)
                }
            
                return res.send(`Usuario: ${usuario.cpf} e Motorista: ${motorista.nome}`)
            }
            if(info.opcao === 'Supervisor'){
                    //cpf,senha,tipo_usuario
                const usuario = await modelUsuario.criarUsuario(info.cpf, info.senha, 'Supervisor');
            
                    //nome,cpf,cnh,telefone,usuario_id
                const supervisor = await modelSupervisor.criarSupervisor(info.nome, info.cpf, info.telefone, usuario.id)
            
                if(usuario && supervisor){
                    console.log('USUARIO E SUPERVISOR CRIADO!')
                    console.log(usuario)
                    console.log(supervisor)
                }
            
                return res.send(`Usuario: ${usuario.cpf} e Supervisor: ${supervisor.nome}`)
            }
    
    
        }
        return res.send("CPF REPETIDO!")
    
    }
    //=============================
    //VERIFICAÇÃO DE LOGIN------------
    static async login(req,res){
        const {cpfInput, senhaInput} = req.body;
    
        const cpf = cpfInput.replace(/\D/g, '');
        const senha = senhaInput;
    
    
        const usuario = await modelUsuario.buscarUsuarioCPF(cpf);
    
        if(usuario){
           if(senha === usuario.senha){
    
                return res.json({
                sucesso: true,
                mensagem: 'Login realizado'
                });
           }
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Senha incorreta'
            });
        }
    
        return res.status(404).json({
            sucesso: false,
            mensagem: 'Usuário não encontrado'
        });
    }
    //LISTAR USUARIOS
    static async listarUsuarios(req,res) {
    
        const opcao2 = req.body.opcao2;
    
        const usuarios = await modelUsuario.listarUsuarios();
    
        if(opcao2 === 'Motorista'){
    
            const motoristas = await modelMotorista.listarMotoristas();
    
            motoristas.forEach((motorista, index) => {
    
                const usuario = usuarios.find(user => 
                    user.id === motorista.usuario_id
                );
    
                console.log('==========================');
                console.log(`MOTORISTA ${index + 1}`);
                console.log(usuario);
                console.log(motorista);
            });
    
        }
        if(opcao2 === 'Supervisor'){
    
            const supervisores = await modelSupervisor.listarSupervisores();
    
            supervisores.forEach((supervisor, index) => {
    
                const usuario = usuarios.find(user => 
                    user.id === supervisor.usuario_id
                );
    
                console.log('==========================');
                console.log(`SUPERVISOR ${index + 1}`);
                console.log(usuario);
                console.log(supervisor);
            });
    
        }
        if(opcao2 === 'Todos'){
    
            const motoristas = await modelMotorista.listarMotoristas();
    
            const supervisores = await modelSupervisor.listarSupervisores();
    
            console.log('======= MOTORISTAS =======');
    
            motoristas.forEach((motorista, index) => {
    
                const usuario = usuarios.find(user =>
                    user.id === motorista.usuario_id
                );
    
                console.log(`MOTORISTA ${index + 1}`);
                console.log(usuario);
                console.log(motorista);
                console.log('==========================');
            });
    
            console.log('======= SUPERVISORES =======');
    
            supervisores.forEach((supervisor, index) => {
    
                const usuario = usuarios.find(user =>
                    user.id === supervisor.usuario_id
                );
    
                console.log(`SUPERVISOR ${index + 1}`);
                console.log(usuario);
                console.log(supervisor);
                console.log('==========================');
            });
        }
    
        
        res.redirect('/');
    
    }

    //DELETAR USUARIO
    static async deletarUsuario(req,res) {
    
        const cpf = req.body.cpf;
    
        const usuarios = await modelUsuario.listarUsuarios();
    
        const user = usuarios.find(user => user.cpf === cpf);
    
        if(!user){return res.send('Usuario não encontrado!')}
    
        if(user.tipo_usuario === 'Motorista'){
            const deleteMotorista = await modelMotorista.deletarMotorista(cpf);
            const deleteUsuario = await modelUsuario.deletarUsuario(cpf);
    
            if(deleteUsuario && deleteMotorista){
            console.log(`Usuario do cpf ${deleteUsuario.cpf}, chamado de ${deleteMotorista.nome} foi deletado!`)
        }
        }
        if(user.tipo_usuario === 'Supervisor'){
            const deleteSupervisor = await modelSupervisor.deletarSupervisor(cpf);
            const deleteUsuario = await modelUsuario.deletarUsuario(cpf);
    
            if(deleteUsuario && deleteSupervisor){
            console.log(`Usuario do cpf ${deleteUsuario.cpf}, chamado de ${deleteSupervisor.nome} foi deletado!`)
        }
        }
    
    
    
    
    
        res.send('Usuario Deletado!')
        
    }
}
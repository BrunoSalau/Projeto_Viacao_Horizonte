import { buscarUsuarioCPF } from '../model/usuarioModel.js';

export async function login(req,res){
    const {cpfInput, senhaInput} = req.body;

    const cpf = cpfInput.replace(/\D/g, '');
    const senha = senhaInput;


    const usuario = await buscarUsuarioCPF(cpf);

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
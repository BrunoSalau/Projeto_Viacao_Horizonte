import { modelUsuario } from '../model/usuarioModel.js';
import { modelMotorista } from '../model/motoristaModel.js';
import { modelSupervisor } from '../model/supervisorModel.js';

export function mostrar(req,res){
    res.render('login');
}
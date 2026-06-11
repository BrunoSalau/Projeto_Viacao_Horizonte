import { modelVeiculo } from '../model/veiculoModel.js';

//adicionar veiculo
export class controllerVeiculo{
    static telaVeiculo(req,res){

        res.render('veiculo');
    }

    static async criarVeiculo(req,res) {
        const info = req.body;

        
        if(await modelVeiculo.buscarVeiculoPlaca(info.placa)){
            return res.send("Já existe um veiculo com essa placa!");
        };
        if(info){
            await modelVeiculo.criarVeiculo(info.placa, info.modelo, info.marca, info.ano, info.capacidade_passageiros, info.quilometragem, "Disponivel");
            console.log(`Veiculo da placa ${info.placa} adicionado com sucesso!`);
        }


        return res.redirect("/veiculo");
    }

    static async procurarVeiculo(req,res){
        const placa = req.body.placa;

        const veiculo = await modelVeiculo.buscarVeiculoPlaca(placa);

        if(!veiculo){
            console.log('Veiculo nao encontrado!');
            return res.send('Veiculo nao encontrado');
        }

        console.log(`Veiculo buscado: ${veiculo}`);

        return res.json(veiculo);
    }

    static async listarVeiculos(req,res){
        const veiculos = await modelVeiculo.listarVeiculos();

        if(!veiculos){
            console.log('Nenhum veiculo encontrado!');
            return res.send('Nnehum veiculo encontrado');
        }
        console.log('Procurando Veiculos');
        return res.json(veiculos);
    }

    static async deletarVeiculo(req,res){
        const placa = req.body.placa;

        const veiculo = await modelVeiculo.deletarVeiculo(placa);

        if(!veiculo){
            return res.json({
            status: 'erro',
            menssagem: 'Placa não identificada!'
            });
        };
    

        return res.json({
            status: 'sucesso',
            menssagem: 'Veículo excluído com sucesso!'
        });


    }
}
import { modelVeiculo } from '../model/veiculoModel.js';

export class controllerVeiculo {

    static telaVeiculo(req, res) {
        res.render('veiculo');
    }

    // CRIAR VEÍCULO
    static async criarVeiculo(req, res) {
        try {
            const info = req.body;

            if (await modelVeiculo.buscarVeiculoPlaca(info.placa)) {
                return res.status(409).json({
                    status: 'erro',
                    menssagem: 'Já existe um veículo com essa placa!'
                });
            }

            await modelVeiculo.criarVeiculo(
                info.placa, info.modelo, info.marca, info.ano,
                info.capacidade_passageiros, info.quilometragem, 'Disponivel', null
            );

            console.log(`Veículo da placa ${info.placa} adicionado com sucesso!`);

            return res.status(201).json({
                status: 'sucesso',
                menssagem: 'Veículo adicionado com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao criar veículo:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao criar veículo.'
            });
        }
    }

    // PROCURAR VEÍCULO POR PLACA
    static async procurarVeiculo(req, res) {
        try {
            const placa = req.body.placa;
            const veiculo = await modelVeiculo.buscarVeiculoPlaca(placa);

            if (!veiculo) {
                return res.status(404).json({
                    status: 'erro',
                    menssagem: 'Veículo não encontrado.'
                });
            }

            console.log('Veículo buscado:', JSON.stringify(veiculo));
            return res.json(veiculo);

        } catch (error) {
            console.error('Erro ao procurar veículo:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao procurar veículo.'
            });
        }
    }

    // LISTAR VEÍCULOS
    static async listarVeiculos(req, res) {
        try {
            const veiculos = await modelVeiculo.listarVeiculos();

            if (!veiculos || veiculos.length === 0) {
                return res.status(404).json({
                    status: 'erro',
                    menssagem: 'Nenhum veículo encontrado.'
                });
            }

            console.log('Listando veículos...');
            return res.json(veiculos);

        } catch (error) {
            console.error('Erro ao listar veículos:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao listar veículos.'
            });
        }
    }

    // DELETAR VEÍCULO
    static async deletarVeiculo(req, res) {
        try {
            const placa = req.body.placa;
            const veiculo = await modelVeiculo.deletarVeiculo(placa);

            if (!veiculo) {
                return res.json({
                    status: 'erro',
                    menssagem: 'Placa não identificada!'
                });
            }

            return res.json({
                status: 'sucesso',
                menssagem: 'Veículo excluído com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao deletar veículo:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao deletar veículo.'
            });
        }
    }

    // ATUALIZAR VEÍCULO
    static async atualizarVeiculo(req, res) {
        try {
            const { placa, modelo, marca, ano, capacidade_passageiros, quilometragem, status } = req.body;

            const existe = await modelVeiculo.buscarVeiculoPlaca(placa);

            if (!existe) {
                return res.status(404).json({
                    status: 'erro',
                    menssagem: 'Placa não identificada!'
                });
            }

            const veiculo = await modelVeiculo.atualizarVeiculo(
                placa, modelo, marca, ano, capacidade_passageiros, quilometragem, status
            );

            return res.json({
                status: 'sucesso',
                menssagem: 'Veículo atualizado com sucesso!',
                dados: veiculo
            });

        } catch (error) {
            console.error('Erro ao atualizar veículo:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao atualizar veículo.'
            });
        }
    }
}

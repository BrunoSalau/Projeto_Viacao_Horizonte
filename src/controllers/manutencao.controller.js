import { modelManutencao } from '../model/manutencaoModel.js';

export class controllerManutencao {

    static telaManutencao(req, res) {
        res.render('manutencao');
    }

    // CRIAR MANUTENÇÃO
    static async criarManutencao(req, res) {
        try {
            const info = req.body;

            await modelManutencao.criarManutencao(
                info.id_veiculo, info.descricao, info.data_manutencao
            );

            console.log(`Manutenção do veículo ${info.id_veiculo} adicionada com sucesso!`);

            return res.status(201).json({
                status: 'sucesso',
                menssagem: 'Manutenção adicionada com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao criar manutenção:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao criar manutenção.'
            });
        }
    }

    // PROCURAR MANUTENÇÃO POR ID
    static async procurarManutencao(req, res) {
        try {
            const id = req.body.id;
            const manutencao = await modelManutencao.buscarManutencaoPorId(id);

            if (!manutencao) {
                return res.status(404).json({
                    status: 'erro',
                    menssagem: 'Manutenção não encontrada.'
                });
            }

            console.log('Manutenção buscada:', JSON.stringify(manutencao));
            return res.json(manutencao);

        } catch (error) {
            console.error('Erro ao procurar manutenção:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao procurar manutenção.'
            });
        }
    }

    // LISTAR MANUTENÇÕES
    static async listarManutencoes(req, res) {
        try {
            const manutencoes = await modelManutencao.listarManutencoes();

            if (!manutencoes || manutencoes.length === 0) {
                return res.status(404).json({
                    status: 'erro',
                    menssagem: 'Nenhuma manutenção encontrada.'
                });
            }

            console.log('Listando manutenções...');
            return res.json(manutencoes);

        } catch (error) {
            console.error('Erro ao listar manutenções:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao listar manutenções.'
            });
        }
    }

    // DELETAR MANUTENÇÃO
    static async deletarManutencao(req, res) {
        try {
            const id = req.body.id;
            const manutencao = await modelManutencao.deletarManutencao(id);

            if (!manutencao) {
                return res.json({
                    status: 'erro',
                    menssagem: 'ID não identificado!'
                });
            }

            return res.json({
                status: 'sucesso',
                menssagem: 'Manutenção excluída com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao deletar manutenção:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao deletar manutenção.'
            });
        }
    }

    // ATUALIZAR MANUTENÇÃO
    static async atualizarManutencao(req, res) {
        try {
            const { id, id_veiculo, descricao, data_manutencao } = req.body;

            const existe = await modelManutencao.buscarManutencaoPorId(id);

            if (!existe) {
                return res.status(404).json({
                    status: 'erro',
                    menssagem: 'ID não identificado!'
                });
            }

            const manutencao = await modelManutencao.atualizarManutencao(
                id, id_veiculo, descricao, data_manutencao
            );

            return res.json({
                status: 'sucesso',
                menssagem: 'Manutenção atualizada com sucesso!',
                dados: manutencao
            });

        } catch (error) {
            console.error('Erro ao atualizar manutenção:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao atualizar manutenção.'
            });
        }
    }
}

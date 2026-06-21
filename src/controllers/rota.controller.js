import { modelRota } from '../model/rotaModel.js';

export class controllerRota {

    static telaRota(req, res) {
        res.render('rota');
    }

    // CRIAR ROTA
    static async criarRota(req, res) {
        try {
            const info = req.body;

            if (await modelRota.buscarRota(info.origem, info.destino)) {
                return res.status(409).json({
                    status: 'erro',
                    menssagem: 'Já existe uma rota com essa origem e destino!'
                });
            }

            await modelRota.criarRota(info.origem, info.destino, info.distancia_km);

            console.log(`Rota de ${info.origem} para ${info.destino} adicionada com sucesso!`);

            return res.status(201).json({
                status: 'sucesso',
                menssagem: 'Rota adicionada com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao criar rota:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao criar rota.'
            });
        }
    }

    // PROCURAR ROTA POR ORIGEM E DESTINO
    static async procurarRota(req, res) {
        try {
            const origem = req.body.origem;
            const destino = req.body.destino;
            const rota = await modelRota.buscarRota(origem, destino);

            if (!rota) {
                return res.status(404).json({
                    status: 'erro',
                    menssagem: 'Rota não encontrada.'
                });
            }

            console.log('Rota buscada:', JSON.stringify(rota));
            return res.json(rota);

        } catch (error) {
            console.error('Erro ao procurar rota:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao procurar rota.'
            });
        }
    }

    // LISTAR ROTAS
    static async listarRotas(req, res) {
        try {
            const rotas = await modelRota.listarRotas();

            if (!rotas || rotas.length === 0) {
                return res.status(404).json({
                    status: 'erro',
                    menssagem: 'Nenhuma rota encontrada.'
                });
            }

            console.log('Listando rotas...');
            return res.json(rotas);

        } catch (error) {
            console.error('Erro ao listar rotas:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao listar rotas.'
            });
        }
    }

    // DELETAR ROTA
    static async deletarRota(req, res) {
        try {
            const id = req.body.id;
            const rota = await modelRota.deletarRota(id);

            if (!rota) {
                return res.json({
                    status: 'erro',
                    menssagem: 'ID não identificada!'
                });
            }

            return res.json({
                status: 'sucesso',
                menssagem: 'Rota excluída com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao deletar rota:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao deletar rota.'
            });
        }
    }

    // ATUALIZAR ROTA
    static async atualizarRota(req, res) {
        try {
            const { id, origem, destino, distancia_km } = req.body;

            const existe = await modelRota.buscarRotaPorId(id);

            if (!existe) {
                return res.status(404).json({
                    status: 'erro',
                    menssagem: 'ID não identificada!'
                });
            }

            const rota = await modelRota.atualizarRota(origem, destino, distancia_km, id);

            return res.json({
                status: 'sucesso',
                menssagem: 'Rota atualizada com sucesso!',
                dados: rota
            });

        } catch (error) {
            console.error('Erro ao atualizar rota:', error);
            return res.status(500).json({
                status: 'erro',
                menssagem: 'Erro interno ao atualizar rota.'
            });
        }
    }
}

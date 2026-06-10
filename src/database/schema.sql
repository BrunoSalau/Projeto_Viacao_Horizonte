--DROP TABLE supervisor;
--DROP TABLE motorista;
--DROP TABLE usuario;
--DROP TABLE veiculo;
--DROP TABLE rota;
--DROP TABLE viagem;
--DROP TABLE manutencao;
--DROP TABLE abastecimento;

CREATE TABLE IF NOT EXISTS usuario(
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    senha VARCHAR(250) NOT NULL,
    tipo_usuario VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS motorista(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(250) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    cnh VARCHAR(250) NOT NULL,
    telefone VARCHAR(10) NOT NULL,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS supervisor(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(250) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    telefone VARCHAR(10) NOT NULL,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS veiculo(
    id SERIAL PRIMARY KEY,
    placa VARCHAR(10) UNIQUE NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    ano INTEGER NOT NULL,
    capacidade_passageiros INTEGER,
    quilometragem INTEGER DEFAULT 0,
    imagem TEXT,
    status VARCHAR(20) DEFAULT 'Disponivel'
    
);
CREATE TABLE IF NOT EXISTS rota(
    id SERIAL PRIMARY KEY,
    origem VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    distancia_km INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS viagem(
    id SERIAL PRIMARY KEY,
    id_veiculo INTEGER REFERENCES veiculo(id),
    id_rota INTEGER REFERENCES rota(id),
    data_viagem DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'Agendada'
);
CREATE TABLE IF NOT EXISTS manutencao(
    id SERIAL PRIMARY KEY,
    id_veiculo INTEGER REFERENCES veiculo(id),
    descricao TEXT NOT NULL,
    data_manutencao DATE NOT NULL
);
CREATE TABLE IF NOT EXISTS abastecimento(
    id SERIAL PRIMARY KEY,
    id_veiculo INTEGER REFERENCES veiculo(id),
    litros NUMERIC(10,2) NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    data_abastecimento DATE NOT NULL
);



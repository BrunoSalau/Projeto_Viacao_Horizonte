--DROP TABLE IF EXISTS abastecimento;
--DROP TABLE IF EXISTS manutencao;
--DROP TABLE IF EXISTS viagem;
--DROP TABLE IF EXISTS rota;
--DROP TABLE IF EXISTS veiculo;
--DROP TABLE IF EXISTS supervisor;
--DROP TABLE IF EXISTS motorista;
--DROP TABLE IF EXISTS usuario;

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
    data_viagem DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'Agendada',
    motorista_id INTEGER NOT NULL REFERENCES motorista(id),
    supervisor_id INTEGER NOT NULL REFERENCES supervisor(id),
    rota_id INTEGER NOT NULL REFERENCES rota(id),
    veiculo_id INTEGER NOT NULL REFERENCES veiculo(id)
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



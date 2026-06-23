# Projeto Horizontes

## 1. Nome do projeto
Sistema de Gestão de Frota - Horizontes

## 2. Descrição geral do sistema
Aplicação web desenvolvida em Node.js com Express para gestão de usuários, motoristas, supervisores, veículos, rotas, viagens, manutenções e abastecimentos. A interface é renderizada com EJS e o frontend usa CSS e scripts JS próprios disponíveis em `public/`.

## 3. Objetivo do projeto
Permitir o cadastro, controle e acompanhamento de operações de transporte sobre uma frota, com gerenciamento de:
- motoristas
- supervisores
- veículos
- rotas
- viagens
- manutenções
- abastecimentos

Inclui login com JWT e controle de acesso para páginas de administração e painel de motorista.

## 4. Tecnologias utilizadas
- Node.js
- Express 5
- EJS
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`)
- `dotenv`
- `cookie-parser`
- `nodemon` (para desenvolvimento)

## 5. Arquitetura da aplicação
Aplicação organizada em arquitetura MVC simples:
- `server.js` - ponto de entrada
- `src/app.js` - configuração do Express, middleware e rotas
- `src/routers/` - definição de rotas e endpoints
- `src/controllers/` - lógica de negócio e tratamento de requisições
- `src/model/` - acesso ao banco de dados e consultas SQL
- `src/config/db.js` - configuração do pool PostgreSQL
- `src/middleware/auth.js` - autenticação e proteção de rotas
- `src/utils/initAdmin.js` - inicialização de usuário Admin master
- `src/database/schema.sql` - definição do esquema de banco de dados
- `src/views/` - templates EJS das páginas renderizadas
- `public/` - ativos estáticos (CSS, JS, imagens)

## 6. Estrutura de pastas
- `package.json`
- `server.js`
- `src/`
  - `app.js`
  - `config/`
    - `db.js`
  - `controllers/`
    - `abastecimento.controller.js`
    - `cadastro.controller.js`
    - `login.controller.js`
    - `manutencao.controller.js`
    - `motorista.controller.js`
    - `painel.controller.js`
    - `rota.controller.js`
    - `supervisor.controller.js`
    - `usuario.controller.js`
    - `veiculo.controller.js`
    - `viagem.controller.js`
  - `database/`
    - `schema.sql`
  - `middleware/`
    - `auth.js`
  - `model/`
    - `abastecimentoModel.js`
    - `manutencaoModel.js`
    - `motoristaModel.js`
    - `rotaModel.js`
    - `supervisorModel.js`
    - `usuarioModel.js`
    - `veiculoModel.js`
    - `viagemModel.js`
  - `routers/`
    - `abastecimento.router.js`
    - `manutencao.router.js`
    - `motorista.router.js`
    - `painel.router.js`
    - `rota.router.js`
    - `supervisor.router.js`
    - `usuario.router.js`
    - `veiculo.router.js`
    - `viagem.router.js`
    - `web.js`
  - `utils/`
    - `initAdmin.js`
  - `views/`
    - `abastecimento.ejs`
    - `criar-supervisor.ejs`
    - `login.ejs`
    - `manutencao.ejs`
    - `motoristas.ejs`
    - `painel_motorista.ejs`
    - `painel.ejs`
    - `rota.ejs`
    - `veiculo.ejs`
    - `viagens.ejs`
- `public/`
  - `css/`
  - `js/`
  - `img/`

## 7. Funcionalidades implementadas
- Autenticação de usuário com JWT via cookie e header Authorization
- Login e logout
- Criação de usuários:
  - Motorista
  - Supervisor
  - Admin master inicializado no startup
- CRUD de motoristas
- CRUD de supervisores
- CRUD de veículos
- CRUD de rotas
- Agendamento e gerenciamento de viagens
- Alteração de status de viagens
- Registro e gestão de manutenções de veículos
- Registro e gestão de abastecimentos de veículos
- Dashboard principal com navegação entre módulos
- Painel dedicado para motorista

## 8. Controle de acesso e autenticação
- `src/middleware/auth.js`
  - `autenticar` — valida JWT enviado via cookie `token` ou header `Authorization: Bearer ...`
  - `protegerPagina` — protege páginas, redireciona para `/` se não houver token válido no cookie
  - `protegerPaginaMotorista` — protege o painel do motorista e exige tipo `Motorista`
  - `somenteSupervisor` — middleware disponível para verificar tipo `Supervisor`

- O token JWT é criado em `src/controllers/usuario.controller.js` com `process.env.JWT_SECRET` e expiração de 8 horas.
- O login salva o token em cookie `httpOnly` e também em `localStorage` no frontend via `public/js/login.js`.

## 9. Banco de dados (entidades e relacionamentos identificados)
O esquema SQL está em `src/database/schema.sql`.

Entidades:
- `usuario`
  - `id`, `cpf`, `senha`, `tipo_usuario`
- `motorista`
  - `id`, `nome`, `cpf`, `cnh`, `telefone`, `usuario_id` → FK `usuario(id)`
- `supervisor`
  - `id`, `nome`, `cpf`, `telefone`, `usuario_id` → FK `usuario(id)`
- `veiculo`
  - `id`, `placa`, `modelo`, `marca`, `ano`, `capacidade_passageiros`, `quilometragem`, `imagem`, `status`
- `rota`
  - `id`, `origem`, `destino`, `distancia_km`
- `viagem`
  - `id`, `id_veiculo` → FK `veiculo(id)`
  - `id_rota` → FK `rota(id)`
  - `id_motorista` → FK `motorista(id)`
  - `data_viagem`, `horario_viagem`, `status`, `created_at`
- `manutencao`
  - `id`, `id_veiculo` → FK `veiculo(id)`, `descricao`, `data_manutencao`
- `abastecimento`
  - `id`, `id_veiculo` → FK `veiculo(id)`, `litros`, `valor`, `data_abastecimento`

Relacionamentos principais:
- `usuario` 1:N `motorista`
- `usuario` 1:N `supervisor`
- `veiculo` 1:N `viagem`
- `rota` 1:N `viagem`
- `motorista` 1:N `viagem`
- `veiculo` 1:N `manutencao`
- `veiculo` 1:N `abastecimento`

## 10. Instalação e configuração do ambiente
1. Clonar o repositório
2. Navegar para a raiz do projeto
3. Instalar dependências:
   ```bash
   npm install
   ```
4. Configurar PostgreSQL e criar banco de dados conforme variáveis de ambiente
5. Executar a criação do esquema do banco:
   - manualmente via `src/database/schema.sql`
   - ou usando um script que execute o SQL do arquivo

## 11. Variáveis de ambiente necessárias
O sistema depende destas variáveis:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`
- `JWT_SECRET`
- `ADMIN_CPF`
- `ADMIN_SENHA`
- `NODE_ENV` (opcional, usado para configuração de cookie seguro em produção)

Exemplo mínimo:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
DB_PORT=5432
JWT_SECRET=uma_chave_secreta
ADMIN_CPF=00000000000
ADMIN_SENHA=admin123
NODE_ENV=development
```

## 12. Como executar o projeto
- Iniciar servidor de desenvolvimento:
  ```bash
  npm run dev
  ```
- O servidor roda em:
  ```text
  http://localhost:3000
  ```

## 13. Principais rotas e módulos do sistema

### Usuário e autenticação
- `POST /usuario/login`
- `POST /usuario/logout`
- `POST /usuario/criarUsuario`
- `POST /usuario/deletarUsuario`
- `GET /usuario/perfil`
- `GET /usuario/criar-supervisor`
- `POST /usuario/criarSupervisorAdmin`

### Motorista
- `GET /motorista`
- `GET /motorista/painel`
- `GET /motorista/minhasViagens`
- `GET /motorista/listarMotoristas`
- `POST /motorista/buscarMotorista`
- `PUT /motorista/atualizarMotorista`

### Supervisor
- `GET /supervisor/listarSupervisores`
- `POST /supervisor/buscarSupervisor`
- `PUT /supervisor/atualizarSupervisor`

### Rota
- `GET /rota`
- `POST /rota/adicionar`
- `POST /rota/procurar`
- `POST /rota/listar`
- `POST /rota/deletar`
- `PUT /rota/atualizar`

### Veículo
- `GET /veiculo`
- `POST /veiculo/adicionar`
- `POST /veiculo/procurar`
- `POST /veiculo/listar`
- `POST /veiculo/deletar`
- `PUT /veiculo/atualizar`

### Viagem
- `GET /viagem`
- `GET /viagem/listar`
- `POST /viagem/procurar`
- `POST /viagem/adicionar`
- `PUT /viagem/atualizar`
- `PUT /viagem/alterar-status`
- `POST /viagem/deletar`
- `POST /viagem/rotas`
- `POST /viagem/veiculos`
- `POST /viagem/motoristas`

### Manutenção
- `GET /manutencao`
- `POST /manutencao/listar`
- `POST /manutencao/adicionar`
- `POST /manutencao/procurar`
- `POST /manutencao/deletar`
- `PUT /manutencao/atualizar`

### Abastecimento
- `GET /abastecimento`
- `POST /abastecimento/listar`
- `POST /abastecimento/adicionar`
- `POST /abastecimento/procurar`
- `POST /abastecimento/deletar`
- `PUT /abastecimento/atualizar`

### Painel
- `GET /painel`

## 14. Fluxo de funcionamento da aplicação
1. O usuário acessa `/` e faz login.
2. O backend valida CPF/senha em `usuario.controller` e cria JWT.
3. O token é enviado em cookie `token` e usado por middleware `auth.js`.
4. O usuário é redirecionado conforme seu tipo:
   - `Admin` → `/usuario/criar-supervisor`
   - `Supervisor` → `/veiculo`
   - `Motorista` → `/motorista/painel`
5. Usuário autenticado navega entre páginas que consultam APIs via fetch.
6. Controle de acesso:
   - páginas protegidas com `protegerPagina`
   - painel de motorista protegido por `protegerPaginaMotorista`
7. CRUDs usam controllers e models para acessar o banco PostgreSQL.
8. `src/utils/initAdmin.js` garante que exista um Admin master no startup.

## 15. Integrantes do projeto
- Nome: Viacao Horizontes
- Grupo/Equipe:Bruno Henrique e Luiz Henrique
- Turma:Topicos Especiais de Sistemas / ADS

## 16. Considerações finais
Este projeto é um sistema funcional de gestão de frota com backend em Node.js/Express e frontend EJS. Ele contempla autenticação JWT, controle de acesso, cadastro de usuários e operações de manutenção, viagem e abastecimento.

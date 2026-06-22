import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
    // tenta pegar o token do cookie primeiro (usado pela navegação normal/páginas)
    let token = req.cookies?.token;

    // se não tiver cookie, tenta pegar do header Authorization (usado pelo fetch/API)
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            token = authHeader.split(' ')[1]; // "Bearer xxxxx"
        }
    }

    if (!token) {
        return res.status(401).json({ sucesso: false, mensagem: 'Token não enviado' });
    }

    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = dados; // { id, cpf, tipo }
        next();
    } catch (err) {
        return res.status(401).json({ sucesso: false, mensagem: 'Token inválido ou expirado' });
    }
}

export function somenteSupervisor(req, res, next) {
    if (req.usuario?.tipo !== 'Supervisor') {
        return res.status(403).json({ sucesso: false, mensagem: 'Apenas supervisores podem fazer isso' });
    }
    next();
}

export function protegerPagina(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return res.redirect('/');
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        return res.redirect('/');
    }
}

// Protege a página do motorista: exige token e tipo Motorista
export function protegerPaginaMotorista(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return res.redirect('/');
    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET);
        if (dados.tipo !== 'Motorista') return res.redirect('/');
        next();
    } catch {
        return res.redirect('/');
    }
}

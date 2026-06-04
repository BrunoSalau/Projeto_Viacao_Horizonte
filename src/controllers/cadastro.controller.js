export function cadastro(req,res){
    console.log({
        host: JSON.stringify(process.env.DB_HOST),
        user: JSON.stringify(process.env.DB_USER),
        password: JSON.stringify(process.env.DB_PASSWORD),
        database: JSON.stringify(process.env.DB_NAME),
        port: JSON.stringify(process.env.DB_PORT),
    });
    res.render('cadastro');
}
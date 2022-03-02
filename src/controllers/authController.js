import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../db.js';


export async function signUp(request,response){
    const user = request.body;
    const passwordHashed = bcrypt.hashSync(user.password, 10);
    try{
        const email = await connection.query('SELECT * FROM usuarios WHERE email = $1',[user.email])
        if(email.rows.length !== 0){
            return response.status(409).send('Este email já está em uso');
        }
        await connection.query('INSERT INTO usuarios (nome,email,senha) VALUES ($1,$2,$3)', [user.name,user.email,passwordHashed]);
        response.sendStatus(201);
    }catch{
        response.sendStatus(500)
    }
}

export async function signIn(request, response) {
    const { email, password } = request.body;
    try {
      const user = await connection.query('SELECT * FROM usuarios WHERE email=$1',[email]);
      if (user.rows && bcrypt.compareSync(password, user.rows[0].senha)) {
        const token = uuid();
        await connection.query('INSERT INTO sessoes ("idUsuario",token) VALUES ($1,$2)',[user.rows[0].id,token]);
        delete user.rows[0].senha;
        response.status(200).send({ ...user.rows[0], token });
      } else {
        response.status(401).send('email ou senha invalidos');
      }
    } catch(e) {
      response.sendStatus(500);
    }
  }
  
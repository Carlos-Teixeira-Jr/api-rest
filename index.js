const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const JWTSecret = "12121212";


app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//MIDDLEWARE: função executada antes da rota especificada ser executada;
function auth(req,res,next){
  const authToken = req.headers["authorization"];

  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    let token = bearer[1];
    jwt.verify(token,JWTSecret,(err,data)=>{
      if (err) {
        res.status(401);
        res.json({err:"Token inválido"});
      }else{
        req.token = token;
        req.loggedUser = {id: data.id,email: data.email};
        next();
      }
    });
  } else {
    res.status(401);
    res.json({err:"Token inválido"});
  }

  
}

let DB = {
  games:[
    {
      id: 23,
      title: "Call of Duty MW",
      year: 2019,
      price: 60
    },
    {
      id: 65,
      title: "Sea of Thieves",
      year: 2018,
      price: 40
    },
    {
      id: 2,
      title: "Minecraft",
      year: 2012,
      price: 20
    },
  ],
  users:[
    {
      id: 1,
      name: "Victor Lima",
      email: "victordevtb@gmail.com",
      password: "node"
    },
    {
      id: 2,
      name: "Camila",
      email: "cah@gmail.com",
      password: "express"
    }
  ]
}

//REST - rota de listagem de todos os itens:
app.get("/games", auth,(req,res)=>{//URL unifiorme e direta e método adequado para a finalidade da rota;
  res.statusCode = 200;//Retorna um código de estado da requisição;
  res.json(DB.games);
});

//REST - rota de listagem de item individual;
app.get("/game/:id", auth,(req,res)=>{//URL no singular (pois a rota anterior, por se tratar de uma listagem de todos os itens, deve realmente estar no plural), uniforme e direta;

  if (isNaN(req.params.id)) {
    res.sendStatus(400);//Retorno de mensagem de status da requisição;
  } else {

    let id = parseInt(req.params.id);
    let game = DB.games.find(g => g.id == id);

    if (game != undefined) {
      res.statusCode = 200;
      res.json(game);
    } else {
      res.sendStatus(404);
    }
  }
})

//REST - rota de criação de novo jogo no db;
app.post("/game", auth, (req,res)=>{//Aqui a rota precisa ser do tipo POST para indicar que se trata do método CREATE e o endereço url da rota precisa ser game no singular indicando apenas o tipo de item que será criado;
  let {title, price, year} = req.body;//Sintaxe do ecma script 6 para economizar digitação;

  DB.games.push({
    id: 24,
    title,
    price,
    year
  });

  res.sendStatus(200);

})

app.delete("/game/:id", auth,(req,res)=>{
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {

    let id = parseInt(req.params.id);
    let index = DB.games.findIndex(g => g.id == id);

    if (index == -1) {
      res.sendStatus(404);
    } else {
      DB.games.splice(index,1);
      res.sendStatus(200);
    }

  }
})

app.put("/game/:id",(req,res)=>{
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {

    let id = parseInt(req.params.id);
    let game = DB.games.find(g => g.id == id);

    if (game != undefined) {
      
      let {title, price, year} = req.body;

      if(title != undefined){
        game.title = title;
      }

      if(price != undefined){
        game.price = price;
      }

      if(year != undefined){
        game.year = year;
      }

      res.sendStatus(200);

    } else {
      DB.games.splice(index,1);
      res.sendStatus(200);
    }

  }
})

//Rota de autenticação de usuários
app.post("/auth",(req,res)=>{

  let {email,password} = req.body;

  if(email != undefined){

    let user = DB.users.find(u => u.email == email);
    if (user != undefined) {
      if(user.password == password){

        jwt.sign({id: user.id, email: user.email}, JWTSecret,{expiresIn: "48h"},(err,token)=>{
          if (err) {
            res.status(400);
            res.json({err: "Falha interna"});
          } else {
            res.status(200);
            res.json({token: token});
          }
        })
      }else{
        res.status(401);
        res.json({err: "Credenciais inválidas"});
      }
    } else {
      res.status(404);
      res.json({err: "O email enviado não existe na base de dados"})
    }
  }else{
    res.status(400);
    res.json({err: "O email enviado não válido"})
  }

})

app.listen(8080,()=>{
  console.log("api rodando");
});
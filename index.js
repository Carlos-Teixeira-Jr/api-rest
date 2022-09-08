const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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
    }
  ]
}

//REST - rota de listagem de todos os itens:
app.get("/games",(req,res)=>{//URL unifiorme e direta e método adequado para a finalidade da rota;
  res.statusCode = 200;//Retorna um código de estado da requisição;
  res.json(DB.games);
});

//REST - rota de listagem de item individual;
app.get("/game/:id",(req,res)=>{//URL no singular (pois a rota anterior, por se tratar de uma listagem de todos os itens, deve realmente estar no plural), uniforme e direta;

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
app.post("/game", (req,res)=>{//Aqui a rota precisa ser do tipo POST para indicar que se trata do método CREATE e o endereço url da rota precisa ser game no singular indicando apenas o tipo de item que será criado;
  let {title, price, year} = req.body;//Sintaxe do ecma script 6 para economizar digitação;

  DB.games.push({
    id: 24,
    title,
    price,
    year
  });

  res.sendStatus(200);

})

app.delete("/game/:id",(req,res)=>{
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


app.listen(8080,()=>{
  console.log("api rodando");
});
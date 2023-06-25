const express = require('express');
const app = express();
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');

const Game = require('./models/game');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/kolkoDB')
  .then(() =>{
    console.log("Conetion open!!!!");
  })
  .catch( err =>{
    console.log("Oh no error!!!!");
    console.log(err);
  })

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');


const checkIfWin =  (game) =>{
    const board=  game.board
    if((board.pol1 === board.pol2 && board.pol2 ===  board.pol3 && board.pol1 === board.pol3 && board.pol1 !=='N')||
        (board.pol4 === board.pol5 && board.pol4 ===  board.pol6 && board.pol5 === board.pol6 && board.pol4 !=='N')||
        (board.pol7 === board.pol8 && board.pol7 ===  board.pol9 && board.pol8 === board.pol9 && board.pol7 !=='N')||
        (board.pol1 === board.pol5&& board.pol1 ===  board.pol9 && board.pol5 === board.pol9 && board.pol1 !=='N')||
        (board.pol3 === board.pol5 && board.pol3 ===  board.pol7 && board.pol5 === board.pol7 && board.pol3 !=='N')||
        (board.pol1 === board.pol4 && board.pol1 ===  board.pol7 && board.pol4 === board.pol7 && board.pol1 !=='N')||
        (board.pol2 === board.pol5 && board.pol2 ===  board.pol8 && board.pol5 === board.pol8 && board.pol2 !=='N')||
        (board.pol3 === board.pol6 && board.pol3 ===  board.pol9 && board.pol6 === board.pol9 && board.pol3 !=='N')){
        return true;
    }
    return false;
};



app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/game',(req,res)=>{
    res.render('gameStart');
})

app.post('/game',async (req,res)=>{
    Game.deleteMany({});
    const game = new Game({player1:"",player2:"",board:{pol1:"N",pol2:"N",pol3:"N",pol4:"N",pol5:"N", pol6:"N", pol7:"N", pol8:"N", pol9:"N"},winner:"none",turn:"O"})
    await game.save();
    console.log(game._id);
    res.redirect(`/game/${game._id}`);
    
})

app.get('/game/:id',async(req,res)=>{
    const {id} = req.params;
    const game = await Game.findById(id);
    res.render('game',{game});
})

app.put('/game/:id/pol/:number',async(req,res)=>{
    const {id,number} = req.params;
    const game = await Game.findById(id);
    let newBoard = game.board;

    if(game.turn ==="O"){
        newBoard[`pol${number}`] = "O"
        //console.log("Kolej kolka");
        
        const updatedGame = await Game.findByIdAndUpdate(id,{board:newBoard,turn:"X"});
        //console.log(checkIfWin(game));
        if( checkIfWin(game)){
            res.render('win',{game});
        }else{
            res.redirect(`/game/${id}`);
        }
    }
    else{
        newBoard[`pol${number}`] = "X"
        const updatedGame = await Game.findByIdAndUpdate(id,{board:newBoard,turn:"O"});
        //console.log("Kolej krzyzyka");
        if( checkIfWin(game)){
            res.render('win',{game})
        }else{
            res.redirect(`/game/${id}`);
        }
    }

    
    //console.log(game);
    
})


app.listen(3000,()=>{
    console.log("listien on port 3000!!!");
})
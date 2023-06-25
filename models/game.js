const mongoose =  require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    player1:String,
    player2:String,
    board:{
        pol1:String,
        pol2:String,
        pol3:String,
        pol4:String,
        pol5:String,
        pol6:String,
        pol7:String,
        pol8:String,
        pol9:String,
    },
    winner:String,
    turn:String
})

module.exports = mongoose.model('Game',GameSchema);
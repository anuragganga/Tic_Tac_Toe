var X="X";
var O="O";
var EMPTY=null;

function initial_state(){
    return [[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY]];
}

var board=initial_state();

function player(board){
    var x=0;
    var o=0;
    board.forEach(row => {
        row.forEach(element=>{
            if (element == X){
                x+=1;
            }else if(element == O){
                o+=1;
            }
        });
    });
    if(o<x){
        return O;
    }else{
        return X;
    }
}


function actions(board){
    var actions=[];
    var i=0;
    board.forEach(row=>{
        var j=0;
        row.forEach(element=>{
            if(element == null){
                actions.push([i,j]);
            }
            j+=1;
        });
        i+=1;
    });
    return actions;
}

function result(board,action){
    newBoard=structuredClone(board);
    newBoard[action[0]][action[1]]=player(board);
    return newBoard;
}

function winner(board){
    function Xwins(){
        for (var i=0;i<3;i++){
            if((board[i][0]==X && board[i][1]==X && board[i][2] == X) || (board[0][i]==X && board[1][i]==X && board[2][i] == X)){
                return true;
            }
        }
        if((board[0][0]==X && board[1][1]==X && board[2][2] == X) || (board[0][2]==X && board[1][1]==X && board[2][0] == X)){
            return true;
        }
        return false;
    }

    function Owins(){
        for (var i=0;i<3;i++){
            if((board[i][0]==O && board[i][1]==O && board[i][2] == O) || (board[0][i]==O && board[1][i]==O && board[2][i] == O)){
                return true;
            }
        }
        if((board[0][0]==O && board[1][1]==O && board[2][2] == O) || (board[0][2]==O && board[1][1]==O && board[2][0] == O)){
            return true;
        }
        return false;
    }

    if(Xwins()){
        return X;
    }else if(Owins()){
        return O;
    }else{
        return null;
    }

}

function terminal(board){
    var empty = false;
    board.forEach(row=>{
        row.forEach(element=>{
            if (element == null){
                empty=true;
            }
        })
    });

    if(empty == true && winner(board)==null){
        return false;
    }else{
        return true;
    }

}


function utility(board){
    if (terminal(board)==true){
        var won = winner(board);
        if(won == X){
            return 1;
        }else if(won == O){
            return -1;
        }else{
            return 0;
        }
    }
}

function maxValue(board){
    if(terminal(board)){
        return [utility(board),null];
    }
    var v=-2;
    var act = null;
    actions(board).forEach(action=>{
        var mV=minValue(result(board,action))[0];
        if (mV == -1 ){
            return [mV,action];
        }
        if (mV >= v){
            v=mV;
            act=action
        }
    });
    return [v,act];
}

function minValue(board){
    if(terminal(board)){
        return [utility(board),null];
    }
    var v=2;
    var act=null;
    actions(board).forEach(action=>{
        var mV=maxValue(result(board,action))[0];
        if(mV == 1){
            return [mV,action]
        }
        if(mV<=v){
            v=mV;
            act=action;
        }
    });
    return [v,act];
}

function minimax(board){
    if(terminal(board) == false){
        console.log(player(board));
        if (player(board) == X){
            return maxValue(board)[1];
        }else{
            return minValue(board)[1];
        }
    }else{
        return null;
    }
}

function updateBoard(){
    var i=0;
    board.forEach(row=>{
        var j=0;
        row.forEach(element=>{
            if(element != null){
                // console.log(i+""+j);
                document.getElementById(i+""+j).innerText=element;
            }
            j+=1;
        });
        i+=1;
    });
}

var user=null;
var ai_turn=false;

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

async function selectedPlayer(usr){
    document.getElementById("selectPlayer").style.display="none";
    document.getElementById("game").style.display="block";
    document.getElementById("user").innerHTML="You are playing as "+ usr;
    updateBoard();
    if(usr=='X'){
        document.getElementById("status").innerHTML="Your Turn";
        user="X";
    }else{
        document.getElementById("status").innerHTML="Computer Thinking...";
        document.getElementById("board").style.pointerEvents="none";
        await delay(500);
        user="O";
        ai_turn=true;
        var i=Math.floor(Math.random()*3);
        var j=Math.floor(Math.random()*3);
        
        
        board=result(board,[i,j]);
        console.log(board);
        ai_turn=false;
        document.getElementById("status").innerHTML="Your Turn";
        document.getElementById("board").style.pointerEvents="auto";
        updateBoard();
    }
    
}
var game_over=false;
function over(){
    console.log("player is ",winner(board))
    if (winner(board)==user){
        document.getElementById("status").innerHTML="Your Won";
    }else if (winner(board)==null){
        document.getElementById("status").innerHTML="Game Tie!";
    }else{
        document.getElementById("status").innerHTML="AI Won!!";
    }
    document.getElementById("status").innerHTML=document.getElementById("status").innerHTML+"<br>Please Refresh to play again!!";
}

async function clicked(location){
    if((ai_turn==false) && (board[location[0]][location[1]] == EMPTY ) && (game_over==false)){
        board[location[0]][location[1]]=user;
        updateBoard();
        game_over=terminal(board);
        if(game_over){
            over();
        }else{
            ai_turn=true;
            document.getElementById("status").innerHTML="Computer Thinking...";
            document.getElementById(location[0]+""+location[1]).style.pointerEvents="none";
            await delay(500);
            var move=minimax(board);
            console.log("AI Moved at ",move);
            board=result(board,move);
            ai_turn=false;
            document.getElementById("status").innerHTML="Your Turn";
            updateBoard();
            game_over=terminal(board);
            if(game_over){
                over("AI");
            }
        }

    }else if(ai_turn == true){
        document.getElementById(location[0]+""+location[1]).style.backgroundColor="red";
        document.getElementById(location[0]+""+location[1]).style.borderRadius="5px";
        document.getElementById(location[0]+""+location[1]).style.backgroundColor="red";
    }
}


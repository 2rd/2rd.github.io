const uri = "https://visningsrom.stacc.com/dd_server_worms/rest/boards/";

var board;
var boardArray;

//Load data from server

function get(url, func) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            func(this);
        }
    }
    xhr.open("GET", url, true);
    xhr.send();
}

function load(boardNumber) {
    setBoard(boardNumber);
}

function setBoardArray(board) {
    if (board) {
        this.boardArray = [];
        for (i = 1; i <= (board.dimY*board.dimX); i++) {
            let url = uri + board.id + "/" + i;
            get(url, getSquareData);            
        }    
    }
    else(console.log("board not loaded"))
}

function getSquareData(xhttp) {
    if (xhttp) {
        let square = JSON.parse(xhttp.response);
        boardArray.push(square);
        showWormholes(square);
    }
}

function setBoard(boardNumber){
    let url = uri + boardNumber;
    console.log(url);
    get(url, boardData);
}

function boardData(xhttp) {
    if (xhttp) {
        let b = JSON.parse(xhttp.response);
        this.board = b;
        setBoardArray(b);
        showBoardData(b);
    }
}

//Forsøk på en shortest path algoritme. Returnerer undefined.

class Node {
    constructor(number, distance) {
        this.number = number;
        this.distance = distance;
    }
}

//rekursiv metode som tar et array med ubesøkte noder, et square-number og brettets mål.
function minPath(unvisited, current, destination) {
    //end of the board
    if (current > this.boardArray.length) {
        return 1000;
    }

    //if reached goal, return distance to goal.
    if (current == destination) {
        return unvisited[current - 1].distance;
    }
    var distance = unvisited[current - 1].distance;

    //set current to visited (1000)
    unvisited[current - 1] = 1000;

    var wormPath;
    var regularPath;

    //check if current square has a wormhole and is unvisited.
    //If yes, find the shortest distance from the landing square to goal.
    if (this.boardArray[current - 1].wormhole) {

        var wormhole = this.boardArray[this.boardArray[current - 1].wormhole - 1].number;
        if (unvisited[wormhole - 1] != 1000) {
            //check if a faster way to the square already exists.
            if (distance < unvisited[wormhole - 1].distance) {
                unvisited[wormhole].distance = parseInt(distance) + 1;
                console.log("wormhole: " + current + " to " + wormhole)
                wormPath = minPath(unvisited, wormhole, destination);
                console.log("wormpath:" + wormPath)
            }
        }
    }
    //if not visited already and a shorter path to it doesn't exist, jump to the next square.
    if (unvisited[current] != 1000) {
        if (distance < unvisited[current].distance) {
            unvisited[current].distance = parseInt(distance) + 1;
            regularPath = minPath(unvisited, current + 1, destination);
        }
    }


    //if there was a wormhole and a regular path from the current square, 
    //run minPath on the one that provide the fastest route to goal.
    //Else run minPath on the only available move (wormhole or next).
    if (wormPath && regularPath) {
        console.log("comparison  " + wormPath + "     " + regularPath);
        if (wormPath < regularPath) {
            return minPath(unvisited, wormhole, destination);
        } else {
            return minPath(unvisited, current, destination);
        }
    } else if (regularPath) {
        return minPath(unvisited, current, destination);
    } else if (wormPath) {
        return minPath(unvisited, wormhole, destination);
    }
}

//UI

function loadBtn() {
    load(document.getElementById("boardNumber").value);
}

function showWormholes(square) {

    if (square.wormhole) {
        document.getElementById("wormholes").innerHTML += square.number + " - " + square.wormhole + ", ";
    }

}

function showBoardData(board) {
    document.getElementById("boardHeader").innerHTML = "Board " + board.id;
    document.getElementById("name").innerHTML = board.name;
    document.getElementById("size").innerHTML = board.size;
    document.getElementById("start").innerHTML = board.start + " - " + board.goal;
    document.getElementById("wormholes").innerHTML = " ";
     
    document.getElementById("boardData").style = "display: flex";
    document.getElementById("btns").style = "display: flex";
}

function minPathBtn() {
    var array = sortArray(this.boardArray, boardArray.length - 1);
    console.log(array)
    var unvisited = [];
    for (let i in array) {
        let node = new Node(array[i].number, i);
        unvisited.push(node);
    }
    console.log(minPath(unvisited, this.board.start, this.board.goal));
}

//Assisting method insertion sort.
function sortArray(array, n) {
    if (n > 0) {
        sortArray(array, n - 1);
        let x = array[n];
        let j = n - 1;
        while (j >= 0 && array[j] > x) {
            array[j + 1] = array[j];
            j = j - 1
        }
        array[j + 1] = x;
        return array;
    }
}

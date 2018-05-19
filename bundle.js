(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Cell = /** @class */ (function () {
    function Cell(x, y) {
        this.explosive = false;
        this.neighbours = 0;
        this.clicked = false;
        this.flagged = false;
        this.x = x;
        this.y = y;
    }
    Cell.prototype.isMine = function () {
        return this.explosive;
    };
    Cell.prototype.setMine = function (m) {
        this.explosive = m;
    };
    Cell.prototype.setNeighbours = function (n) {
        this.neighbours = n;
    };
    Cell.prototype.getNeighbours = function () {
        return this.neighbours;
    };
    Cell.prototype.setClicked = function (c) {
        this.clicked = true;
    };
    Cell.prototype.isClicked = function () {
        return this.clicked;
    };
    Cell.prototype.setFlagged = function (f) {
        this.flagged = f;
    };
    Cell.prototype.isFlagged = function () {
        return this.flagged;
    };
    return Cell;
}());
exports.Cell = Cell;
//this function finds neighbours of a given cell index
function findNeighbours(x, y, field) {
    var neighbours = 0;
    var previousRow;
    var row = field[y];
    var nextRow;
    if (y < field.length) {
        nextRow = field[y + 1];
    }
    if (y > 0) {
        previousRow = field[y - 1];
    }
    var tl, tt, tr;
    var bl, bb, br;
    var lc, rc;
    var arr = [];
    //top
    if (y > 0) {
        tt = previousRow[x];
    }
    //bottom
    if (y < field.length - 1) {
        bb = nextRow[x];
    }
    //right
    if (x > 0) {
        rc = row[x - 1];
    }
    //left
    if (x < row.length) {
        lc = row[x + 1];
    }
    //top-left
    if (x > 0 && y > 0) {
        tl = previousRow[x - 1];
    }
    //top-right
    if (x < row.length && y > 0) {
        tr = previousRow[x + 1];
    }
    //bottom-right
    if (x < row.length && y < field.length - 1) {
        br = nextRow[x + 1];
    }
    //bottom-left
    if (x > 0 && y < field.length - 1) {
        bl = nextRow[x - 1];
    }
    if (tl) {
        arr.push(tl);
    }
    if (tr) {
        arr.push(tr);
    }
    if (tt) {
        arr.push(tt);
    }
    if (bl) {
        arr.push(bl);
    }
    if (br) {
        arr.push(br);
    }
    if (bb) {
        arr.push(bb);
    }
    if (rc) {
        arr.push(rc);
    }
    if (lc) {
        arr.push(lc);
    }
    return arr;
}
exports.findNeighbours = findNeighbours;

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var MineGenerator = /** @class */ (function () {
    function MineGenerator(nMines) {
        this.totalMines = nMines;
        this.numberMines = 0;
    }
    MineGenerator.prototype.generateMine = function () {
        if (this.totalMines == this.numberMines)
            return false;
        var rand = Math.floor(Math.random() * (100 + 1) + 1);
        if (rand < 30) {
            this.numberMines++;
            return true;
        }
        return false;
    };
    MineGenerator.prototype.getNumberMines = function () {
        return this.numberMines;
    };
    MineGenerator.prototype.getTotalMines = function () {
        return this.totalMines;
    };
    return MineGenerator;
}());
exports.MineGenerator = MineGenerator;

},{}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var cell_1 = require("./cell");
var minegenerator_1 = require("./minegenerator");
function reset() {
    clearInterval(numscore);
    scorelabel.innerHTML = "";
    hiscorelabel.innerHTML = "";
    game.innerHTML = "";
    field = [];
    first = true;
    mg = new minegenerator_1.MineGenerator(nmines);
    for (var y = 0; y < height; y++) {
        var rowArray = [];
        for (var x = 0; x < width; x++) {
            var c = new cell_1.Cell(x, y);
            rowArray.push(c);
        }
        field.push(rowArray);
    }
    while (mg.getNumberMines() != mg.getTotalMines()) {
        if (mg.getNumberMines() == width * height)
            break;
        var randx = Math.floor(Math.random() * (width + 0) + 0);
        var randy = Math.floor(Math.random() * (height + 0) + 0);
        var c = field[randy][randx];
        if (!c.isMine()) {
            c.setMine(mg.generateMine());
        }
    }
    for (var y = 0; y < height; y++) {
        var row = document.createElement("div");
        row.className = "row";
        for (var x = 0; x < width; x++) {
            var currentCell = field[y][x];
            var n = 0;
            var neighbours = cell_1.findNeighbours(x, y, field);
            for (var _i = 0, neighbours_1 = neighbours; _i < neighbours_1.length; _i++) {
                var c = neighbours_1[_i];
                if (c.isMine())
                    n++;
            }
            currentCell.setNeighbours(n);
            var cell = document.createElement("div");
            cell.className = "cell ";
            cell["x"] = x;
            cell["y"] = y;
            cell.addEventListener("click", checkIfMine);
            cell.addEventListener("contextmenu", flagCell);
            row.appendChild(cell);
        }
        game.appendChild(row);
    }
    minesLeft = mg.getNumberMines();
    mineslabel.innerHTML = "Mines: " + minesLeft;
}
//sets the correct class for coloring the cell
function setNumber(elem, n) {
    var str = "";
    switch (n) {
        case 1:
            str = " one";
            break;
        case 2:
            str = " two";
            break;
        case 3:
            str = " three";
            break;
        case 4:
            str = " four";
            break;
        case 5:
            str = " five";
            break;
        case 6:
            str = " six";
            break;
        case 7:
            str = " seven";
            break;
        case 8:
            str = " eight";
            break;
    }
    elem.className += str;
    elem.innerHTML = "" + n;
}
//counts how many mines are missing
function countMissing() {
    var num = 0;
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (!field[i][j].isClicked())
                num++;
        }
    }
    return num;
}
function disableAll() {
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var n = game.childNodes[y].childNodes[x];
            n.removeEventListener("click", checkIfMine);
            n.removeEventListener("contextmenu", flagCell);
            if (n.className.indexOf("clicked") == -1) {
                n.className = " disabled clicked";
            }
            var temp = field[y][x];
            if (temp.isMine()) {
                n.innerHTML = "&#9679;";
            }
            else if (temp.isFlagged()) {
                n.innerHTML = "X";
                n.style.color = "red";
            }
            clearInterval(numscore);
        }
    }
}
//flags a cell/ deflags it
function flagCell(ev) {
    ev.preventDefault();
    var x = ev.target.x;
    var y = ev.target.y;
    var c = field[y][x];
    if (!c.isClicked() && c.isFlagged()) {
        ev.target.className = "cell";
        c.setFlagged(false);
        ev.target.innerHTML = "";
        minesLeft++;
    }
    else if (!c.isClicked()) {
        ev.target.className = "flagged";
        ev.target.innerHTML = "&#9873";
        c.setFlagged(true);
        minesLeft--;
        mineslabel.innerHTML = "Mines: " + minesLeft;
    }
}
//checks if a flag is a mine
function checkIfMine(ev) {
    var x = ev.target.x;
    var y = ev.target.y;
    var c = field[y][x];
    var htmlCell = ev.target;
    if (c.isFlagged())
        return;
    if (first) {
        if (c.isMine() || c.getNeighbours() > 0) {
            if (nmines < width * height && nmines / (width * height) < 0.9) {
                while (c.getNeighbours() > 0 || c.isMine()) {
                    reset();
                    c = field[y][x];
                    htmlCell = game.childNodes[y].childNodes[x];
                }
            }
            else if (nmines < width * height) {
                while (c.isMine()) {
                    reset();
                    c = field[y][x];
                    htmlCell = game.childNodes[y].childNodes[x];
                }
            }
        }
        first = false;
        handleScore();
    }
    if (c.isMine()) {
        disableAll();
        htmlCell.className = "exploded";
        htmlCell.removeEventListener("click", checkIfMine);
        htmlCell.removeEventListener("contextmenu", flagCell);
        // reset();
    }
    else {
        c.setClicked(true);
        htmlCell.className = "clicked";
        htmlCell.removeEventListener("click", checkIfMine);
        htmlCell.removeEventListener("contextmenu", flagCell);
        if (c.getNeighbours() > 0) {
            setNumber(htmlCell, c.getNeighbours());
        }
        else {
            //zero neighbours, expand as much as possible
            expand(c.x, c.y);
        }
        if (countMissing() == mg.getNumberMines()) {
            alert("You won!");
            disableAll();
            var hi = localStorage.getItem("hi" + difficulty);
            if (difficulty == "custom") {
                score = score - nmines + width * height;
            }
            if (hi && parseFloat(hi) > score) {
                hiscorelabel.innerHTML = "High-Score: " + score;
                hiscorelabel.innerHTML = "High-Score (" + difficulty + "): " + hi;
                localStorage.setItem("hi" + difficulty, "" + score);
            }
            else {
                localStorage.setItem("hi" + difficulty, "" + score);
            }
            clearInterval(numscore);
        }
    }
}
//this function expands empty areas discovered
function expand(x, y) {
    var arr = cell_1.findNeighbours(x, y, field);
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var c = arr_1[_i];
        var n = game.childNodes[c.y].childNodes[c.x];
        if (c.getNeighbours() == 0 && c.isClicked() == false) {
            c.setClicked(true);
            n.className = "clicked";
            expand(c.x, c.y);
        }
        else if (c.getNeighbours() > 0 && c.isClicked() == false) {
            c.setClicked(true);
            n.className = "clicked";
            setNumber(n, c.getNeighbours());
        }
    }
}
function handleScore() {
    clearInterval(numscore);
    score = 0;
    scorelabel.innerHTML = "Score: " + score;
    var hi = localStorage.getItem("hi" + difficulty);
    if (hi) {
        hiscorelabel.innerHTML = "High-Score (" + difficulty + "): " + hi;
    }
    else {
        hiscorelabel.innerHTML = "";
    }
    numscore = setInterval(function () {
        score++;
        scorelabel.innerHTML = "Score: " + score;
    }, 1000);
}
var field = [];
var game;
var mineslabel;
var scorelabel;
var hiscorelabel;
var width = 7;
var height = 7;
var nmines = 7;
var mg;
var score;
var numscore = 0;
var minesLeft;
var difficulty = "easy";
var first = true;
window.onload = function () {
    game = document.getElementById("game");
    mineslabel = document.getElementById("mines");
    scorelabel = document.getElementById("score");
    hiscorelabel = document.getElementById("hiscore");
    var newGame = document.getElementById("new");
    newGame.addEventListener("click", function () {
        var w = parseFloat(document.getElementById("width").value);
        var h = parseFloat(document.getElementById("height").value);
        var m = parseFloat(document.getElementById("numberMines").value);
        if (!isNaN(w) && w > 1 && w <= 30) {
            width = w;
        }
        if (!isNaN(h) && h > 1 && h <= 30) {
            height = h;
        }
        if (!isNaN(m) && m <= 200 && m > 1) {
            nmines = m;
        }
        difficulty = "custom";
        reset();
    });
    var ez = document.getElementById("ez");
    ez.addEventListener("click", function () { width = 7; height = 7; nmines = 7; difficulty = "easy"; reset(); });
    var mm = document.getElementById("mm");
    mm.addEventListener("click", function () { width = 10; height = 10; nmines = 20; difficulty = "medium"; reset(); });
    var hard = document.getElementById("hard");
    hard.addEventListener("click", function () { width = 15; height = 15; nmines = 50; difficulty = "hard"; reset(); });
    var vhard = document.getElementById("vhard");
    vhard.addEventListener("click", function () { width = 20; height = 20; nmines = 100; difficulty = "very hard"; reset(); });
    reset();
};

},{"./cell":2,"./minegenerator":3}]},{},[1,2,3,4]);

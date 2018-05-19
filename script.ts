import {Cell, findNeighbours} from "./cell";
import {MineGenerator} from "./minegenerator"

function reset():void{

	clearInterval(numscore);
	scorelabel.innerHTML="";

	var hi:string = localStorage.getItem("hi"+difficulty);
	if(hi){
		hiscorelabel.innerHTML="High-Score ("+difficulty+"): "+hi;
	} else {
		hiscorelabel.innerHTML="";
	}


	game.innerHTML = "";
	field=[];
	first = true;

	mg = new MineGenerator(nmines);



	for(let y = 0; y < height; y++){
		var rowArray:Array<Cell> = [];
		for(let x = 0; x < width; x++){
			var c:Cell = new Cell(x, y);
			rowArray.push(c);
		}
		field.push(rowArray);
	}

	while (mg.getNumberMines() != mg.getTotalMines()){
		if(mg.getNumberMines() == width*height) break;
		var randx:number = Math.floor(Math.random()*(width+0)+0);
		var randy:number = Math.floor(Math.random()*(height+0)+0);

		var c:Cell = field[randy][randx];

		if(!c.isMine()){
			c.setMine(mg.generateMine());
		}

	}


	for(let y = 0; y < height; y++){
		var row:HTMLElement = document.createElement("div");
		row.className = "row";
		for(let x = 0; x < width; x++){
			var currentCell:Cell = field[y][x];
			var n:number = 0;
			var neighbours:Array<Cell> = findNeighbours(x, y, field);
			for(var c of neighbours){
				if(c.isMine()) n++;
			}
			currentCell.setNeighbours(n);

			var cell:HTMLElement = document.createElement("div");
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

	mineslabel.innerHTML = "Mines: "+minesLeft;
}

//sets the correct class for coloring the cell
function setNumber(elem:HTMLElement, n:number):void{
var str:string = "";
switch(n){
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
elem.innerHTML = ""+n;
}

//counts how many mines are missing
function countMissing():number{
	var num:number = 0;
	for(let i=0; i<height; i++){
		for (let j=0; j<width; j++){
			if(!field[i][j].isClicked()) num++;
		}
	}
	return num;
}

function disableAll():void{
	for(let y=0; y < height; y++){
		for(let x=0; x < width; x++){
			var n:HTMLElement = (<HTMLElement> game.childNodes[y].childNodes[x]);
			n.removeEventListener("click", checkIfMine);
			n.removeEventListener("contextmenu", flagCell);

			if(n.className.indexOf("clicked") == -1){
				n.className = " disabled clicked";
			}

			var temp:Cell = field[y][x];
			if(temp.isMine()){
				n.innerHTML = "&#9679;"
			} else if(temp.isFlagged()){
				n.innerHTML = "X"
				n.style.color = "red";
			}
			clearInterval(numscore);
		}
	}
}


//flags a cell/ deflags it
function flagCell(ev):void{
	ev.preventDefault();
	var x:number = ev.target.x;
	var y:number = ev.target.y;

	var c:Cell = field[y][x];

	if(!c.isClicked() && c.isFlagged()){
		ev.target.className = "cell";
		c.setFlagged(false);
		ev.target.innerHTML = "";
		minesLeft++;
	} else if(!c.isClicked()){
		ev.target.className = "flagged";
		ev.target.innerHTML = "&#9873";
		c.setFlagged(true);
		minesLeft--;
		mineslabel.innerHTML = "Mines: "+minesLeft;
	}
}

//checks if a flag is a mine
function checkIfMine(ev):void{
	var x:number = ev.target.x;
	var y:number = ev.target.y;

	var c:Cell = field[y][x];

	var htmlCell:HTMLElement = ev.target;

	if(c.isFlagged()) return;


	if(first){
		if(c.isMine() || c.getNeighbours() > 0){
			if(nmines < width*height && nmines/(width*height) < 0.9){
				while(c.getNeighbours() > 0 || c.isMine()){
					reset();
					c = field[y][x];
					htmlCell = (<HTMLElement> game.childNodes[y].childNodes[x]);
				}
			} else if (nmines < width*height){
				while(c.isMine()){
					reset();
					c = field[y][x];
					htmlCell = (<HTMLElement> game.childNodes[y].childNodes[x]);
				}
			}
		}
		first=false;
		handleScore();
	}

	if (c.isMine()){
		disableAll();

		htmlCell.className = "exploded"
		htmlCell.removeEventListener("click", checkIfMine);
		htmlCell.removeEventListener("contextmenu", flagCell);

	// reset();
	} else {
		c.setClicked(true);
		htmlCell.className = "clicked";
		htmlCell.removeEventListener("click", checkIfMine);
		htmlCell.removeEventListener("contextmenu", flagCell);
		if(c.getNeighbours() > 0){
			setNumber(htmlCell, c.getNeighbours());
		} else {
			//zero neighbours, expand as much as possible
			expand(c.x, c.y);
	}
		if(countMissing() == mg.getNumberMines()){
			alert("You won!");
			disableAll();
			var hi:string = localStorage.getItem("hi"+difficulty);
			if(difficulty == "custom"){
				score = score - nmines + width*height;
			}
			if(hi && parseFloat(hi) > score){
				hiscorelabel.innerHTML = "High-Score: "+score;
				hiscorelabel.innerHTML="High-Score ("+difficulty+"): "+hi;
				localStorage.setItem("hi"+difficulty, ""+score);
			} else {
				localStorage.setItem("hi"+difficulty, ""+score);
			}
			clearInterval(numscore);
		}
	}
}

//this function expands empty areas discovered
function expand(x:number, y:number):void{
	var arr:Array<Cell> = findNeighbours(x, y, field);

	for(let c of arr){
		var n:HTMLElement = (<HTMLElement> game.childNodes[c.y].childNodes[c.x]);
		if(c.getNeighbours() == 0 && c.isClicked() == false){
			c.setClicked(true);
			n.className = "clicked";
			expand(c.x, c.y);
		} else if(c.getNeighbours() > 0 && c.isClicked() == false){
			c.setClicked(true);
			n.className = "clicked";
			setNumber(n, c.getNeighbours());
		}
	}
}


function handleScore(){
	clearInterval(numscore);
	score = 0;
	scorelabel.innerHTML="Score: "+score;

	numscore = setInterval(
		function(){
			score++;
			scorelabel.innerHTML="Score: "+score;
		}, 1000);
}



var field:Array<Array<Cell>> = [];
var game:HTMLElement;
var mineslabel:HTMLElement;
var scorelabel:HTMLElement;
var hiscorelabel:HTMLElement;
var width:number = 7;
var height:number = 7;
var nmines:number = 7;
var mg:MineGenerator;
var score:number;
var numscore:number = 0;
var minesLeft:number;
var difficulty:string = "easy";
var first:boolean = true;



window.onload = function(){
	game = document.getElementById("game");
	mineslabel = document.getElementById("mines");
	scorelabel = document.getElementById("score");
	hiscorelabel = document.getElementById("hiscore");
	var newGame:HTMLElement = document.getElementById("new");
	newGame.addEventListener("click", ()=>{
		var w:number = parseFloat((<HTMLInputElement>document.getElementById("width")).value);
		var h:number = parseFloat((<HTMLInputElement>document.getElementById("height")).value);
		var m:number = parseFloat((<HTMLInputElement>document.getElementById("numberMines")).value);

		if(!isNaN(w) && w > 1 && w <= 30){
			width = w;
		}
		if(!isNaN(h) && h > 1 && h <= 30){
			height = h;
		}
		if(!isNaN(m) && m <= 200 && m > 1){
			nmines = m;
		}
		difficulty="custom";
		reset();
	});

	var ez:HTMLElement = document.getElementById("ez");
	ez.addEventListener("click", ()=>{width=7; height=7; nmines=7; difficulty="easy"; reset();});

	var mm:HTMLElement = document.getElementById("mm");
	mm.addEventListener("click", ()=>{width=10; height=10; nmines=20; difficulty="medium"; reset();});

	var hard:HTMLElement = document.getElementById("hard");
	hard.addEventListener("click", ()=>{width=15; height=15; nmines=50; difficulty="hard"; reset();});

	var vhard:HTMLElement = document.getElementById("vhard");
	vhard.addEventListener("click", ()=>{width=20; height=20; nmines=100; difficulty="very hard"; reset();});

	reset();
}

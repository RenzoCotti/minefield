export class Cell {
	private explosive:boolean;
	private neighbours:number;
	private clicked:boolean;
	private flagged:boolean;
	public x:number;
	public y:number;
	constructor(x:number, y:number){
		this.explosive = false;
		this.neighbours = 0;
		this.clicked = false;
		this.flagged = false;
		this.x = x;
		this.y = y;
	}

	isMine():boolean{
		return this.explosive;
	}

	setMine(m:boolean):void{
		this.explosive = m;
	}

	setNeighbours(n:number):void{
		this.neighbours = n;
	}

	getNeighbours():number{
		return this.neighbours;
	}

	setClicked(c:boolean):void{
		this.clicked = true;
	}

	isClicked():boolean{
		return this.clicked;
	}

	setFlagged(f:boolean):void{
		this.flagged = f;
	}

	isFlagged():boolean{
		return this.flagged;
	}
}

//this function finds neighbours of a given cell index
export function findNeighbours(x:number, y:number, field:Array<Array<Cell>>):Array<Cell>{
	var neighbours:number = 0;

	var previousRow:Array<Cell>;
	var row:Array<Cell> = field[y];
	var nextRow:Array<Cell>;


	if(y < field.length) { nextRow = field[y+1]; }

	if(y > 0) { previousRow = field[y-1]; }


	var tl:Cell, tt:Cell, tr:Cell;
	var bl:Cell, bb:Cell, br:Cell;
	var lc:Cell, rc:Cell;

	var arr:Array<Cell> = [];


	//top
	if(y > 0){ tt = previousRow[x]; }
	//bottom
	if(y < field.length-1){ bb = nextRow[x]; }
	//right
	if(x > 0){ rc = row[x-1]; }
	//left
	if(x < row.length){ lc = row[x+1]; }
	//top-left
	if(x > 0 && y > 0){ tl = previousRow[x-1]; }
	//top-right
	if(x < row.length && y > 0){ tr = previousRow[x+1]; }
	//bottom-right
	if(x < row.length && y < field.length-1){ br = nextRow[x+1]; }
	//bottom-left
	if(x > 0 && y < field.length-1){ bl = nextRow[x-1]; }

	if(tl){ arr.push(tl); }
	if(tr){ arr.push(tr); }
	if(tt){ arr.push(tt); }
	if(bl){ arr.push(bl); }
	if(br){ arr.push(br); }
	if(bb){ arr.push(bb); }
	if(rc){ arr.push(rc); }
	if(lc){ arr.push(lc); }

	return arr;
}

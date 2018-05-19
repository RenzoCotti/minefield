export class MineGenerator{
	numberMines:number;
	totalMines:number;
	constructor(nMines:number){
		this.totalMines = nMines;
		this.numberMines = 0;
	}

	generateMine():boolean{
		if(this.totalMines == this.numberMines) return false;

		var rand = Math.floor(Math.random()*(100+1)+1);
		if(rand < 30){
			this.numberMines++;
			return true;
		}
		return false;
	}

	getNumberMines():number{
		return this.numberMines;
	}

	getTotalMines():number{
		return this.totalMines;
	}
}

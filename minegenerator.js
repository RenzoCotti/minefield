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

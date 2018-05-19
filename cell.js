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

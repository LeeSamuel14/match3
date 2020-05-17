var Match3 = Match3 || {};

Match3.Board = function(state, rows, cols, blockVariations){
    this.state = state;
    this.rows = rows;
    this.cols = cols;
    this.blockVariations = blockVariations;

    this.grid = [];
    var i, j;
    for(i = 0; i < rows; i++){
        this.grid.push([]);
        for(j = 0; j < cols; j++){
            this.grid[i].push(0);
        }
    }

    //when blocks are needed
    this.reserveGrid = [];
    this.RESERVE_ROW = 5;

    for(i = 0; i < this.RESERVE_ROW; i++){
        this.reserveGrid.push([]);
        for(j = 0; j < cols; j++){
            this.reserveGrid[i].push(0);
        }
    }
    this.populateGrid();
    this.populateReserveGrid();

};

Match3.Board.prototype.populateGrid = function(){
    var i, j, variation;
    for(i=0 ; i < this.rows; i++){
        for(j = 0; j < this.cols; j++){
            variation = Math.floor( Math.random() * this.blockVariations) + 1;
            this.grid[i][j] = variation;
        }
    }
};

Match3.Board.prototype.populateReserveGrid = function(){
    var i, j, variation;
    for(i=0 ; i < this.RESERVE_ROW; i++){
        for(j = 0; j < this.cols; j++){
            variation = Math.floor( Math.random() * this.blockVariations) + 1;
            this.reserveGrid[i][j] = variation;
        }
    }
};

Match3.Board.prototype.consoleLog = function(){
    //console.table(this.reserveGrid);
    //console.table(this.grid);
    var i, j;
    var prettyString = '';
    for(i=0 ; i < this.RESERVE_ROW; i++){
        prettyString += '\n';
        for(j = 0; j < this.cols; j++){
            prettyString += ' ' + this.reserveGrid[i][j];
        }
    }
    prettyString += '\n';
    for(j = 0; j < this.cols; j++){
        prettyString += ' -';
    }
    for(i=0 ; i < this.rows; i++){
        prettyString += '\n';
        for(j = 0; j < this.cols; j++){
            prettyString += ' '+ this.grid[i][j];
        }
    } 

    console.log(prettyString);
};

Match3.Board.prototype.swap = function(source, target){
    var temp = this.grid[target.row][target.col];
    this.grid[target.row][target.col] = this.grid[source.row][source.col];
    this.grid[source.row][source.col] = temp;
};

Match3.Board.prototype.checkAdjacent = function(source, target){
    var diffRow = Math.abs(source.row - target.row);
    var diffCol = Math.abs(source.col - target.col);

    var isAdjacent = (diffRow === 1 && diffCol === 0) || (diffRow === 0 && diffCol === 1);
    return isAdjacent;
};

Match3.Board.prototype.isChained = function(block){
    var isChained = false;
    var row = block.row;
    var col = block.col;
    var currentElement = this.grid[row][col];

    //left
    if(currentElement == this.grid[row][col-1] && currentElement == this.grid[row][col - 2]){
        isChained = true;
    }
    //right
    if(currentElement == this.grid[row][col+1] && currentElement == this.grid[row][col + 2]){
        isChained = true;
    }
    //down
    if(this.grid[row+2]){
        if(currentElement == this.grid[row+1][col] && currentElement == this.grid[row+2][col]){
        isChained = true;
        }
    }
    //up
    if(this.grid[row-2]){
        if(currentElement == this.grid[row-1][col] && currentElement == this.grid[row-2][col]){
        isChained = true;
        }
    }
    //center vertically
    if(this.grid[row-1] && this.grid[row+1]){
        if(currentElement == this.grid[row-1][col] && currentElement == this.grid[row+1][col]){
        isChained = true;
        }
    }
    //center horizontally
    if(currentElement == this.grid[row][col-1] && currentElement == this.grid[row][col + 1]){
        isChained = true;
    }
    return isChained;
};

Match3.Board.prototype.findAllChains = function(){
    var chained = [];
    var i, j;
    for(i = 0; i< this.rows; i++){
        for(j = 0; j < this.cols; j++){
            if(this.isChained({row: i, col: j})){
                chained.push({row: i, col: j});
            }
        }
    }
    return chained;
};

Match3.Board.prototype.clearChains = function(){
    var chainedBlocks = this.findAllChains();
    chainedBlocks.forEach( function(block) {
        this.grid[block.row][block.col] = 0;
    }, this);
};

//drop block
Match3.Board.prototype.dropBlock = function(sourceRow, targetRow, col){
    this.grid[targetRow][col] = this.grid[sourceRow][col];
    this.grid[sourceRow][col] = 0;
};

Match3.Board.prototype.dropReserveBlock = function(sourceRow, targetRow, col){
    this.grid[targetRow][col] = this.reserveGrid[sourceRow][col];
    this.reserveGrid[sourceRow][col] = 0;
};
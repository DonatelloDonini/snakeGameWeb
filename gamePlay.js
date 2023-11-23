const updateScene= (gridNode, snake, apple, gridBackgroundColor, snakeColor, appleColor)=>{
    for (let i=0; i<gridNode.children.length; i++){
        const row= gridNode.children[i];
        for (let j=0; j<row.children.length; j++){
            if (coordInSnake(snake, [j, i])){
                gridUtility.getCell(gridNode, j, i).style.backgroundColor= snakeColor;
            }
            else if (apple[0]=== j && apple[1]=== i){
                gridUtility.getCell(gridNode, j, i).style.backgroundColor= appleColor;
            }
            else{
                gridUtility.getCell(gridNode, j, i).style.backgroundColor= gridBackgroundColor;
            }
        }
    }
}

const eatsApple= (snake, apple)=> {
    const eatsApple= (snake[snake.length-1][0]=== apple[0]) && (snake[snake.length-1][1]=== apple[1]);
    if (eatsApple){
        const lastTailCell= snake[0];
        const secondLastTailCell= snake[1];
        snake.push(apple);
    }
    return eatsApple;
}

const generateApple= (snake, gridNode)=>{
    const availableCoords= [];
    for (let y=0; y<gridNode.children.length; y++){
        const row= gridNode.children[y];
        for (let x=0; x<row.children.length; x++){
            if (! coordInSnake(snake, [x, y])) availableCoords.push([x, y]);
        }
    }
    return availableCoords[Math.floor(Math.random()* availableCoords.length)];
}

const hitsWalls= (snake, gridNode)=>{
    const snakeHead= snake[snake.length-1];
    const gridHeight= gridNode.children.length;
    const gridWidth= gridNode.children[0].children.length;
    return (
        snakeHead[0]>= gridWidth  ||
        snakeHead[0]<  0          ||
        snakeHead[1]>= gridHeight ||
        snakeHead[1]<  0
    )
}

const hitsHimself= (snake)=>{
    const snakeHead= snake[snake.length-1];
    for (let i=0; i<snake.length-1; i++){
        const tailCell= snake[i];
        if ((snakeHead[0]=== tailCell[0]) &&
            (snakeHead[1]=== tailCell[1])){
            return true;
        }
    }
    return false;
}

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

const coordInSnake= (snake, coord)=>{
    for (const snakeCoord of snake){
        if ((snakeCoord[0]=== coord[0]) && (snakeCoord[1]=== coord[1])){
            return true;
        }
    }
    return false
}

const moveSnake= (snake, direction)=>{
    if (snake.length<1) throw SnakeTooShortError("the snake passed in must have at least one cell of length");
    const snakeHead= snake[snake.length-1];
    
    switch (direction) {
        case 0: // up
            snake.push([snakeHead[0], snakeHead[1]-1]);
            break;
        case 1: // right
            snake.push([snakeHead[0]+1, snakeHead[1]]);
            break;
        case 2: // down
            snake.push([snakeHead[0], snakeHead[1]+1]);
            break;
        case 3: // left
            snake.push([snakeHead[0]-1, snakeHead[1]]);
            break;

        default:
            throw InvalidDirectionError("the direction entered in this function must be an integer number between 0 and 4");
    }
    snake.shift();
}

const gridUtility= {
    getEmptyGrid: function(h, w){
        const table= document.createElement("table");
        for (let i=0; i<h; i++){
            const tableRow= document.createElement("tr");
            for (let j=0; j<w; j++){
                const tableCell= document.createElement("td");
                tableRow.appendChild(tableCell);
            }
            table.appendChild(tableRow);
        }

        return table;
    },

    getCell: function(gridNode, x, y){
        const row= gridNode.children[y];
        const cell= row.children[x];
        return cell;
    },
}

const gameBoardWidth= 31;
const gameBoardHeight= 31;
const gameTickMilliseconds= 150;
const gameBoard= document.getElementById("gameplay");
const gridNode= gridUtility.getEmptyGrid(gameBoardWidth, gameBoardHeight);
gameBoard.appendChild(gridNode);

let score= 0;
let currDirection= 0;
document.addEventListener('keydown', (event)=>{
    switch (event.key) {
        case 'w':
            if (currDirection!== 2) currDirection= 0;
            break;
        case 'd':
            if (currDirection!== 3) currDirection= 1;
            break;
        case 's':
            if (currDirection!== 0) currDirection= 2;
            break;
        case 'a':
            if (currDirection!== 1) currDirection= 3;
            break;
    }
}, false);

// -------------------------------

async function gamePlay(){
    const startCoord= [parseInt(gameBoardWidth/2), parseInt(gameBoardHeight/2)];
    //    /\
    //     0
    //  <3   1>
    //     2
    //    \/
    
    const snake= [startCoord, [startCoord[0], startCoord[1]+1]];
    let apple= generateApple(snake, gridNode);
    let gameRunning= true;
    
    while (gameRunning){
        updateScene(gridNode, snake, apple, "#2A1F2D", "#56E39F", "#6D597A"); // TODO: update with updateScene
        await sleep(gameTickMilliseconds);
        moveSnake(snake, currDirection);
        if (hitsHimself(snake) || hitsWalls(snake, gridNode)){
            gameRunning= false;
        }
        if (eatsApple(snake, apple)){
            score++;
            apple= generateApple(snake, gridNode);
        }
    }
}

gamePlay();
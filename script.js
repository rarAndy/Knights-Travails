import {arrayEqualsArray, isArrayInArray} from './arrayFunctions.js';
import anime from './node_modules/animejs/lib/anime.es.js';


let x = []
let y = []

const boardSizeSlider = document.querySelector('.slider')

let boardSize = boardSizeSlider.value;
boardSizeSlider.addEventListener('click', () => {
    boardSize = boardSizeSlider.value;
    x=[];
    y=[];
    for (let i = 0; i < boardSize; i++){
        x.push(i)
        y.push(i)
    }
    
    createBoard();
    getCellCoords();
    console.log(coords)
    addTargets();
    initializeKnight();
    updateKnightDimensions();
    document.querySelector('.solution').textContent = ''
})


for (let i = 0; i < boardSize; i++){
    x.push(i)
    y.push(i)
}


/* function getMoves(pos) {
    let moves = []
    moves.push([x[pos[0]-2], y[pos[1]-1]])
    moves.push([x[pos[0]-1], y[pos[1]-2]])

    moves.push([x[pos[0]-2], y[pos[1]+1]])
    moves.push([x[pos[0]-1], y[pos[1]+2]])

    moves.push([x[pos[0]+2], y[pos[1]-1]])
    moves.push([x[pos[0]+1], y[pos[1]-2]])

    moves.push([x[pos[0]+2], y[pos[1]+1]])
    moves.push([x[pos[0]+1], y[pos[1]+2]])
    moves = moves.filter(move => move[0] && move[1] != undefined)
    console.log(moves)
    return moves
}

getMoves(knight) */

class Node {
    constructor(data) {
        this.data = data;
        this.parent = null;
        this.children = [];
    }
}

class Moves {
    constructor(root) {
        this.root = new Node(root);
    }

    buildTree() {
        let depth = 0
        let current = null;
        let q = [];
        
        let visitedList = [];
        let isSolved = false
        q.push(this.root);

        while (q) {
            //console.log('depth', depth)
            //console.log('queue', q)

            for (let i = 0; i < q.length; i++) {
                //console.log(visitedList)
                current = q.shift();
                //console.log('current data',current.data)
                visitedList.push(current.data);
                //console.log('visited list', visitedList)
                let dataQueue = q.map(e => e.data)
                //console.log('dataQueue', dataQueue)
                
                //console.log(current)
                //console.log(current.data, target, current.data[0] == target[0] && current.data[1] == target[1])
                
                if (current.data[0] == target[0] && current.data[1] == target[1]) {
                    isSolved = true;
                    break;
                }
                
                let newMoves = this.getMoves(current.data)
                newMoves.forEach(e => {
                    //console.log('visited list', visitedList)
                    //console.log('e',e)
                    //console.log('visited before?', isArrayInArray(visitedList, e))
                    //console.log('in queue?', isArrayInArray(dataQueue, e))
                    if (!isArrayInArray(visitedList, e) && !isArrayInArray(dataQueue, e)){
                        //console.log('newnode')
                        const newNode = new Node(e)
                        newNode.parent = current

                        current.children.push(newNode);
                    }
                });
                //console.log('current', current.data, 'children', current.children)
                current.children.forEach(e => {q.push(e)})
                dataQueue = q.map(e => e.data)
                //console.log('updated q', dataQueue)
    
                
            }
            depth += 1

            if(isSolved) {
                
                console.log('solved')
                let correctMoves = [];

                while(current.data[0] != this.root.data[0] || current.data[1] != this.root.data[1]) {
                    correctMoves.push(current.data)
                    current = current.parent;
                }
                //correctMoves.push(this.root.data)
                correctMoves = correctMoves.reverse()

                return correctMoves;
            }
        }
    }

    getMoves(pos) {
        let moves = []
        moves.push([x[pos[0]-2], y[pos[1]-1]])
        moves.push([x[pos[0]-1], y[pos[1]-2]])

        moves.push([x[pos[0]-2], y[pos[1]+1]])
        moves.push([x[pos[0]-1], y[pos[1]+2]])

        moves.push([x[pos[0]+2], y[pos[1]-1]])
        moves.push([x[pos[0]+1], y[pos[1]-2]])

        moves.push([x[pos[0]+2], y[pos[1]+1]])
        moves.push([x[pos[0]+1], y[pos[1]+2]])
        moves = moves.filter(move => (move[0] && move[1]) != undefined)

        return moves
    }
}

let knightPos = [7, 7];
let target = [0, 0];
let currentPos = [];

let path = new Moves(knightPos)
path.buildTree()

let knight = document.querySelector('.knight');
let newPosX = 0, newPosY = 0, startPosX = 0, startPosY = 0;


knight.addEventListener('mousedown', function(e){
    e.preventDefault();
    
    startPosX = e.clientX;
    startPosY = e.clientY;
    
    document.addEventListener('mousemove', mouseMove);

    
    document.addEventListener('mouseup', mouseUp);
});

function mouseUp() {
    console.log(mid[0])
    currentPos = findBoardIndices(mid[0])
    console.log('knightPos', currentPos)
    newPosX = mid[1];
    newPosY = mid[2]; 
    let knightDimensions = [knight.offsetWidth, knight.offsetHeight]
    knight.style.top = (newPosY-knightDimensions[1]/2)+ "px";
    knight.style.left = (newPosX-knightDimensions[0]/2)+ "px";

    document.querySelectorAll('.cell').forEach(e => {
        e.classList.remove('active')
    })
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp)
}

function findBoardIndices(cellDom) {
    let index = 0
    for (let i = x.length-1; i >= 0; i--){
        for (let j = 0; j < y.length; j++){
            if (index == cellDom.id) {
                //console.log(j, i)
                return [j, i];
            }
            index += 1;
        }
    }
}

let mid;
function mouseMove(e) {
    //console.log(e.clientX, e.clientY)
    newPosX = startPosX - e.clientX;
    newPosY = startPosY - e.clientY;

    startPosX = e.clientX;
    startPosY = e.clientY;

    knight.style.top = (knight.offsetTop - newPosY) + "px";
    knight.style.left = (knight.offsetLeft - newPosX) + "px";

    for (let i in coords){
        
        if(e.clientX >= coords[i].left && e.clientX <= coords[i].right){
            if (e.clientY >= coords[i].top && e.clientY <= coords[i].bottom) {
                
                coords[i].cell.classList.add('active')
                mid = [coords[i].cell, (coords[i].left + coords[i].right)/2, (coords[i].top + coords[i].bottom)/2]
            }
            else {
                coords[i].cell.classList.remove('active')
            }
        }
        else {
            coords[i].cell.classList.remove('active')
        }
        
    }
    
}

let coords = []
function getCellCoords() {
    coords = []
    document.querySelectorAll('.cell').forEach((cell) => {        
        let left = cell.offsetLeft
        let top = cell.offsetTop
        let right = left + cell.offsetWidth
        let bottom = top + cell.offsetHeight
        let midpoint = [(left + right)/2, (top + bottom)/2] 
        let index = findBoardIndices(cell)     
        //console.log(`left: ${left} \ntop: ${top} \nright: ${right} \nbottom: ${bottom}`)
        coords.push({cell, left, top, right, bottom, midpoint, index})
    })
    //console.log(coords)
    return coords;
}

let boardStatus = false;

function createBoard() {
    boardStatus = false;
    const boardContainer = document.querySelector('.board-container')
    boardContainer.textContent = '';
   
    let index = 0;
    let row = 1;
    
    for (let i = 0; i < x.length; i++){
        const cellRow = document.createElement('div');
        cellRow.classList.add('cell-row')
        cellRow.id = `row${row}`;
        
        for (let j = 0; j < y.length; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell')
            cell.id = index
            cellRow.appendChild(cell)
            index += 1;

/*             cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const targetCircle = document.createElement('div');
                targetCircle.classList.add('target-circle')
                cell.appendChild(targetCircle)

                target = findBoardIndices(cell)
                console.log(target)
            })
 */     

        }
        cellRow.style.cssText = `
        grid-template-columns: repeat(${y.length}, 1fr);
        grid-template-rows: 1fr;
        grid-row-start: ${row};
        grid-row-end: ${row+1};
        grid-column-start: 1;
        grid-column-end: ${y.length+1};
        `;
        boardContainer.appendChild(cellRow);
        row += 1;
    }


    boardContainer.style.cssText = `
        display:grid;
        width:500px;
        height:500px;
        grid-template-rows: repeat(${x.length}, 1fr);
        grid-template-columns: repeat(${y.length}, 1fr);
        border: 1px solid black;
        
        `;
    boardStatus = true;
}

function addTargets () {
    document.querySelectorAll('.cell').forEach((cell) => {
        
        cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const targetCircle = document.createElement('div');
            document.querySelectorAll('.cell').forEach((cell) => {
                if (cell.hasChildNodes()) {cell.textContent = ''}
            })
            targetCircle.classList.add('target-circle')
            cell.appendChild(targetCircle)
            console.log(cell)
            target = findBoardIndices(cell)
            console.log('target', target)
        })
    })
}


function checkBoardStatus() {
    if (!boardStatus) {
        window.setTimeout(checkBoardStatus, 100);
    }
    else {
        addTargets();
        getCellCoords();
    }
}

function updateKnightDimensions() {
    let newWidth = document.querySelector('.cell').offsetWidth * 0.55
    console.log(newWidth)
    knight.style.width = `${newWidth}px`
}

document.querySelector('.calculate-button').addEventListener('click', () => {
    
    let path = new Moves(currentPos);
    let correctMoves = path.buildTree();
    console.log(correctMoves)
    const solutionText = document.querySelector('.solution')
    solutionText.textContent = ''
    correctMoves.forEach((e) => {
        solutionText.textContent += `[${e}]\n`
    })
    animateKnight(correctMoves)
})

let knightStartCoords = [knight.offsetTop, knight.offsetLeft]
console.log(knightStartCoords)
function initializeKnight() {
    knight.style.top = knightStartCoords[0] + 502 + "px";
    knight.style.left = knightStartCoords[1] + "px";
}


createBoard();
checkBoardStatus();

let id = null;
function animateKnight (moveArray){
    
    function getMidCoords() {
        let coordsArray = [];
        moveArray.forEach(move => {
            coords.forEach((coord => {
                //console.log(coord.index, move)
                if (arrayEqualsArray(coord.index, move)){
                    coordsArray.push([coord.midpoint, coord.index]);
                    return
                };
            }));
        });
        //console.log(coordsArray)
        return coordsArray;
    }
    const midCoords = getMidCoords()
    console.log(midCoords)

    let knightDimensions = [knight.offsetWidth, knight.offsetHeight]
    let currentTargets = midCoords.map((coord) => {
        return [coord[0][0]-knightDimensions[0]/2, coord[0][1]-knightDimensions[1]/2]
    })
    //console.log(currentTargets)

    let posX = Number(knight.style.left.replace('px', ''));
    let posY = Number(knight.style.top.replace('px', ''));

    let timeline = anime.timeline({
        targets: '.knight',
        easing: 'easeInOutSine',
        duration: 500,
    });

    function moveToTarget(target){
        //console.log(target)
        if (posX > target[0]) {
            //console.log(posX,  target[0])
            timeline.add({
                translateX: -(posX-target[0])
            })
        }
 
        else if (posX < target[0]) {
            //console.log(posX,  target[0])
            timeline.add({
                translateX: target[0]-posX
            })
        }
        if (posY > target[1]) {
            //console.log(posY,  target[1])
            timeline.add({
                translateY: -(posY-target[1])
            })
        }
 
        else if (posY < target[1]) {
            //console.log(posY,  target[1])
            timeline.add({
                translateY: target[1]-posY
            })          
        }
    }

    moveToTarget(currentTargets[0])
    timeline.finished.then(updateParams)
    
    let index = 0
    function updateParams() {
        //Reset timeline to 0
        timeline = anime.timeline({
            targets: '.knight',
            easing: 'easeInOutSine',
            duration: 500,
        });
        
        //Repositions knight from transformation to coordinates
        knight.style.removeProperty('transform')
        knight.style.left = currentTargets[index][0] + 'px'
        knight.style.top = currentTargets[index][1] + 'px'
        currentPos = midCoords[index][1]
        //console.log(knight.style.left, knight.style.top)

        //Updates posX and posY
        posX = Number(knight.style.left.replace('px', ''));
        posY = Number(knight.style.top.replace('px', ''));

        index += 1;
        console.log('move', index);
        if (index >= currentTargets.length){return}      
    
        //Adds X and Y promises to the timeline, then once finished, updates again
        moveToTarget(currentTargets[index])
        timeline.finished.then(updateParams)
    }
}
    
console.log(coords)


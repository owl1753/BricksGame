const canvas = document.getElementById("canvas");
const timeBar = document.getElementById("time-bar");
const reloadButton = document.getElementById("reload-button");
const score = document.getElementById("score");
const ctx = canvas.getContext("2d");

const boxWidth = 40;
const boxHeight = 40;
const columnCount = 17; 
const rowCount = 10;

canvas.width = 1140;
canvas.height = 695;

const timeBarHeight = canvas.height - 70;
const interValWidth = (canvas.width - columnCount * boxWidth) / (columnCount + 1);
const interValHeight = (canvas.height - rowCount * boxHeight) / (rowCount + 1);
const maxTime = 120;
const deltaTime = 1 / 60;

let startScreen = true;
let playScreen = false;
let restartScreen = false;

let nowTime = 0;
let nowScore = 0;

boxArray = []

canvas.addEventListener("mouseup", (e) => {
    if (playScreen){
        let indexes = [];
        let sum = 0;

        for (let i = 0; i < boxArray.length; i++){
            const posX = boxArray[i].x + (boxArray[i].width / 2);
            const posY = boxArray[i].y + (boxArray[i].height / 2);
            if ((dragBox.x <= posX && posX <= (dragBox.x + dragBox.width) && dragBox.y <= posY && posY <= (dragBox.y + dragBox.height)) ||
                ((dragBox.x + dragBox.width) <= posX && posX <= dragBox.x && dragBox.y <= posY && posY <= (dragBox.y + dragBox.height)) || 
                (dragBox.x <= posX && posX <= (dragBox.x + dragBox.width) && (dragBox.y + dragBox.height) <= posY && posY <= dragBox.y) ||
                ((dragBox.x + dragBox.width) <= posX && posX <= dragBox.x && (dragBox.y + dragBox.height) <= posY && posY <= dragBox.y)) {
                indexes.push(i);
                sum += boxArray[i].number;
            }
        }

        dragBox.drag = false;
        dragBox.width = 0;
        dragBox.height = 0;

        console.log(indexes.length);

        if (indexes == null || sum != 10){
            return;
        }

        for (let i = 0; i < indexes.length; i++){
            boxArray.splice(indexes[i] - i, 1);
        }

        nowScore += indexes.length;
        score.innerText = "점수 : " + nowScore;

        const breakSound = new Audio('./assets/breakBricks.mp3');
        breakSound.play();
    }
});

canvas.addEventListener("mousedown", (e) => {
    if (playScreen){
        const cRect = canvas.getBoundingClientRect();
        dragBox.x = e.clientX - cRect.left;
        dragBox.y = e.clientY - cRect.top;
        dragBox.drag = true;
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (playScreen){
        if (!dragBox.drag){
            return;
        }
    
        const cRect = canvas.getBoundingClientRect();
        dragBox.width = (e.clientX - cRect.left) - dragBox.x;
        dragBox.height = (e.clientY -cRect.top) - dragBox.y;
    }
});

canvas.addEventListener("mouseout", (e) => {
    if (playScreen){
        dragBox.drag = false;
        dragBox.width = 0;
        dragBox.height = 0;
    }
});

canvas.addEventListener("click", (e) => {
    const cRect = canvas.getBoundingClientRect();
    const clickedX = e.clientX - cRect.left;
    const clickedY = e.clientY - cRect.top;

    if (startScreen){
        if (startButton.x <= clickedX && clickedX <= startButton.x + startButton.width && 
            startButton.y <= clickedY && clickedY <= startButton.y + startButton.height){
            startScreen = false;

            for (let i = interValHeight; i < canvas.height; i += boxHeight + interValHeight){
                for (let j = interValWidth; j < canvas.width; j += boxWidth + interValWidth){
                    randNum = Math.floor(Math.random() * 9) + 1;
                    newBox = new Box(j, i, randNum);
                    newBox.image.src = './assets/brick.png';
                    boxArray.push(newBox);
                }
            }

            reloadButton.hidden = false;
            score.innerText = "점수 : 0";

            nowScore = 0;
            nowTime = maxTime;

            playScreen = true;
        }
    }
    else if (restartScreen){
        if (restartButton.x <= clickedX && clickedX <= restartButton.x + startButton.width && 
            restartButton.y <= clickedY && clickedY <= restartButton.y + startButton.height){
            restartScreen = false;

            for (let i = interValHeight; i < canvas.height; i += boxHeight + interValHeight){
                for (let j = interValWidth; j < canvas.width; j += boxWidth + interValWidth){
                    randNum = Math.floor(Math.random() * 9) + 1;
                    newBox = new Box(j, i, randNum);
                    newBox.image.src = './assets/brick.png';
                    boxArray.push(newBox);
                }
            }

            reloadButton.hidden = false;
            score.innerText = "점수 : 0";

            nowScore = 0;
            nowTime = maxTime;

            playScreen = true;
        }
    }

});

reloadButton.addEventListener("click", (e) => {
    boxArray = []

    for (let i = interValHeight; i < canvas.height; i += boxHeight + interValHeight){
        for (let j = interValWidth; j < canvas.width; j += boxWidth + interValWidth){
            randNum = Math.floor(Math.random() * 9) + 1;
            newBox = new Box(j, i, randNum);
            newBox.image.src = './assets/brick.png';
            boxArray.push(newBox);
        }
    }

    nowTime = maxTime;
    nowScore = 0;
    score.innerText = "점수 : " + nowScore;
});

class Box {
    constructor(x, y, number){
        this.x = x;
        this.y = y;
        this.number = number;
        this.width = boxWidth;
        this.height = boxHeight;
        this.image = new Image();
    }
    draw(){
        const posX = this.x + (this.width / 2);
        const posY = this.y + (this.height / 2);
        if ((dragBox.x <= posX && posX <= (dragBox.x + dragBox.width) && dragBox.y <= posY && posY <= (dragBox.y + dragBox.height)) ||
            ((dragBox.x + dragBox.width) <= posX && posX <= dragBox.x && dragBox.y <= posY && posY <= (dragBox.y + dragBox.height)) || 
            (dragBox.x <= posX && posX <= (dragBox.x + dragBox.width) && (dragBox.y + dragBox.height) <= posY && posY <= dragBox.y) ||
            ((dragBox.x + dragBox.width) <= posX && posX <= dragBox.x && (dragBox.y + dragBox.height) <= posY && posY <= dragBox.y)) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.font = "30px san-serif";
        ctx.fillText(this.number, posX - 7, posY + 9);
    }
}

const dragBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    drag: false,
    draw() {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

const startButton = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2 - 35,
    width: 200,
    height: 70,
    draw() {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.font = "30px san-serif";
        ctx.fillText('START', (this.x + this.width / 2) - 45, this.y + this.height / 2 + 10);
    }
}

const ResultScore = {
    x : canvas.width / 2 ,
    y : canvas.height / 2,
    draw() {
        ctx.fillStyle = 'white';
        ctx.font = "40px san-serif";
        ctx.fillText("점수 : " + nowScore, this.x - 70, this.y - 35);
    }
}

const restartButton = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2 - 35 + 35,
    width: 200,
    height: 70,
    draw() {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.font = "30px san-serif";
        ctx.fillText('RESTART', (this.x + this.width / 2) - 65, this.y + this.height / 2 + 10);
    }
}

const drawBoxes = () => {
    for (let i = 0; i < boxArray.length; i++){
        boxArray[i].draw();
    }
}





function update(){
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (startScreen){
        reloadButton.hidden = true;
        score.innerText = "";
        startButton.draw();
    }
    else if (playScreen){
        drawBoxes();
        if (dragBox.drag == true){
            dragBox.draw();
        }
        if (nowTime >= 0){
            
            nowTime -= deltaTime;
        }
        else{
            playScreen = false;
            restartScreen = true;
            dragBox.drag = false;
            dragBox.width = 0;
            dragBox.height = 0;
            boxArray = []
        }
        timeBar.style.height = (timeBarHeight * (nowTime / maxTime))  + "px";
    }
    else if (restartScreen){
        reloadButton.hidden = true;
        score.innerText = "";
        ResultScore.draw();
        restartButton.draw();
    }
}

update();
let size = 5;
let obstacleRate = 0.2;

let maze = [];
let player, start, end;

let steps = 0;
let minSteps = 0;
let solutionPath = [];

function setLevel(){
    let lvl = document.getElementById("level").value;

    if(lvl==1){ size=5; obstacleRate=0.2; }
    if(lvl==2){ size=6; obstacleRate=0.25; }
    if(lvl==3){ size=8; obstacleRate=0.3; }
    if(lvl==4){ size=10; obstacleRate=0.35; }

    generateMaze();
}

function getRandomCell(){
    return {
        x: Math.floor(Math.random()*size),
        y: Math.floor(Math.random()*size)
    };
}

function generateMaze(){
    let valid=false;

    while(!valid){
        maze=[];

        for(let i=0;i<size;i++){
            maze[i]=[];
            for(let j=0;j<size;j++){
                maze[i][j] = Math.random()<obstacleRate ? 1 : 0;
            }
        }

        let ok=false;
        while(!ok){
            start = getRandomCell();
            end = getRandomCell();

            if(start.x!==end.x || start.y!==end.y){
                maze[start.x][start.y]=0;
                maze[end.x][end.y]=0;
                ok = checkPath(start,end);
            }
        }

        valid=true;
    }

    player={...start};
    steps=0;

    document.getElementById("steps").innerText=0;

    renderMaze();
    getShortestPath();
}

function checkPath(s,e){
    let visited=Array.from({length:size},()=>Array(size).fill(false));
    let q=[[s.x,s.y]];

    while(q.length){
        let [x,y]=q.shift();
        if(x===e.x && y===e.y) return true;

        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
            let nx=x+dx, ny=y+dy;
            if(nx>=0&&ny>=0&&nx<size&&ny<size){
                if(!visited[nx][ny] && maze[nx][ny]==0){
                    visited[nx][ny]=true;
                    q.push([nx,ny]);
                }
            }
        });
    }
    return false;
}

function renderMaze(highlight=false){
    let m=document.getElementById("maze");
    m.innerHTML="";
    m.style.gridTemplateColumns=`repeat(${size},40px)`;

    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            let c=document.createElement("div");
            c.classList.add("cell");

            if(maze[i][j]==1) c.classList.add("wall");

            if(i==start.x&&j==start.y){ c.innerText="🚚"; }
            if(i==end.x&&j==end.y){ c.innerText="🏠"; }
            if(i==player.x&&j==player.y){ c.classList.add("player"); }

            if(highlight){
                solutionPath.forEach(p=>{
                    if(p[0]==i&&p[1]==j) c.classList.add("path");
                });
            }

            c.onclick=()=>move(i,j);
            m.appendChild(c);
        }
    }
}

function move(x,y){
    if(maze[x][y]==1) return;
    if(Math.abs(player.x-x)+Math.abs(player.y-y)!=1) return;

    player={x,y};
    steps++;
    document.getElementById("steps").innerText=steps;

    renderMaze();

    if(x==end.x && y==end.y) calculateStars();
}

function getShortestPath(){
    fetch('/solveMaze',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({maze,start,end})
    })
    .then(res=>res.json())
    .then(data=>{
        minSteps=data.steps;
        solutionPath=data.path;

        document.getElementById("minSteps").innerText=minSteps;
        document.getElementById("ruleSteps").innerText=minSteps;
    });
}

function giveUp(){
    renderMaze(true);
}

function calculateStars(){
    let stars="⭐";

    if(steps<=minSteps) stars="⭐⭐⭐";
    else if(steps<=minSteps+2) stars="⭐⭐";

    showPopup(stars);
}

function showPopup(stars){
    document.getElementById("finalStars").innerText=stars;
    document.getElementById("finalMessage").innerText="Steps: "+steps;

    document.getElementById("popup").style.display="flex";
}

function closePopup(){
    document.getElementById("popup").style.display="none";
    generateMaze();
}

generateMaze();
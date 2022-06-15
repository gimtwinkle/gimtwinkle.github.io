const canvas = document.getElementById('jsCanvas');
const ctx = canvas.getContext("2d");


ctx.strokeStyle="#000";
ctx.lineWidth=2.5;

let painting = false;

function startPainting(){
    painting = true;
}

function stopPainting(){
    painting = false;
}


function onMouseMove(e){
    //console.log(e);

    const x = e.offsetX;
    const y = e.offsetY;

    if(!painting){
        ctx.beginPath();
        ctx.moveTo(x,y);
    }else{
        ctx.lineTo(x,y);
        ctx.stroke();
    }

}

function onMouseDown(e){
    //console.log(e);
    startPainting();
}

function onMouseUp(e){
    //console.log(e);
    stopPainting();
}

function onMouseLeave(e){
    stopPainting();
}

if(canvas){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
}

let colorChip = document.querySelectorAll(".controls__color");

function pickColor(){
    console.log('hi');
};

colorChip.addEventListener("click",pickColor);
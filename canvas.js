const canvas = document.querySelector("canvas");
const pencilColorsElem = document.querySelectorAll(".pencil-color");
const pencilColorsWidth = document.querySelector(".pencilwidth");
const downloadBtn = document.querySelector("img[alt='download']");
const eraserBtn = document.querySelector("img[alt='eraser']");
const eraserWidth = document.querySelector(".eraserwidth");
const undoBtn = document.querySelector("img[alt='undo']");
const redoBtn = document.querySelector("img[alt='redo']");
const clearBtn = document.querySelector('.clear-btn')


let eraserFlag = false;

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const tool = canvas.getContext("2d", {willReadFrequently: true} );

window.onload = ()=>{
  let src = localStorage.getItem("lastSnapshot");
  let img = document.createElement('img');
  img.src=src;
  img.onload = ()=>{
    tool.drawImage(img, 0, 0)
  }
}


let pencilWidthValue;
let eraserWidthValue;

// by default width of pencil and eraser
tool.lineWidth = "3";

let pencilColor = "blue";
const eraserColor = "white";

let mousedown = false;

let trackerArr = [];
let trackerIdx = 0;

// move to -> line to

eraserBtn.addEventListener("click", ()=>{
  eraserFlag = !eraserFlag;
})
canvas.addEventListener("mousedown", (e) => {
  mousedown = true;
  strokeBegin({
    x: e.clientX,
    y: e.clientY,
  });
});
canvas.addEventListener("mousemove", (e) => {
  if (mousedown) {
    drawStroke({
        x: e.clientX,
        y: e.clientY
    })
  }
});
canvas.addEventListener("mouseup", () => {
  mousedown = false;
  let img = tool.getImageData(0, 0, canvas.width, canvas.height);
  // let img = canvas.toDataURL();
  trackerArr.push(img);
  trackerIdx = trackerArr.length - 1;

  let lastSnapshot = canvas.toDataURL();
  
  window.localStorage.setItem("lastSnapshot", lastSnapshot)
});

// implementation of undo and redo features

undoBtn.addEventListener("click", (e)=>{
  if(trackerIdx>0) trackerIdx--;
  // action
  let obj = {
    track: trackerIdx,
    arr: trackerArr
  }
  undoRedoCanvas(obj)
});

redoBtn.addEventListener("click", (e)=>{
  if(trackerIdx<trackerArr.length-1) trackerIdx++;
  // action
  let obj = {
    track: trackerIdx,
    arr: trackerArr
  }
  undoRedoCanvas(obj)
});

//~ function for undo and redo action
function undoRedoCanvas(trackerObj){

  let trackerIdx = trackerObj.track;
  let trackerArr = trackerObj.arr;
  let img = trackerArr[trackerIdx];

  tool.putImageData(img, 0, 0)
};


// implementation of download feature
downloadBtn.addEventListener("click", ()=>{
  const url = canvas.toDataURL();

  const a = document.createElement("a");
  a.href = url;
  a.download = "board.jpg"
  a.click();
});


function strokeBegin(strokeObj) {
  tool.beginPath();
  tool.strokeStyle = eraserFlag? eraserColor: pencilColor;
  tool.lineWidth = eraserFlag? eraserWidthValue: pencilWidthValue;
  tool.moveTo(strokeObj.x, strokeObj.y);
};

function drawStroke(strokeObj) {
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
};

// setting pencil width
pencilColorsWidth.addEventListener("change", ()=>{
  pencilWidthValue = pencilColorsWidth.value;
});

// setting eraser width
eraserWidth.addEventListener("change", ()=>{
  eraserWidthValue = eraserWidth.value;
});

// setting pencil color
pencilColorsElem.forEach((colorElem) => {
  colorElem.addEventListener("click", () => {
    pencilColor = colorElem.classList[0];
  });
});

clearBtn.addEventListener("click", (e)=>{
  tool.clearRect(0, 0, canvas.width, canvas.height)
})
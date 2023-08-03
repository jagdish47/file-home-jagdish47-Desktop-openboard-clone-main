let optionContainer = document.querySelector(".options-container");
let toolsContainer = document.querySelector(".tools-container");
let pencil = document.querySelector('img[alt="pencil"]');
let pencilTool = document.querySelector(".pencil-tool");
let eraser = document.querySelector('img[alt="eraser"]');
let eraserTool = document.querySelector(".eraser-tool");
let stickyNotes = document.querySelector('img[alt="stickynotes"]');
let uploadBtn = document.querySelector('img[alt="upload"]');

let optionFlag = true;
function openTools() {
  let iconElem = optionContainer.children[0];
  iconElem.classList.remove("fa-bars");
  iconElem.classList.add("fa-times");
  toolsContainer.style.display = "flex";
  toolsContainer.classList.add("scale-tool");
}
function closeTools() {
  let iconElem = optionContainer.children[0];
  iconElem.classList.remove("fa-times");
  iconElem.classList.add("fa-bars");
  toolsContainer.style.display = "none";
  eraserTool.classList.add("eraser-display-none");
  pencilTool.classList.add("display-none");
}
optionContainer.addEventListener("click", () => {
  optionFlag = !optionFlag;
  if (optionFlag) {
    openTools();
  } else {
    closeTools();
  }
});
pencil.addEventListener("click", () => {
  pencilTool.classList.toggle("display-none");
});
eraser.addEventListener("click", () => {
  eraserTool.classList.toggle("eraser-display-none");
});
stickyNotes.addEventListener("click", (event) => {
 
  let stickyTemplate = `
    <div class="sticky-header-cont">
    <div class="green-min minimise"></div>
    <div class="red-close remove"></div>
</div>
<div class="sticky-text-cont">
    <textarea class="note"></textarea>
</div>
    `;
    createSticky(stickyTemplate)
    

});

uploadBtn.addEventListener("click", ()=>{
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();
    input.addEventListener('change', ()=>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplate = `
        <div class="sticky-header-cont">
        <div class="green-min minimise"></div>
        <div class="red-close remove"></div>
    </div>
    <div class="sticky-text-cont">
        <img src=${url} class="note"></img>
    </div>
        `;
        createSticky(stickyTemplate)
    });
})

function createSticky(stickyTemplate){
    const stickyNote = document.createElement("div");
    stickyNote.setAttribute('class', 'sticky-container');
    stickyNote.innerHTML = stickyTemplate;
    document.body.appendChild(stickyNote);
    
    const minimise = stickyNote.querySelector('.minimise');
    const remove = stickyNote.querySelector('.remove');

    minimise.addEventListener("click", (event)=>{
        NoteActions(event);
    })
    remove.addEventListener("click", (event)=>{
        NoteActions(event);
    })



    stickyNote.onmousedown = function(event){
        dragAndDrop(stickyNote, event)
    }
    stickyNote.ondragstart = function(){
        return false;
    }

}

// actions on sticky notes

function NoteActions(event){
    if(event.target.classList.contains("minimise")){
        event.target.parentElement.parentElement.querySelector('.sticky-text-cont').classList.toggle('note-display-none');
    }
    if(event.target.classList.contains("remove")){
        event.target.parentElement.parentElement.remove()
    }
}

// drag and drop 

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}
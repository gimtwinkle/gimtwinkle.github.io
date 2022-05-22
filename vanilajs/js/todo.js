const toDoForm = document.querySelector("#todo-form");
const toDoInput = document.querySelector("#todo-form input");
const toDoList = document.querySelector("#todo-list");
const empty = document.querySelector("#empty");

const TODOS_KEY = "todos";

window.onload = function(){
    if(toDoList.childElementCount===0){
        toDoList.classList.add('hidden');
        empty.classList.remove('hidden');
    }else{
        toDoList.classList.remove('hidden');
        empty.classList.add('hidden');
    }
}
  

let toDos = [];

function saveToDos(){
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

function deleteToDo(x){
    if(toDoList.childElementCount===1){
        toDoList.classList.add('hidden');
        empty.classList.remove('hidden');
    }
    const li = x.target.parentElement.parentElement;
    li.remove();
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
    saveToDos();
    
}

function paintToDo(x){ //arguement는 임의값 
    const li = document.createElement("li");
    li.id = x.id;
    const span = document.createElement("span");
    span.innerText = x.text;
    const button = document.createElement("button");
    button.innerHTML = "<i class='fa-regular fa-trash-can'></i>";
    button.addEventListener("click",deleteToDo);
    li.appendChild(span);
    li.appendChild(button);
    toDoList.appendChild(li);
    //console.log(li);
}

function handleToDoSubmit(e){
    e.preventDefault();
    const newTodo = toDoInput.value;
    //console.log(toDoInput.value);

    if(toDoInput.value === ""){
        alert("Please confirm your input.");
    }else{
        toDoInput.value = "";
        //console.log(newTodo, toDoInput.value); <---------순차 실행 되기 때문에 value 값을 비운다고 해서 newTodo에 영향을 주지 않음.
        const newTodoObj ={
            text : newTodo,
            id : Date.now(),
        };
        toDos.push(newTodoObj);
        paintToDo(newTodoObj);
        saveToDos();
        toDoList.classList.remove('hidden');
        empty.classList.add('hidden');
    }
}


toDoForm.addEventListener("submit", handleToDoSubmit);

const savedToDos = localStorage.getItem(TODOS_KEY);

//console.log(savedToDos);
if(savedToDos !== null){
    const parsedToDos = JSON.parse(savedToDos);
    //console.log(parsedToDos);
    toDos = parsedToDos;
    parsedToDos.forEach(paintToDo);
}


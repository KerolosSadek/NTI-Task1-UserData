const dataShow = document.querySelector("#dataShow")    
const addForm = document.querySelector("#addForm")
const editForm = document.querySelector("#editForm")
const showForm = document.querySelector("#showForm")


    const readFromStorage = (key= "users", dataType="array") => {
    let data
    try{
        data = JSON.parse(localStorage.getItem(key)) || []
        if(!Array.isArray(data) && dataType=="array") throw new Error ("No Data")
    }
    catch(e){
        data = []
    }
    return data
}

const writeToStorage = (data, key="users") => {
    localStorage.setItem(key, JSON.stringify(data))
}

const createElem = (elem, parent, txt, classes) =>{
    const myEle = document.createElement(elem);
    parent.appendChild(myEle);
    if (txt) myEle.innerText= txt;
    if (classes)  myEle.classList = classes;
    return myEle;
}

const heads = ["name", "age"];
const addData = (addForm, userStatus = false) => {
    let user = { 
        id: Date.now(),
        status: userStatus? addForm.elements.status.value : "Active"
    };
    heads.forEach(head => user[head]= addForm.elements[head].value);
    return user 
}

const editUser = (user) => {
    writeToStorage(user, "user");
    window.location.href = "edit.html";
}

const deleteUser = (users, i)=>{
    users.splice(i,1);
    writeToStorage(users);
    drawData(users);
}


const showUser = (user, i)=>{
    writeToStorage(user, "user");
    writeToStorage(i, "userindex");
    console.log(user)
    window.location.href="show.html";
    
}


const drawData = (users) => {
    dataShow.innerHTML="";
    if (users.length==0) {
        let tr = createElem("tr", dataShow, "", "alert alert-danger");
        let td = createElem("td", tr, "No Data", "");
        td.setAttribute("colspan", "5");
    }
    users.forEach((user, i)=>{
        let tr = createElem("tr", dataShow);
        createElem("td", tr, user.id);
        createElem("td", tr, user.name);
        createElem("td", tr, user.status);
        createElem("td", tr, user.age);

        let td = createElem("td", tr);
        
        let show = createElem("button", td, "Show", "btn btn-success mx-2");
        show.addEventListener("click", () => showUser(user , i));

        let edit = createElem("button", td, "Edit", "btn btn-warning mx-2");
        edit.addEventListener("click", () => editUser(user));
        
        let dele = createElem("button", td, "Delete", "btn btn-danger mx-2");
        dele.addEventListener("click", () => deleteUser(users, i));
    })
}

if (dataShow) {
    const users = readFromStorage();
    drawData(users);
}

if (addForm) {
    addForm.addEventListener("submit", function(e){
        e.preventDefault();
        const user = addData(this);
        const users = readFromStorage();
        users.push(user);
        writeToStorage(users);
        window.location.href="index.html";
    })
}

if (editForm) {
    let user = readFromStorage("user", "object");
    heads.forEach(head => editForm.elements[head].value = user[head])
    editForm.elements["status"].value = user["status"];
    editForm.addEventListener("submit", (e) => editFormHelp(e, user.id));
}

if (showForm) {
    let single = readFromStorage("user", "Object");
    heads.forEach(head => showForm.elements[head].value = single[head])
    showForm.elements["status"].value = single["status"];
}


const editFormHelp = (e, id) => {
    e.preventDefault();
    let user = addData(editForm, id);
        let users = readFromStorage("users");
        users[users.findIndex((user) => user.id == id)] = user;
        writeToStorage(users, "users");
        window.location.href = './index.html';
}
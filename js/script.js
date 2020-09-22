//** Constants */
const ROOT_URL = "https://gateway.marvel.com:443/v1/public/";
const API_KEY = "396af5542c62f03d7cb9706e3eb6b553";
const HASH = "bba10d3874e2070306f4f23aea0858bb";
const TIME_STAMP = 1;
const RESULTS_PER_PAGE = 12;
const WAIT = 1;


//**HTML elements */
let inputSearch = document.getElementById("search-id");



let currentText ="";
let timeOut;
let autoSearch = false;
let myTrie = new Trie();

inputSearch.addEventListener("keyup",(e)=>{
   
    if(inputSearch.value!==currentText){
        currentText = inputSearch.value;
        console.log(currentText);
        if(autoSearch===true){
            clearTimeout(timeOut);
            timeOut = setTimeout(makeSearch,WAIT*1000);
        }
    }

    if(e.key ==="Enter"){
        makeSearch();
        clearTimeout(timeOut);
    }
})

function makeSearch(){
    console.log("*******************");
    console.log(currentText);
    console.log("*******************");
}



myTrie.insert("ant");
myTrie.insert("anton");
myTrie.insert("antonio");
myTrie.insert("antZZZ");
myTrie.insert("antYYY");
myTrie.insert("an ant antonio")
myTrie.insert("hi");
myTrie.insert("hello");
myTrie.insert("hint");
myTrie.insert("bern");
myTrie.insert("berny");
myTrie.insert("berna");
myTrie.insert("bernat");
myTrie.insert("berny crack");


// Not all the images have the same size but most of them have a ratius close to 1:1
//characters 1:1
//comics 550:850 px





//characters
//creators
//series
//comics
//what can a card do?


//the search displays all the similar results





function Paginator(){
    this.currentPage =0;
    this.nextPage = function(){}
    this.previousPage = function(){}
    this.pageN = function (){}
    this.remove = function(){}
}


function Page(){
    this.cards;
}
Page.prototype.create = function(){

}
Page.prototype.show = function(){}
Page.prototype.hide = function(){}


/**
 * Create a Card.
 * @param {string} html :
 */
function Card(htmlInfo,image,moreInfo){
    this.html = htmlInfo;
    this.image = image;

}

Card.prototype.create = function(){
    let li = document.createElement("li");
    let divImage = document.createElement("div")
    divImage.classList.add("poster");
    let divInfo = document.createElement("div");
    divInfo.classList.add("info");
    let moreInfo = document.createElement("button");
    moreInfor.textContent = "more info +";
    divInfo.appendChild(moreInfo);
    div.style.backgroundImage = "url('"+this.image+"')";
    div.innerHTML = html;
    li.append(divImage,divInfo);
    return li;
}
Card.prototype.displayAllInfo = function(){
    //display info
        //main poster
        //relations
            //characters
            //comics
            //series
            //creators
}

function Comic(data){
    this.characters
    this.series = data.
    this.creators

}

Comic.prototype = Object.create(Card.prototype);
Comic.prototype.constructor = Comic;
Comic.prototype.generateHTML = function(data){
    
}
//the paginator consists of Pages and the respective Numbers of those pages
function Paginator(){

}
function Relation(card){

}
Relation.prototype.hide = function(){}
Relation.prototype.display = function(){}
Relation.prototype.create = function(){}



function getData(text,type,limit,offset){
    type= type.toLowerCase(); // convert to lower case to avoid any problem
    let requestUrl = ROOT_URL;
    requestUrl += type.toLowerCase() + "?";
    if(type==="characters"||type==="creators"){
        requestUrl +=  "nameStartsWith";
    }else{
        requestUrl += "titleStartsWith";
    }
    requestUrl += "="+text+"&";
    requestUrl += "limit="+limit+"&offset="+offset+"&";
    requestUrl += "ts="+TIME_STAMP+"&";
    requestUrl += "apikey="+API_KEY+"&"
    requestUrl +="hash="+HASH;
    console.log(requestUrl);
    return fetch(requestUrl)
    .then(response=>{
        if(!response.ok){
            throw new Error(response.status);
        }
        return response.json();
    })
    .then(data=>{
        console.log(data);
        return data;
    }).catch(error =>console.log(error));
}

//bba10d3874e2070306f4f23aea0858bb
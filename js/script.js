//** Constants */
const ROOT_URL = "https://gateway.marvel.com:443/v1/public/";
const API_KEY = "396af5542c62f03d7cb9706e3eb6b553";
const HASH = "bba10d3874e2070306f4f23aea0858bb";
const TIME_STAMP = 1;
const ENDING_URL = "?ts="+TIME_STAMP+"&apikey="+API_KEY+"&hash="+HASH;
const RESULTS_PER_PAGE = 12;
const WAIT = 1;
const MAX_LIMIT = 100; //max number of results for request to the API
const NUM_SUGGESTIONS = 10; //number of suggestions for the user when searching

//**HTML elements */
let inputSearch = document.getElementById("search-id");
let selectCategory = document.getElementById("categories-id");
let dropdownBtn = document.getElementById("drop-down-btn");
let btnSearch = document.getElementById("search-btn-id");
let suggestionsContainer = document.getElementById("suggestions-id");
let searchResults = document.querySelector("#search-results-id");
let pagination = document.getElementById("numeration-id");
let loading = document.getElementById("loading-id");
let expandResult = document.getElementById("expanded-result-id");
let noResultsAnimation = document.getElementById("no-results-animation");


//The idea was to create a trie for every category ( comics, characters,...) but it requires to have the data in advance. 
//A better approach is to implement the tries in the server side but since this project was only about front end I have developed
//a small try just for the comics category.

//Create Trie
let comicsTrie = createTrie(comics);

let currentCategory = "comics";
let currentText = "";       //text in the search bar
let timeOut;                //variable that allows to clear the setTimeout
let autoSearch = false;     //specifies if searches will be performed automatically after certain time WAIT seconds
let suggestionsPos = 0;     //suggestions selected in the search bar
let myPaginator;            // to be used as a Paginator object


//* CATEGORY SELECTION*/
//select category when click on it
selectCategory.addEventListener("click", (e) => {
    if (e.target.classList.contains("category")) {
        selectCategory.querySelector(".active").classList.remove("active");
        e.target.classList.add("active");
        currentCategory = e.target.textContent.toLowerCase();
        selectCategory.classList.remove("show"); // hide categories on small screens for better user experience
    }
});

//Display categories when using small screens
dropdownBtn.addEventListener("click", () => {
    selectCategory.classList.toggle("show");
});

/***********end category selection */

//** SEARCHES */

//Perform search when clicking search icon
btnSearch.addEventListener("click",()=>{
    makeSearch();
});

//Search when user presses enter
inputSearch.addEventListener("keyup", (e) => {
    if (inputSearch.value !== currentText) {    //make sure that keys without content have been presed (arrows,home,etc)
        currentText = inputSearch.value;
        displaySuggestions(currentText, comicsTrie);       //display new suggestions
        if (autoSearch === true) {
            clearTimeout(timeOut);
            timeOut = setTimeout(makeSearch, WAIT * 1000);
        }
    }
    if (e.key === "Enter") {    //search if user pressed enter
        let suggestion = suggestionsContainer.querySelector(".active");
        if (suggestion) {          //check if suggestion is selected
            currentText = suggestion.textContent;
        }
        makeSearch();
        clearTimeout(timeOut);
    }
});

//Move through suggestions using arrows
inputSearch.addEventListener("keydown", (e) => {
    console.log(e.code);
    switch (e.key) {
        case "ArrowUp":
            prevSuggestion();
            break;
        case "ArrowDown":
            nextSuggestion();
            break;
        default:
            break;
    }
});

//Show suggestions when search bar is focused
inputSearch.addEventListener("focus", () => {
    suggestionsContainer.classList.remove("hidden");
});


//In order to get the "click" event from the suggestionsContainer we place a
//delay before hidding the suggestions,if not the click event will not be triggered
inputSearch.addEventListener("blur", (e) => {
    setTimeout(() => suggestionsContainer.classList.add("hidden"), 200);
});

//Make search when user clicks on a suggestion
suggestionsContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        currentText = e.target.textContent;
        makeSearch();
    }
});

//Indicate to user which suggestion is being selected
suggestionsContainer.addEventListener("mouseover", (e) => {
    if (e.target.tagName === "LI") {
        let active = suggestionsContainer.querySelector(".active");
        if (active) {
            active.classList.remove("active");
        }
        e.target.classList.add("active");
    }
});

/***********end search */


//** Transition animation */
let color = document.getElementById('colored');
let x;
window.addEventListener('load', function () {
    setTimeout(function () {
        doFirst(0);
    }, 500)
}, false);

function doFirst(x) {
    if (x == 0) {
        color.style.clipPath = "polygon(0 0,100% 0,100% 100%,0 100%)";
        color.style.transition = "clip-path .8s";
        setTimeout(function () {
            color.style.clipPath = "polygon(99.99% 0,100% 0,100% 100%,99.99% 100%)";
            color.style.transition = "clip-path .8s";
        }, 600);
        x = 99.99;
    } else {
        color.style.clipPath = "polygon(0 0,100% 0,100% 100%,0 100%)";
        color.style.transition = "clip-path .8s";
        setTimeout(function () {
            color.style.clipPath = "polygon(0 0,0.01% 0,0.01% 100%,0 100%)";
            color.style.transition = "clip-path .8s";
        }, 600);
        x = 0;
    }
    setTimeout(function () {
        doFirst(x);
    }, 1300);
}

/***********end animation */



//Cleans the screen and makes a search by creating a new Paginator object
//that will manage the page till a new search if performed
async function makeSearch() {
    inputSearch.value = currentText;
    suggestionsContainer.innerHTML = "";
    console.log("*********************");
    console.log("Selected word:"+ currentText);
    searchResults.innerHTML = "";   //make sure nothing is shown in the screen
    pagination.innerHTML = "";
    expandResult.innerHTML ="";
    noResultsAnimation.classList.add("hide");
    let searchWord;
    //searches with "(" will not give any, or none signigicant, result ("API behaviour") so we try to improve the chances of getting results
    if (currentText.indexOf("(") !== -1) {
        searchWord = currentText.slice(0, currentText.indexOf("("));
    } else {
        searchWord = currentText;
    }
    console.log("Word used for the search :"+searchWord);
    if(myPaginator){    //Check if it is the first search
        if(myPaginator.loading===false){    //make sure the previous search has finished to avoid getting many responses simultaneously
            myPaginator = new Paginator(searchWord, currentCategory, searchResults, pagination,loading);
        }
    }else{
        myPaginator = new Paginator(searchWord, currentCategory, searchResults, pagination,loading);
    }
    console.log("*********************");
}


//Display suggestions, if exist, below the search bar
function displaySuggestions(word, trie) {
    console.log("******Suggestions*******");
    //in oder to find more results the words will be  trimmed and capitalized
    word = word.trim();
    if (word !== "") {
        word = capitalizeSentence(word);
    }
    suggestionsContainer.innerHTML = "";
    let foundSuggestions = trie.getNsuggestions(word, NUM_SUGGESTIONS);
    if (foundSuggestions) {
        foundSuggestions.forEach(el => {
            let suggestion = document.createElement("li");
            suggestion.textContent = el;
            suggestionsContainer.append(suggestion);
        });
    }
}

//capitalizes all the words separated by a space
function capitalizeSentence(sentence) {
    return sentence.split(" ").map(word => word[0].toUpperCase() + word.slice(1)).join(" ");
}

//Activate or highligth the next suggestion
function nextSuggestion() {
    if (suggestionsContainer.children.length) {
        let activeSug = suggestionsContainer.querySelector(".active");
        if (activeSug) {
            let nextSibling = activeSug.nextElementSibling;
            if (nextSibling) {
                activeSug.classList.remove("active");
                nextSibling.classList.add("active");
            }
        } else {
            suggestionsContainer.children[0].classList.add('active');
        }
    }
}

//Activate or highligth the previous suggestion
function prevSuggestion() {
    if (suggestionsContainer.children.length) {
        let activeSug = suggestionsContainer.querySelector(".active");
        if (activeSug) {
            let prevSibling = activeSug.previousElementSibling;
            activeSug.classList.remove("active");
            if (prevSibling) {
                prevSibling.classList.add("active");
            }
        }
    }
}

//Creates a Trie data structure given an array of strings
function createTrie(array) {
    let myTrie = new Trie();
    for (let i = 0; i < array.length; i++) {
        myTrie.insert(array[i]);
    }
    return myTrie;
}
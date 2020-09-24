//** Constants */
const ROOT_URL = "https://gateway.marvel.com:443/v1/public/";
const API_KEY = "396af5542c62f03d7cb9706e3eb6b553";
const HASH = "bba10d3874e2070306f4f23aea0858bb";
const TIME_STAMP = 1;
const RESULTS_PER_PAGE = 12;
const WAIT = 1;
const MAX_LIMIT = 100; //max number of results for request to the API
const NUM_SUGGESTIONS = 10; //number of suggestions for the user when searching


//**HTML elements */
let inputSearch = document.getElementById("search-id");
let selectCategory = document.getElementById("categories-id");
let dropdownBtn = document.getElementById("drop-down-btn");
let btnSearch = document.getElementById("search-btn");
let suggestionsContainer = document.getElementById("suggestions-id");
let searchResults = document.querySelector(".search-results");
let pagination = document.getElementById("numeration-id");
let loading = document.getElementById("loading-id");




//! TO DO
/**
 * Fix pagination 
 *  show more info
 *  link sries, comics,characters,creators
 */

//Create Tries
let comicsTrie = createTrie(comics);


let currentCategory = "comics";

//dropdown button
dropdownBtn.addEventListener("click", () => {
    selectCategory.classList.toggle("show");
});

//CATEGORY SELECTION
selectCategory.addEventListener("click", (e) => {
    if (e.target.classList.contains("category")) {
        selectCategory.querySelector(".active").classList.remove("active");
        e.target.classList.add("active");
        currentCategory = e.target.textContent.toLowerCase();
        console.log(currentCategory);
    }
});


let currentText = "";
let timeOut;
let autoSearch = false; //specifies if searches will be performed automatically
let myTrie = new Trie();
let suggestionsPos = 0;

//**INPUT SEARCH
inputSearch.addEventListener("keyup", (e) => {
    //Search
    if (inputSearch.value !== currentText) {
        currentText = inputSearch.value;
        //display new suggestions
        displaySuggestions(currentText, comicsTrie);
        if (autoSearch === true) {
            clearTimeout(timeOut);
            timeOut = setTimeout(makeSearch, WAIT * 1000);
        }
    }


    if (e.key === "Enter") {
        //check if suggestion is selected
        let suggestion = suggestionsContainer.querySelector(".active");
        if (suggestion) {
            currentText = suggestion.textContent;
        }
        makeSearch();
        clearTimeout(timeOut);
    }
});


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

inputSearch.addEventListener("focus", () => {
    suggestionsContainer.classList.remove("hidden");
});


//In order to get the "click" event from the suggestionsContainer we place a
//delay before hidding the suggestions,if not the click event will not be triggered
inputSearch.addEventListener("blur", (e) => {
    console.log(e.target);
    setTimeout(() => suggestionsContainer.classList.add("hidden"), 200);
});




suggestionsContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        currentText = e.target.textContent;
        makeSearch();
    }
});
suggestionsContainer.addEventListener("mouseover", (e) => {
    if (e.target.tagName === "LI") {
        let active = suggestionsContainer.querySelector(".active");
        if (active) {
            active.classList.remove("active");
        }
        e.target.classList.add("active");
    }

});



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





let myPage;
let myPaginator;
async function makeSearch() {
    inputSearch.value = currentText;
    suggestionsContainer.innerHTML = "";
    console.log("*******************");
    console.log(currentText);
    searchResults.innerHTML = "";
    pagination.innerHTML = "";
    let searchWord;
    if (currentText.indexOf("(") !== -1) {
        searchWord = currentText.slice(0, currentText.indexOf("("));
    } else {
        searchWord = currentText;
    }
    console.log(searchWord);
    if(myPaginator){
        if(myPaginator.loading===false){
            myPaginator = new Paginator(searchWord, currentCategory, searchResults, pagination,loading);
        }
    }else{
        myPaginator = new Paginator(searchWord, currentCategory, searchResults, pagination,loading);
    }



    console.log("*******************");
}

function displaySuggestions(word, trie) {
    console.log("******Suggestions*******");
    //in oder to find more results the words will be  trimmed and capitalized
    word = word.trim();
    if (word !== "") {
        word = capitalizeSentence(word);
        console.log(word);
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

function capitalizeSentence(sentence) {
    return sentence.split(" ").map(word => word[0].toUpperCase() + word.slice(1)).join(" ");
}


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

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("more-info")) {
        console.log('pressed');
        //dipslya infod
    }
});


function displayInfo() {
    //expand card
    //paginator.expandCard(id)

}













function getData(text, type, limit, offset) {
    type = type.toLowerCase(); // convert to lower case to avoid any problem
    let requestUrl = ROOT_URL;
    requestUrl += type.toLowerCase() + "?";
    if (type === "characters" || type === "creators") {
        requestUrl += "nameStartsWith";
    } else {
        requestUrl += "titleStartsWith";
    }
    requestUrl += "=" + text + "&";
    requestUrl += "limit=" + limit + "&offset=" + offset + "&";
    requestUrl += "ts=" + TIME_STAMP + "&";
    requestUrl += "apikey=" + API_KEY + "&"
    requestUrl += "hash=" + HASH;
    console.log(requestUrl);
    return fetch(requestUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data;
        }).catch(error => console.log(error));
}

//bba10d3874e2070306f4f23aea0858bb

//return all the names/titles of the selected type
async function getAll(type) {
    //make initial request to get total number of data
    //then create the rest of requests
    let names = [];
    let requestUrl = ROOT_URL + type + "?ts=" + TIME_STAMP + "&apikey=" + API_KEY + "&hash=" + HASH + "&limit=" + MAX_LIMIT;
    let data = await fetch(requestUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(data => {
            return data.data;
            //promise all
        })
        .catch(error => console.log(error));
    console.log(data);
    let apiRequests = [];
    console.log(Math.ceil((data.total - 100) / MAX_LIMIT));
    for (let i = 0; i < Math.ceil((data.total - 100) / MAX_LIMIT); i++) {
        let nextRequestUrl = ROOT_URL + type + "?ts=" + TIME_STAMP + "&apikey=" + API_KEY + "&hash=" + HASH + "&limit=" + MAX_LIMIT + "&offset=" + (i + 1) * MAX_LIMIT;
        if (i > 399 && i < 450) { //!not done
            apiRequests.push(fetch(nextRequestUrl).then(response => response.json()));
        }
    }
    let pause = await Promise.all(apiRequests).then((data) => {
        console.log(data);
        data.forEach(d => {
            names.push(...d.data.results.map(r => r.title));
        })
        console.log(names);
    })
    console.log("hi");
    let prev = [];
    console.log(localStorage.marvelComics);
    if (localStorage.marvelComics) {
        prev = JSON.parse(localStorage.marvelComics);
    }
    prev.push(...names);
    localStorage.marvelComics = JSON.stringify(prev);
    return names;
}



function loadTries() {

}


function createTrie(array) {
    let myTrie = new Trie();
    for (let i = 0; i < array.length; i++) {
        myTrie.insert(array[i]);
    }
    return myTrie;
}
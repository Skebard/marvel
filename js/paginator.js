
/**
 * Constructor of Paginator objects that search data in the marvel API and manages how it is displayed
 * @param {string} text text to use for searching comics, characters, etc
 * @param {string} type indicates the type of the results. It can take the following values: "characters", "creators", "comics","series".
 * @param {HTMLelement} pageContainer HTML element "ul" preferible where the results will be allocated
 * @param {HTMLelement} paginationContainer container to place the numbers of the pages to navigate through the results
 * @param {HTMLelement} loadingAnimation animation to be shown while making request to the API
 */
function Paginator(text,type,pageContainer,paginationContainer=undefined,loadingAnimation){
    this.pages =[];
    this.transition = loadingAnimation;
    this.loading =false;
    this.currentPage;
    this.type = type;
    this.text = text;
    this.htmlContainer = pageContainer;
    this.htmlPagination = paginationContainer;
    this.totalPages;
    this.nextPage = async function(){
        let nextPage = this.currentPage.id+1;
        if(nextPage<=this.totalPages){
            let w = await this.pageN(nextPage);
            return true;
        }
        else{
            return false;
        }
    }

    this.previousPage = async function(){
        let prevPage = this.currentPage.id-1;
        if(prevPage>0){
            let w = await this.pageN(prevPage);
            return true;
        }else{
            return false;
        }
    }

    // this.remove = function(){
    //     this.htmlContainer.innerHTML="";
    //     this.htmlPagination.innerHTML ="";
    // }
    this.createNumeration = function(){
        let ul = document.createElement("ul");
        ul.classList.add("numeration");
        this.htmlPagination.append(ul);
        for(let i=1; i<=this.totalPages; i++){
            let btn = createLi(i,"page-num");
                if(this.totalPages>5 && i>3 && i<this.totalPages){
                    break;
                }
            ul.appendChild(btn);
        }
        if(this.totalPages>5){
            let ellipsis = createLi("...","ellipsis");
            ul.children[2].insertAdjacentElement("afterend",ellipsis);

            let last = createLi(this.totalPages,"page-num");
            ul.appendChild(last);
        }
        ul.children[0].classList.add("active");
        if(this.totalPages >2){
            let prevBtn = document.createElement("div");
            prevBtn.textContent = "<<";
            prevBtn.className = "prev-page-btn page-arrow";
            let nextBtn = document.createElement("div");
            nextBtn.textContent = ">>";
            nextBtn.className = "next-page-btn page-arrow";
            ul.insertAdjacentElement("beforebegin",prevBtn);
            ul.insertAdjacentElement("afterend",nextBtn);
        }
    }



    this.btnEvents = function(){
        this.htmlPagination.addEventListener("click",async (e)=>{

            //sometimes all this settings are unnecessary but since they are applied very fast 
            //the user experience is not being affected
            this.loading = true;
            this.htmlPagination.classList.add("hidden");
            this.transition.classList.remove("hidden");
            let active = e.currentTarget.querySelector(".active");
            if(e.target.classList.contains("page-num")){
                active.classList.remove("active");
                e.target.classList.add("active");
                let w = await this.pageN(parseInt(e.target.textContent));

            }else if(e.target.classList.contains("prev-page-btn")){
                let w = await this.previousPage();
                if(w){
                    let prev = active.previousElementSibling;
                    if(prev.classList.contains("ellipsis")){
                        console.log("Ellipsis");
                        let prevPrev = prev.previousElementSibling;
                        if(parseInt(prevPrev.textContent)===this.currentPage.id){
                            console.log("remove ellipsis")
                            prev.remove();
                            prev = prevPrev;
                        }
                    }
                    if(this.currentPage.id!==parseInt(prev.textContent)){
                        prev = createLi(this.currentPage.id,"page-num");
                        active.insertAdjacentElement("beforebegin",prev)
                    }

                    active.classList.remove("active");
                    prev.classList.remove("hidden");
                    prev.classList.add("active");
                }
            }else if(e.target.classList.contains("next-page-btn")){
                let w = await this.nextPage();
                console.log(this.currentPage);
                if(w){
                    let next = active.nextElementSibling;
                    if(next.classList.contains("ellipsis")){
                        let nextNext = next.nextElementSibling;
                        if(parseInt(nextNext.textContent)===this.currentPage.id){
                            next.remove();
                            next = nextNext;
                        }
                    }
                    if(this.currentPage.id !== parseInt(next.textContent)){
                        next = createLi(this.currentPage.id,"page-num");
                        active.insertAdjacentElement("afterend",next);
                    }
                    active.classList.remove("active");
                    next.classList.remove("hidden");
                    next.classList.add("active");
                }
            }
            this.transition.classList.add("hidden");
            this.htmlPagination.classList.remove("hidden");
            this.loading = false;

        });

    }

    initialization(this);
    async function initialization(context){
        context.loading = true;
        context.transition.classList.remove("hidden");
        //let w = await Paginator.prototype.pageN.call(context,1);
        // option 2
        let w = await context.pageN(1);
        console.log(context)
        if(context.pages[0].cards.length>0){    //what happens if we do not find any result
            context.createNumeration();
            context.btnEvents();
        }else{
            noResults();
        }

        context.transition.classList.add("hidden");
        context.loading = false;
    }
    function createLi(text,_class){
        let li = document.createElement("li");
        li.className=_class;
        li.textContent = text;
        return li;
    }

}

Paginator.prototype.pageN = async function(pageNumber){

    if(this.currentPage){   //first time currentPages is undefined
        if(this.currentPage.id===pageNumber){
            return false;
        }
        this.currentPage.remove();
    }
    let page;
    page = this.pages.filter(p=>p.id===pageNumber);
    console.log(page);
    if(page.length){
        page = page[0];
    }else{
        let data = await getData(this.text,this.type,RESULTS_PER_PAGE,(pageNumber-1)*RESULTS_PER_PAGE);
        console.log(data);
        if(!this.totalPages){
            this.totalPages = Math.ceil(data.data.total/RESULTS_PER_PAGE);
        }
        page = new Page(pageNumber,data.data.results,this.type,this.htmlContainer);
        this.pages.push(page);
    }
    this.currentPage = page;
    page.display();
}




function Page(id,data,type,container){
    this.htmlContainer = container;
    this.cards=[];
    this.id=id;     //indicates the number of the page
    this.create(data,type);

}
Page.prototype.create = function(data,type){
    let cards = [];
    data.forEach((el)=>{
        switch(type){
            case "characters":
                cards.push( new Character(el));
                break;
            case "comics":
                cards.push( new Comic(el));
                break;
            case "series":
                cards.push( new Serie(el));
                break;
            case "creators":
                cards.push( new Creator(el));
                break;
            default:
                break;
        }
    });
    this.cards = cards;
}

Page.prototype.display = function(){
    this.cards.forEach(el=>this.htmlContainer.append(el.create()));
}
Page.prototype.remove = function(){
    this.htmlContainer.innerHTML ="";
}


//Display animation to indicate that the search has not given any result
function noResults(){
    let noResultCont = document.querySelector(".glow-div");
    noResultCont.classList.remove("no-results");
    noResultsAnimation.classList.remove("hide");
    let noResult = document.querySelector(".glow-div > img");
    noResult.style.display="none";
    let snap = document.querySelector("#snap-id");
    snap.classList.remove("hide");
    snap.classList.add("snap");
    setTimeout(()=>{
        noResultCont.classList.add("no-results");
    },1700);
}


/**
 * Makes a request to the Marvel API and returns a Promise with the data
 * @param {string} text word/sentece user is looking for
 * @param {string} type indicates the type of the results. It can take the following values: "characters", "creators", "comics","series". If different the request will fail
 * @param {int} limit number of results. Can not be greater than 100
 * @param {int} offset from which position get the results
 */
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
    //console.log(requestUrl);
    return fetch(requestUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .then(data => {
            return data;
        }).catch(error => console.log(error));
}



//return all the names/titles of the selected type
//Notice that this function is not called anywhere since it has only been used once to get the names
//of the comics in order to create our Trie.
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
        //by try and error I have determined that the API do not respond when performing too many requests consequently ( more than 70 more or less), 
        //therefore I was getting the data from  50 to 50
        if (i > 399 && i < 450) { //!nt done
            apiRequests.push(fetch(nextRequestUrl).then(response => response.json()));
        }
    }
    let pause = await Promise.all(apiRequests).then((data) => {
        console.log(data);
        data.forEach(d => {
            names.push(...d.data.results.map(r => r.title));
        })
    })
    let prev = [];
    if (localStorage.marvelComics) {
        prev = JSON.parse(localStorage.marvelComics);
    }
    prev.push(...names);
    localStorage.marvelComics = JSON.stringify(prev);
    return names;
}

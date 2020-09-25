
/*
count
limit 
offset
results[array]

total
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

            console.log("You are in the las page")
            return false;
        }
    }

    this.previousPage = async function(){
        let prevPage = this.currentPage.id-1;
        if(prevPage>0){
            let w = await this.pageN(prevPage);
            return true;
        }else{
            console.log("you are in the first page");
            return false;
        }
    }

    this.remove = function(){
        this.htmlContainer.innerHTML="";
        this.htmlPagination.innerHTML ="";
    }
    this.expandCard = function(){}
    this.createNumeration = function(){
        let ul = document.createElement("ul");
        ul.classList.add("numeration");
        this.htmlPagination.append(ul);
        for(let i=1; i<=this.totalPages; i++){
            let btn = createLi(i,"page-num");
            // document.createElement("li");

            //     btn.textContent = i;
            //     btn.className="page-num"
                if(this.totalPages>5 && i>3 && i<this.totalPages){
                    break;
                }
            
            ul.appendChild(btn);
        }
        if(this.totalPages>5){
            let ellipsis = createLi("...","ellipsis");
            // document.createElement("li");
            // ellipsis.textContent = "...";
            // ellipsis.className = "ellipsis";
            ul.children[2].insertAdjacentElement("afterend",ellipsis);

            let last = createLi(this.totalPages,"page-num");
            // document.createElement("li");
            // last.classNam="page-num";
            // last.textContent = this.totalPages;
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
    this.createLoadMore = function(){
        console.log("more")
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

    console.log("no results");
}



/*

characters
    name
    description
    image

comics
    name/title  
    description
    dates
    image
series
    title
    description
    image
creators
    firstName
    middleName
    lastName
    fullName
    image   most of them they don't have image -> what to do? put default image


we have diffetent image sizes and relations

*/


    // let data = await getData("hulk","comics",4,0);
    // console.log(data);
    // console.log(data.data[1]);
    // //let myData = data.data.results;
    // // myData.forEach(d=>{
    // //     let myComic = new Comic(d);
    // //     myComic.create();
    // // });

//the paginator consists of Pages and the respective Numbers of those pages

function Relation(card){

}
Relation.prototype.hide = function(){}
Relation.prototype.display = function(){}
Relation.prototype.create = function(){}


/**
 * Create a Card.
 * @param {string} html :
 */
function Card(htmlInfo,image){
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
    moreInfo.textContent = "more info +";
    moreInfo.classList.add("more-info");
    moreInfo.addEventListener("click",(e)=>{
        console.log("more information");
        this.expand(this.html);


    });
    divImage.style.backgroundImage = "url('"+this.image+"')";
    divInfo.append(...this.html,moreInfo);
    li.append(divImage,divInfo);
    return li;
}

Card.prototype.expand = function(expandedHTML,relations){
    searchResults.innerHTML="";
    pagination.innerHTML="";
    expandResult.innerHTML="";
    let mainCard = document.createElement("div");
    mainCard.classList.add("main-card");
    let poster = document.createElement("img");
    poster = document.createElement("img");
    poster.classList.add("poster");
    poster.src = this.image;
    let content = document.createElement("div");
    content.classList.add("card-content");
    content.append(...expandedHTML);

    mainCard.append(poster,content);
    expandResult.insertAdjacentElement("afterbegin",mainCard);

    this.relations.forEach((rel)=>{
        //console.log(rel);
        createRelation(rel);
    });
    //expandResult.appendChild();
    //relation -> {type:, data:,}
}

async function createRelation(data){
    console.log("create");
    console.log(data);
    let container = document.createElement("div");
    let secTitle = document.createElement("div");
    secTitle.className="title-dropdown";
    secTitle.textContent = data.type.toUpperCase();

    

    let ul = document.createElement("ul");
    ul.className = "search-results comics relation";
    container.append(secTitle,ul)
    expandResult.appendChild(container);

    secTitle.addEventListener("click",()=>{
        ul.classList.toggle("hidden");
    })

    let page;
    let requests = [];
    console.log("******* DATA ********")
    console.log(data)
    if(data.data===undefined){
        ul.remove();
        return false;
    }
    if(data.data.items===undefined){
        if(data.data.resourceURI){
            data.data.items = [{resourceURI:data.data.resourceURI}];
        }else{
            console.log("remove");
            ul.remove();
            return false;
        }
        
    }

    console.log("ITEMS");
    console.log(data.data.items);
    data.data.items.forEach(el=>{
        requests.push(fetch(el.resourceURI+ENDING_URL).then(response=>response.json()));
    });
    let values = await Promise.all(requests);
    let newData = values.map(el=>el.data.results[0]);
    page = new Page(1,newData,data.type,ul);
    page.display();
    console.log(ul);
    return values;
}



function Comic(data){

    this.relations = [{type:"characters", data:data.characters},
    {type:"series" , data:data.series},{type:"creators", data:data.creators}];
    Card.call(this,this.generateHTMLinfo(data),data.thumbnail.path+"."+data.thumbnail.extension);
}

Comic.prototype = Object.create(Card.prototype);
Comic.prototype.constructor = Comic;

Comic.prototype.generateHTMLinfo = function(data){
    let elements = [];
    let title = document.createElement("h2");
    title.textContent = data.title;
    elements.push(title);
    if(data.description){
        let description = document.createElement("p");
        description.textContent = data.description;
        elements.push(description);
    }
    if(data.prices[0].price){
        let price = document.createElement("h4");
        price.classList.add("price");
        price.textContent = data.prices[0].price+"$";
        elements.push(price);

    }
    return elements;
    //title
    //prices[0].price
    //description
}

Comic.prototype.expandedHTML = function(){
    let title = document.createElement("")
}


function Serie(data){
    this.relations = [{type:"characters", data:data.characters},
   {type:"creators", data:data.creators},
   {type:"comics" , data:data.comics}];
    Card.call(this,this.generateHTMLinfo(data),data.thumbnail.path+"."+data.thumbnail.extension);
    this.characters = data.characters;
    this.creators = data.creators;
    this.comic = data.comics;
}
Serie.prototype = Object.create(Card.prototype);
Serie.prototype.constructor = Serie;
Serie.prototype.generateHTMLinfo = function(data){
    let elements = [];
    let title = document.createElement("h2");
    title.textContent = data.title;
    elements.push(title);
    if(data.description){
        let description = document.createElement("p");
        description.textContent = data.description;
        elements.push(description);
    }
    return elements;
}

function Character(data){
    this.relations = [{type:"series", data:data.series},
    {type:"creators", data:data.creators},
    {type:"comics" , data:data.comics}];
    Card.call(this,this.generateHTMLinfo(data),data.thumbnail.path+"."+data.thumbnail.extension);
    this.comics = data.comics;
    this.series = data.series;
}

Character.prototype = Object.create(Card.prototype);

Character.prototype.constructor = Character;

Character.prototype.generateHTMLinfo = function(data){
    let elements = [];
    let title = document.createElement("h2");
    title.textContent = data.name;
    elements.push(title);
    if(data.description){
        let description = document.createElement("p");
        description.textContent = data.description;
        elements.push(description);
    }
    return elements;
}

function Creator(data){
    this.relations = [{type:"characters", data:data.characters},
    {type:"series", data:data.series},
    {type:"comics" , data:data.comics}];
    Card.call(this,this.generateHTMLinfo(data),data.thumbnail.path+"."+data.thumbnail.extension);
}
Creator.prototype = Object.create(Card.prototype);
Creator.prototype.constructor = Creator;
Creator.prototype.generateHTMLinfo = function(data){
    let title = document.createElement("h2");
    title.textContent = data.fullName;
    //console.log(data.fullName);
    //console.log(title);
    return [title];
}
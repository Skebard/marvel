
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
    divImage.style.backgroundImage = "url('"+this.image+"')";
    divInfo.append(...this.html,moreInfo);
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
    this.characters;
    this.series = data;
    this.creators;
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

Comic.prototype.buy = function(){
    console.log("i Bought")
}


function Serie(data){
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
    Card.call(this,this.generateHTMLinfo(data),data.thumbnail.path+"."+data.thumbnail.extension);
}
Creator.prototype = Object.create(Card.prototype);
Creator.prototype.constructor = Creator;
Creator.prototype.generateHTMLinfo = function(data){
    console.log("hihih");
    let title = document.createElement("h2");
    title.textContent = data.fullName;
    //console.log(data.fullName);
    //console.log(title);
    return [title];
}
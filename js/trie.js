



function TrieNode (letter=""){
    this.val = letter;
    this.children = {};
    this.completesString = false;
}

function Trie(){
    this.rootNode = new TrieNode();
}

/**
 * Inserts a word/sencte in the trie
 * @param {string} word
 */
Trie.prototype.insert = function(word){
    let node = this.rootNode;
    for(let i = 0; i<word.length; i++){
        let currentLetter = word[i];
        if(node.children[currentLetter]){   //check if current letter is in the current node
            node = node.children[currentLetter];    //if exists we go to the next node
        }else{
            let newNode = new TrieNode(currentLetter);  //we create new node
            node.children[currentLetter] = newNode;
            node = newNode;
        }
    }
    node.completesString = true;
}

Trie.prototype.find = function(word){
    let node = this.rootNode;
    for(let i = 0; i<word.length; i++){     //word ant
        let currentLetter = word[i];        // a n t
        if(node.children[currentLetter]){
            node = node.children[currentLetter]
        }else{
            return false;
        }
    }
    if(node.completesString){ // to ensure that only fins inserted words
        return true;            //removing this condition it would also find 
    }                           //word that are contained in other words
    return true;                // e.g "singer" contains "sing"
}

//return all word which cotain word as a prefix.
Trie.prototype.getSuggestions = function(word){
    let node = this.findNode(word);
    if(node){
        return this.suffixWordsInNode(node,true).map(suffix=>word+suffix);
    }else{
        return false;
    }
}

Trie.prototype.findNode = function(word){
    let node = this.rootNode;
    for(let i=0; i<word.length; i++){
        let currentLetter = word[i];
        if(node.children[currentLetter]){
            node = node.children[currentLetter];
        }else{
            return false;
        }
    }
    return node;
}

//Returns all the found suffixes starting from a node.
// the parameters first indicates if is the reference node or no
Trie.prototype.suffixWordsInNode = function(node = this.rootNode,first=false){
    let foundWords = [];
    if(node.completesString&&!first){
         foundWords.push(node.val);
    }
    let keys = Object.keys(node.children);
    for(let i = 0;i<keys.length; i++){
        let childrenWords = this.suffixWordsInNode(node.children[keys[i]]);
        childrenWords = childrenWords.map((el)=>{
            if(first){
                return el;
            }else{
                return node.val + el;
            }
        });
        foundWords.push(...childrenWords);
    }
    return foundWords;
}


Trie.prototype.remove = function(word){}








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
//Find a word in the trie.
//If the word is found returns true, if not false
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


//return all words which cotain a word as a prefix.
Trie.prototype.getSuggestions = function(word){
    let node = this.findNode(word);
    if(node){
        return this.suffixWordsInNode(node,true).map(suffix=>word+suffix);
    }
        return false;
}
//retuns N words (if exist) that contain the selected word as a prefix
Trie.prototype.getNsuggestions = function(word,quantity){
    let node = this.findNode(word);
    if(node){
        return this.nSuffixWordsInNode(node,quantity,true).map(suffix=>word+suffix);
    }
    return false;
}

//return N suffixes of the selected node
Trie.prototype.nSuffixWordsInNode = function(node = this.rootNode,quantity,first){
    let found = 0;
    let foundWords = [];
    if(quantity===0){
        return foundWords;
    }
    if(node.completesString===true && !first){
        foundWords.push(node.val);
        found++;
    }

    let keys = Object.keys(node.children);
    for(let i=0; i< keys.length; i++){
        if(found>=quantity){
            break;
        }
        let childrenWords = this.nSuffixWordsInNode(node.children[keys[i]],quantity-found);
        found+=childrenWords.found;
        childrenWords = childrenWords.words.map(el=>{
            if(first){
                return el;
            }else{
                return node.val +el;
            }
        });
        foundWords.push(...childrenWords);
    }
    if(!first){         //for the final result we only want the array with the found words.
    return {words:foundWords,
            found: found};
    }
    return foundWords;
}

//finds the node correspondend to the selected word
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

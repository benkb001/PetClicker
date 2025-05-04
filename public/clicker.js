let coinDisplay = document.getElementById('coins');
let dogDisplay = document.getElementById('dogs');
let catDisplay = document.getElementById('cats'); 
let dogPic = document.getElementById('dogPic');
let catPic = document.getElementById('catPic');

setPrices();

if(dogPic != null) {
    setDogPic(); 
}

if(catPic != null) {
     setCatPic(); 
}

async function save() {
    await fetch('/save', {
        method: 'POST',  
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ coins: coins, dogs: dogs, cats: cats }), 
    });
}
function coinClick() {
    coins = coins + (cats * dogs);
    coinDisplay.innerHTML = `Coins: ${coins}`;
}



async function setDogPic() {
    let d = await fetch('https://dog.ceo/api/breeds/image/random');
    let j = await d.json(); 
    dogPic.src = j.message; 
    
}

async function setCatPic() {
    let d = await fetch('https://cataas.com/cat?json=true');
    let j = await d.json(); 
    catPic.src = j.url; // Static image URL
    console.log(catPic.src);
}

function setPrices() {
    let bd = document.getElementById('buyDog')
    if(bd != null) {
        bd.innerHTML = `Buy 1 Dog: ${dogs * 10}`;
    }

    let bc = document.getElementById('buyCat'); 
    if(bc != null) {
        bc.innerHTML = `Buy 1 Cat: ${cats * 10}`;
    }
}

async function buyDog() {
    let cost = dogs * 10; 
    if(coins >= cost) {
        coins -= cost; 
        dogs++; 
    
    coinDisplay.innerHTML = `Coins: ${coins}`;
    dogDisplay.innerHTML = `Dogs: ${dogs}`;

    setPrices(); 
    setDogPic(); 
    let dogPic = document.getElementById("dogPic").src; 
    await fetch('/updateDogPics', {
        method: 'POST',  
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ dogPic: dogPic }), 
      });
    }
}

async function buyCat() {
    let cost = cats * 10; 
    if(coins >= cost) {
        coins -= cost; 
        cats++; 
    
    coinDisplay.innerHTML = `Coins: ${coins}`;
    catDisplay.innerHTML = `Cats: ${cats}`;
    setPrices(); 
    setCatPic(); 
    let catPic = document.getElementById("catPic").src; 
    await fetch('/updateCatPics', {
        method: 'POST',  
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ catPic: catPic }), 
      });
    }
}

async function getData() {
    let req_data = await fetch('/getData', {
        method: 'GET',
      });
    let j_data = await req_data.json();
    dogs = j_data.dogs; 
    cats = j_data.cats; 
    coins = j_data.coins; 
    coinDisplay.innerHTML = `Coins: ${coins}`;
    setPrices(); 
}

 async function updateData() {
    console.log("clicker coins: " + coins + "TEST UPDATEDATA RUN ");
    
    await fetch('/updateData', {
      method: 'POST',  
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ coins: coins, dogs: dogs, cats: cats }), 
    });
  }


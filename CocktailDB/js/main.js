//The user will enter a cocktail. Get a cocktail name, photo, and instructions and place them in the DOM

//TODO: Make arrow buttons functional. Add option to start carousel or stop
document.querySelector('button').addEventListener('click',getDrink);
//let drinkNum = 0;
function getDrink() {
    //Replace any spaces in the user input so they can be passed to the API
    let drink = document.querySelector('input').value.replace(/\s/i,'+')


    //Fetch list of drink matches from cocktailDB
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      let drinkNum = 0;
      console.log(data.drinks[0])
      //Function displays drink recipe, then calls itself after a set time.
      function nextDrink() {
        //Display drink name, image, and recipe in the HTML
        document.querySelector('h2').innerText = data.drinks[drinkNum].strDrink;
        document.querySelector('img').src = data.drinks[drinkNum].strDrinkThumb;
        document.querySelector('h3').innerText = data.drinks[drinkNum].strInstructions;
        console.log("Display drink ",drinkNum," out of ",data.drinks.length);
        //Increment drinkNum or reset to 0
        if (drinkNum < data.drinks.length-1) {
          drinkNum++;
        } else {
          drinkNum = 0;
        }

        setTimeout(nextDrink,155000);
      }

      nextDrink();
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
    
}

// function displayDrink(drinkList) {
//   if (!drinkNum) {
//     let drinkNum = 0;
//   }
//   document.querySelector('h2').innerText = drinkList.drinks[drinkNum].strDrink;
//   document.querySelector('img').src = drinkList.drinks[drinkNum].strDrinkThumb;
//   document.querySelector('h3').innerText = drinkList.drinks[drinkNum].strInstructions;
//   //Increment drinkNum or reset to 0 for next call to this function.
//   if (drinkNum < drinkList.length-1) {
//     drinkNum++;
//   } else {
//     drinkNum = 0;
//   }
//   setTimeout(displayDrink,3000);
// }
// var slideIndex = 0;
// carousel();

// setTimeout(displayDrink(data,drinkNum), 2000);

// function carousel() {
//   var i;
//   var x = document.getElementsByClassName("mySlides");
//   for (i = 0; i < data.length; i++) {
//     x[i].style.display = "none";
//   }
//   slideIndex++;
//   if (slideIndex > x.length) {slideIndex = 1}
//   x[slideIndex-1].style.display = "block";
//   setTimeout(carousel, 2000); // Change image every 2 seconds
// }

//Push homework: carosel of random drinks (data.drinks has many drinks in it; we are just using the first result)

//*DONE*  Homework: Remove ${template literal} and get drinks with spaces in them (moscow mule)


//Homework 2: Look at NASA APIs. Get pic of the day.
//Play around with cocktail database. Get NASA pic of the day API working.
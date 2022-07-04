const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
// import ingredients from './ingredients.json' assert {type: 'json'}
const ingredients = {
    "carbs": ["white rice","brown rice","black beans","pinto beans"],
    "protein": ["chicken","beef","pork","tofu","seitan"],
    "vegetables": ["onions","peppers","corn","broccoli","peas","carrots","avocado","zucchini"],
    "extras": ["cheese","queso","pico de gallo","salsa","mild sauce","guacamole","fire sauce","sour cream","chips"]
}

const cursedIngredients = ["ice cubes","nylon","diced plastic","bin juice","milk","a used sock","grated rubber","soap","Axe body spray","a whole lemon","mustard","super glue"]
const blursed = ["a free curly fry","an onion ring","an enticing aroma","true happiness"]

const allIngredients = []
for (a in ingredients) {
    for (let i=0;i<ingredients[a].length;i++) {
        allIngredients.push(ingredients[a][i]);
    }
}
// console.log(allIngredients)

// const maxIngredients = ingredients["carbs"].length + ingredients["protein"].length + ingredients["vegetables"].length + ingredients["extras"].length;
// console.log(`Number of ingredients (uncursed): ${maxIngredients}   with cursed: ${maxIngredients + cursedIngredients.length}`)

app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`)
})

MongoClient.connect(process.env.SERVER)
    .then(client => {
        console.log('Connected to database')
        const db = client.db('burrito-maker')
        const burritoesCollection = db.collection('burritoes')
        

        //Sends "burritoes" array to index.ejs and renders it 
        app.get('/', (req, res) => {
            db.collection('burritoes').find().toArray()
                .then(results => {
                    res.render('index.ejs', {burritoes: results}) 
                })
                .catch(error => console.error(error))
        })

        app.post('/burritoes', (req,res) => {
            let newBurrito = makeBurrito(req.body)
            console.log(newBurrito)
            burritoesCollection.insertOne(newBurrito)
                .then(result => {

                    res.render('order',{burrito: newBurrito})
                })
                .catch(error => console.log(error))
        })

        app.put('/burritoes', (req, res) => {
            console.log(req.body)
            burritoesCollection.findOneAndUpdate(
                { name: 'Yoda'}, 
                {
                    $set: {
                        name: req.body.name,
                        numIngredients: req.body.numIngredients
                    }
                }, 
                {upsert: true}
                ) 
                    .then(result => {res.json('Success!')})
                    .catch(error => console.error(error))
          })

        app.delete('/burritoes', (req, res) => {
            burritoesCollection.deleteOne(
              { name: req.body.name }
            )
              .then(result => {
                  if (result.deletedCount === 0) {
                      return res.json('Nothing to delete')
                  }
                res.json(`Burrito deleted`)
              })
              .catch(error => console.error(error))
          })
    })
    .catch(error => console.error(error))




function makeBurrito(data) {
    let newBurrito = {
        name: data.name,
        numIngredients: data.numIngredients,
        cursed: data.cursed === 'on' ? true : false
    }
    //Check if numIngredients is larger than the max value. If it is, set it to the max value.
    if (newBurrito.cursed && newBurrito.numIngredients > (allIngredients.length + cursedIngredients.length)) {
        newBurrito.numIngredients = (allIngredients.length + cursedIngredients.length);
    } 
    if (!newBurrito.cursed && newBurrito.numIngredients > allIngredients.length) {
        newBurrito.numIngredients = allIngredients.length;
    }

    newBurrito.ingredients = randomIngredients(newBurrito.numIngredients,newBurrito.cursed)
    return newBurrito;
}

function randomIngredients(num,cursed) {
    let selection = [...allIngredients]
    cursed ? selection = [...allIngredients,...cursedIngredients] : selection = [...allIngredients]
    let picks = []
    for (let i=0;i<num;i++) {
        let n=Math.floor(Math.random()*selection.length)
        picks.push(selection[n])
        selection.splice(n,1);
    }
    return picks;
}



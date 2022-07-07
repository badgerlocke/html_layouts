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

const cursedIngredients = ["ice cubes","nylon","diced plastic","bin juice","milk","a used sock","grated rubber","soap","Axe body spray","a whole lemon","mustard","super glue", "a sense of regret", "apple seeds","mold","tire sealant","scraps of denim","stained underwear","laxatives","lawn clippings","nicotine","Monster energy"]
//const blursed = ["a free curly fry","an onion ring","an enticing aroma","true happiness"]

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
            burritoesCollection.insertOne(newBurrito)
                .then(result => {
                    res.render('order',{burrito: newBurrito})
                })
                .catch(error => console.log(error))
        })

        app.put('/burritoes', (req, res) => {
            console.log("Trying to find order " + req.body.orderNum)
            let newFilling = []
            const order = burritoesCollection.findOne({orderNum: req.body.orderNum})
            .then( data => {
                console.log("Found: "+ JSON.stringify(data))
                newFilling = randomIngredients(data.numIngredients,data.cursed)
                //console.log("New filling: " + newFilling)
            }
            )
            burritoesCollection.findOneAndUpdate(
                {orderNum: req.body.orderNum},
                {$set: {ingredients: [...newFilling]}},
                { upsert: true}
            )
                .then(result => {
                    console.log("Updated ingredients")
                    console.log("New object: " + JSON.stringify(result.value))
                    res.render('order',{burrito: result.value})
                })
                .catch(error => console.error(error))
            // updateOrder(req.body.orderNum)
          })
        
        async function updateOrder(idNum) {
            // try{
            //     const order = await burritoesCollection.findOne({orderNum: idNum})
            //     console.log(order)

            // } catch (err) {
            //     throw err
            // }
            // console.log(order)
            console.log("ID num: " + typeof(idNum))
            burritoesCollection.findOne({ orderNum: idNum }, function(err, result) {
                if (err) throw err;
                console.log(result);
              });
        }
        

        app.delete('/burritoes', (req, res) => {
            console.log("Req to delete " + req.body.orderNum)
            burritoesCollection.deleteOne(
              { orderNum: req.body.orderNum }
            )
              .then(result => {
                  if (result.deletedCount === 0) {
                      return res.json('No order to delete')
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
        orderNum: generateOrderNumber(),
        cursed: data.cursed === 'on' ? true : false,
        
    }
    console.log(newBurrito.orderNum)
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

function generateOrderNumber() {
    return String(Math.floor(10000000*Math.random()))
}

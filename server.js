import express from 'express';
import expressHandlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Verb from './mongoDB/verbs.js';
import By from './worlds/by.js';
import cors from 'cors';
import UserForm from './mongoDB/users.js';

const app = express();
const port = 3001;

const handlebars = expressHandlebars.create({
	defaultLayout: 'main', 
	extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }, 
});

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(bodyParser.json())

mongoose.connect('mongodb://127.0.0.1:27017/Verbs', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB: '));
db.once('open', () => {
  console.log('Подключено к MongoDB');
});


// Verb.insertMany(By).then(() => {
//   console.log('yes')
// }).catch((err) => {
//   console.error(err, 'no')
// })

app.use(cors({
  origin: 'http://localhost:3000', // Укажите адрес вашего клиентского приложения React
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.get('/', (req, res) => {
    res.render('mainPage')
})

app.get('/api/date', async (req,res) => {
  const date = await Verb.find({})
  res.json(date)
})

app.post('/registerUser', (req,res) => {
  const {name,password,email} = req.body;

  const user = {
    name: name,
    password: password,
    email: email
  }

  res.json({success: true})


  UserForm.collection.insertOne(user).then(() => {
    console.log('yes')
  }).catch(err => {
    console.error(err)
  })
})

app.listen(port, () => {
    console.log(`server run ${port}`)
})



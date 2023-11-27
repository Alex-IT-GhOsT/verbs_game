import express from 'express';
import expressHandlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Verb from './mongoDB/verbs.js';
import By from './worlds/by.js';
import cors from 'cors'

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



app.listen(port, () => {
    console.log(`server run ${port}`)
})



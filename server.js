import express from 'express';
import expressHandlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import UserForm from './mongoDB/users.js';
import bcrypt from 'bcrypt'
import verbModel from './mongoDB/allWords.js';
import jwt from 'jsonwebtoken';
import UserProgress from './mongoDB/userProgress.js';

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

mongoose.connect('mongodb://127.0.0.1:27017/Cards_Game', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB: '));
db.once('open', () => {
  console.log('Подключено к MongoDB');
});

app.use(cors({
  origin: 'http://localhost:3000', // Укажите адрес вашего клиентского приложения React
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

const saltRound = 10;

app.get('/api/date', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Отсутствует токен авторизации' });
  }
  try{
    const decoded = jwt.verify(token, '12345');
    if (decoded) {   
      const catAbout = (await verbModel.find({title:'About'})).length;
      const catAt = (await verbModel.find({title:'At'})).length;
      const catAway = (await verbModel.find({title:'Away'})).length;
      const catBy = (await verbModel.find({title:'By'})).length;
      const catDown = (await verbModel.find({title:'Down'})).length;
      const catOff = (await verbModel.find({title:'Off'})).length;
      const catOut = (await verbModel.find({title:'Out'})).length;
      const catUp = (await verbModel.find({title:'Up'})).length;
      const userProgQuest = await UserProgress.find({name: decoded.userName});
      const getIdQuests = userProgQuest.map((itemId) => itemId.numberQuests.quests.map(item => item.idQuest));
      const flatArray = getIdQuests.flat();
      const getAllQuestArray = [];

      for (const item of flatArray) {
        const getAllQuest = await verbModel.find({_id: item});
        getAllQuestArray.push(getAllQuest);
      }

      const flatAllArr = getAllQuestArray.flat();
      const allIdAnsweredQuests = flatAllArr.map(item => item._id.toString());
      const needToLearn = await verbModel.find({_id : {$nin : allIdAnsweredQuests}});
      const arrTitlles = [
        {'About': catAbout},
        {'At': catAt},
        {'Away': catAway},
        {'By': catBy},
        {'Down': catDown},
        {'Off': catOff},
        {'Out': catOut},
        {'Up': catUp},
      ];
      const userTitle = userProgQuest.map(item => item.nameBlock);
      const userQuests = userProgQuest.map(item => item.numberQuests.quests.length);
      const obj = userTitle.reduce((acc, cur, index) => {
        acc[cur] = userQuests[index];
        return acc;
      },{})
      const titlesArr = [];
      arrTitlles.forEach(item => {
        const [key, value] = Object.entries(item)[0];
        if (obj.hasOwnProperty(key) && obj[key] === value) {
          titlesArr.push(key);
        }
      })
      const filterTitles = arrTitlles.filter((item) => (Object.keys(item).toString() !== titlesArr.toString()));
      return res.json({"success": true, arrTitles: filterTitles.map(item => Object.keys(item)), words: flatAllArr, allWords: needToLearn, totalWords: arrTitlles})
    }
  } catch (err) {
    console.log(err);
  }
})

app.get('/api/date/:blockName', async (req,res) => {
  const blockName = req.params.blockName;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Отсутствует токен авторизации' });
  }
  try {
    const decoded = jwt.verify(token, '12345');
    if (decoded) {
      const data = await verbModel.find({title: blockName});
      const knowQuestionsUser = await UserProgress.findOne({userName: decoded.username, nameBlock: blockName});
        if (knowQuestionsUser) {
          const answeredQuestionsId = knowQuestionsUser.numberQuests.quests.map((item) => item.idQuest);
          const allQuestions = data.filter((item) => !answeredQuestionsId.includes(item._id.toString()));
          return res.json({'success': true, 'data': allQuestions});
        } else {
          return res.json({'success': true, 'data': data});
        } 
      } 
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Недействительный токен' });
    }
    return res.status(500).json({ message: 'Произошла ошибка при проверке токена' });
  }
})

app.post('/registerUser', async (req,res) => {
  const {name,password,email} = req.body;
  console.log(name,password,email)
  try {
    const isCheckUserName = await UserForm.findOne({name: name});
    const isCheckUserEmail = await UserForm.findOne({email: email});
    console.log(isCheckUserName,isCheckUserEmail)
    if(isCheckUserName || isCheckUserEmail) {
      res.json({'success': false, 'message': 'Такой пользователь уже есть'});
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRound);
      const newUser = {
        name: name,
        password: hashedPassword,
        email: email
      };
    const userNew = await UserForm.collection.insertOne(newUser);
    const payload = {
      user_id: userNew._id,
      username: userNew.name
      }
    const token = jwt.sign(payload, '123', {expiresIn: '1h'});
    res.json({ success: true, message: 'Пользователь успешно зарегистрирован', authorization: token });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Произошла ошибка при регистрации пользователя' });
  }
})

app.post('/checkUser', async (req, res) => {
  const {email, password} = req.body;
  try{
    const checkUser = await UserForm.findOne({email:email});
    const payload = {
      user_id : checkUser._id,
      username: checkUser.name
    }
    const token = jwt.sign(payload, '12345');
    if (!checkUser) {
       return res.json({success: false, message: 'Пользователь не найден'});
    }
    const passwordMatch = bcrypt.compare(password, checkUser.password);
    if (passwordMatch) {
      return res.json({ success: true, message: 'Вход выполнен успешно', name: checkUser.name, authorization: token});
    } else {
      return res.json({ success: false, message: 'Неверный пароль' });
    }
  }catch (err) {
    return res.status(500).json({ success: false, message: 'Произошла ошибка при входе'});
}
})

app.post('/progressUser/', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  const title = req.body.quest.title;
  const idQuest = req.body.quest._id;
  const number = +req.body.numberQuest;
  const decode = jwt.verify(token,'12345');
  try {
    if (decode) {
      const userName = decode.username;
      const exitingUserProgress = await UserProgress.findOne({userName: userName, nameBlock: title,});
      if (!exitingUserProgress) {
        const userProgress = new UserProgress({
        userName: userName,
        nameBlock: title,
        numberQuests:{
          quests:
            [
              {
              idQuest: idQuest,
              numberQuest: number
              }
            ]
          } 
        })
        await userProgress.save();
        return res.json({"success": true});
      } else {
        const arrIdQuests = exitingUserProgress.numberQuests.quests.map((item) => item.idQuest);
        if (!arrIdQuests.includes(idQuest)) {
          const newQuest = {
              idQuest: idQuest,
              numberQuest: number
            };
            exitingUserProgress.numberQuests.quests.push(newQuest);
            await exitingUserProgress.save();
        } 
          return res.json({"success": true});  
        } 
      } 
    } catch(err) {
      return res.status(500).json({ "success": false, "error": err.message });
  }
})

app.get('/deleteProgress', async(req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Отсутствует токен авторизации' });
  }
  const decoded = jwt.verify(token,'12345');
  try{
      if (decoded) {
        const userName = decoded.username;
        const isUser = await UserProgress.findOne({userName: userName});
        console.log(isUser, !isUser )
        if (isUser !== null) {
          await UserProgress.deleteMany({userName: userName});
          res.json({'success': true});
        } else {
          res.json({'success': false});
          console.log('данных пользователя нет')
        }
      }
  }catch (err) {
    return res.status(500).json({ "success": false, "error": err.message });
  }
})

app.listen(port, () => {
    console.log(`server run ${port}`)
})



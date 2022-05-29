const express = require('express')
const path = require('path')
const { get } = require('request')
const ejs = require("ejs");
const app = express()
var arr = [];
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.static(path.join(__dirname, '/images')))
app.use(express.static(path.join(__dirname, '/media')))
app.use(express.static(path.join(__dirname, '/weights')))
app.use(express.static(path.join(__dirname, '/dist')))
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.redirect('/face_recognition'))
app.get('/face_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'faceRecognition.html')))

app.post('/fetch_external_image', async (req, res) => {
  const { imageUrl } = req.body
  if (!imageUrl) {
    return res.status(400).send('imageUrl param required')
  }
  try {
    const externalResponse = await request(imageUrl)
    res.set('content-type', externalResponse.headers['content-type'])
    return res.status(202).send(Buffer.from(externalResponse.body))
  } catch (err) {
    return res.status(404).send(err.toString())
  }
})
app.post("/user",(req,res)=>{
  res.sendFile(path.join(viewsDir, 'user.html'));
})
app.post("/face-recognition",(req,res)=>{
  res.sendFile(__dirname+"/views/faceRecognition.html");
})
app.post("/admin",(req,res)=>{
  res.render(__dirname+"/views/Admin.ejs",{array:arr});
})
app.post("/verify",(req,res)=>{
  res.sendFile(__dirname+"/views/verify.html");
})
var today = new Date();
var date1 = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

  arr.forEach(function(arr){
    if(arr.date !=date1)
    {
      arr.pop();
    }
  });
app.post("/submit",(req,res)=>{
  var name = req.body.name;
  var age =req.body.age;
  var docType = req.body.docType;
  var docNo = req.body.docNo;
  var phoneNo = req.body.phoneNo;
  var email = req.body.email;
  var photo = req.body.photo;
  var time = req.body.time;
  var date = req.body.date;
  var input = {
    name:name,
    age:age,
    docType:docType,
    docNo:docNo,
    phoneNo:phoneNo,
    email:email,
    photo:photo,
    time:time,
    date:date
  };
  console.log(input);
  // console.log(date1);
  arr.push(input);
  res.sendFile(__dirname+"/views/submit.html");
})
app.listen(process.env.PORT, () => console.log('Listening on port 3000!'))

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

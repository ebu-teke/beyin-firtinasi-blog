import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import os from "os";
import fs from "fs";
import { fileURLToPath } from 'url';
const port = 3000;
const app = express();
var posts = [];
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function NewPost(title,content,image){
    var date = new Date();
    this.title = title;
    this.content = content;
    this.image = image;
    this.date = date.getDay()+"."+date.getMonth()+"."+date.getFullYear();
};

app.get("/",(req,res)=>{
    // posts.push(new NewPost("abc","lorem ipsum dolr sir amwt, concesitsus doler.","/images/apple-logo.png"))
    const data = {
        page: "main",
        posts: posts,
        year: new Date().getFullYear()
    };
    res.render("main.ejs",data);
});
app.get("/create",(req,res)=>{
    // posts.push(new NewPost("abc","lorem ipsum dolr sir amwt, concesitsus doler.","/images/apple-logo.png"))
    const data = {
        page: "create",
        year: new Date().getFullYear()
    };
    res.render("create.ejs",data);
});
const uploadDir = path.join(__dirname, 'public/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Ensure the file has the correct extension
        const ext = path.extname(file.originalname);
        var date = new Date();
        cb(null, "file_"+file.originalname+date.getDay()+"-"+date.getMonth()+"-"+date.getFullYear() + ext);
    }
});
const upload = multer({ storage: storage });

app.post("/save",upload.single("image"),(req,res,next)=>{
    var date = new Date();
    var title = req.body["title"];
    var content = req.body["content"];
    // req.body["title"].trim().replaceAll(" ","_")
    var image = "/images/"+"file_"+req.file.originalname+date.getDay()+"-"+date.getMonth()+"-"+date.getFullYear()+path.extname(req.file.originalname);
    posts.push(new NewPost(title,content,image));
    console.log(image);
    res.redirect("/");
    next();
});
app.get("/post/:index",(req,res)=>{
    const data = {
        index: req.params.index,
        post: posts[req.params.index],
        year: new Date().getFullYear()
    }
    res.render("post.ejs", data);
});
app.post("/delete", (req,res,next)=>{
    var postIndex = req.body["postID"];
    fs.unlink(path.join(__dirname,"public/",posts[postIndex].image),(err)=>{});
    posts.splice(postIndex, 1);
    res.redirect("/");
    next();
});
app.get("/edit/:id",(req,res)=>{
    const data = {
        postId: req.params.id,
        posts: posts,
        year: new Date().getFullYear()
    }
    res.render("create.ejs",data)
});
app.post("/update",upload.single("image"),(req,res, next)=>{
    var date = new Date();
    var indx = req.body["postId"]
    var title = req.body["title"];
    var content = req.body["content"];
    var image = posts[indx].image;
    if(typeof req.file !== "undefined"){
        image = "/images/"+"file_"+req.file.originalname+date.getDay()+"-"+date.getMonth()+"-"+date.getFullYear()+path.extname(req.file.originalname);
    }
    posts[indx] = new NewPost(title,content,image);
    res.redirect("/");
    next();
});
app.get("/about",(req,res)=>{
    const data = {
        year: new Date().getFullYear()
    }
    res.render("about.ejs",data);
});


app.listen(port, () =>{
    console.log("The app is up and running on port " +port+"!");
});
posts.push(new NewPost("Truman Show filminin mükemmelliği","Aranızda izleyenler var mı bilmiyorum ama o film kesinlikle hayatımda izlediğim en iyi filmdi. Kurgusu, karakterleri, konusu ayrı mükemmeldi. Ve tabii ki Jim Carrey! Bu adam bir efsane cidden.","/images/file_b376a73b927d815ed262d496a6566f85.jpg2-6-2024.jpg"));
posts.push(new NewPost("That one HIMYM episode where Barney took a whole trip to China for a bet","Was for real the best HIMYM episode ever. If you haven't watched HIMYM yet you are losing so much, go watch that masterpiece right now!! I won't say the episod just so you go through all 9 seasons and get captured by the beauty fo this series.. Anyways, we saw Lily, Robin and Marshall as the three masters and they were hilarious. Barney the best caharacter in the series fr.","/images/file_6213a339e0c7e4b7b7bb439aae3f37ca.jpg2-6-2024.jpg"));
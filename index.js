const { log } = require("console");
const express = require("express");
const app = express();
const mysqlConexion = require("express-myconnection");
const mysql = require("mysql")
const cors = require("cors");
const {resolve} = require("path")  
const bodyParser = require("body-parser");

app.use(cors({
    origin:"http://localhost:5173"
  
  
  }));
  
app.use(bodyParser.urlencoded({ extended: true }));
const config ={
    host :"bdi9402wcemoiygofcsg-mysql.services.clever-cloud.com",
    user : "uuj2rptwesx92ql2",
    password: "qdiGNGMNHt7wiGjgFln",
    database:"bdi9402wcemoiygofcsg",
    port : 3306
}

app.use(mysqlConexion(mysql, config,"single"))

app.get("/", (req,res)=>{
    res.end("hshhhhhhhhhhhhhhhhhhhhhhh")})

app.get("/hola/:n", (req,res)=>{
    res.end(req.params.n)
   
try{
    const correo = "juan"
const consula = "select  * from juan"
req.getConnection((err, con)=>{
    if(err){
        console.log(err)
    }
    con.query(consula, (err, result)=>{
        if(err){
            console.log(err);
        }else{
            console.log(result);
          
        }
    })
})
}catch{
console.log("no funciono");
}

})

 
app.get("/re", (req, res)=>{
     const consulta = "select * from users"
     req.getConnection((err, con)=>{
        if(err){
console.log(err);
res.status(500).send("Error al conectar a la base de datos");
return;
        }else{
con.query(consulta, (err, resultados)=>{
    if (err) {
        console.error("Error al ejecutar la consulta:", err);
        res.status(500).send("Error al ejecutar la consulta");
        return;
    }else{
        console.log("bien all");
        res.send(result);
    }
})
        }
     }) 
})

app.listen(3000, ()=>{
    console.log("puero 3000");
})
const { log } = require("console");
const express = require("express");
const app = express();
const mysqlConexion = require("express-myconnection");
const mysql = require("mysql")
const cors = require("cors");
const {resolve} = require("path")  

app.use(cors({
    origin:"http://localhost:5173"
  
  
  }));
  
app.use(bodyParser.urlencoded({ extended: true }));
const config ={
    host :"localhost",
    user : "root",
    password: "v18135w00",
    database:"panaderia",
    port : 3306
}

app.use(mysqlConexion(mysql, config,"single"))

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
     const consulta = "select * from casas"
     req.getConnection((err, con)=>{
        if(err){
console.log(err);
        }else{
con.query(consulta, (err, resultados)=>{
    if (err) {
        console.log(err);
    }else{
        res.json(resultados)
    }
})
        }
     }) 
})

app.listen(3000, ()=>{
    console.log("puero 3000");
})
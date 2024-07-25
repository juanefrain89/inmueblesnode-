const express = require("express")
const mysql = require("mysql")
const expresscon = require("express-myconnection")
const app = express()

const config ={
    host:"localhost",
    user: "root",
    password:"v18135w00",
    database : "panaderia",
    port : 3306
}
app.use(expresscon(mysql, config , "single"))
app.get("/", (req, res)=>{
    req.getConnection((err, con)=>{
        if(err){
            console.log(err);
        }else{
            const a ="SELECT * from casas"
            con.query(a, (err, resul)=>{
                if(err){
                    console.log(err)                    
                }
                console.log(resul);
                res.send(resul)
            })
        }
    })

})
app.listen(4200, ()=>{
    console.log("hola");
})

 
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const mysql = require("mysql");
const mysqlConexion = require("express-myconnection");
const path = require("path");
const cors = require("cors");

const bodyParser = require("body-parser");
 console.log("hellos");
app.set(4200);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(cors({
  origin:"https://ultimo-5mz4.onrender.com"


}));


const dbConfig = {
    host: "bx3vv1mm1wwgct4dnagv-mysql.services.clever-cloud.com",
  user: "u4qtpdntbug6qfgq",
  password: "qmpGUlXyfQhfE9w18H9j",
  database: "bx3vv1mm1wwgct4dnagv",
  port: 3306 
};


app.use(mysqlConexion(mysql, dbConfig, "single"));



  


app.use(bodyParser.urlencoded({ extended: true }));


app.get("/peticiones", (req, res) => {

  const { correo, password } = req.body;
  
  console.log("Correo recibido:", correo);
  
  try {
    const query = `SELECT * FROM users`;
  
    console.log(query);
  
    req.getConnection((err, con) => {
      if (err) {
        console.error("Error al conectar a la base de datos:", err);
        res.status(500).send("Error al conectar a la base de datos");
        return;
      }

      con.query(query, (err, result) => {
        if (err) {
          console.error("Error al ejecutar la consulta:", err);
          res.status(500).send("Error al ejecutar la consulta");
          return;
        }
        
        console.log("Resultados de la consulta:", result);
        
        // Aquí puedes hacer algo con los resultados, como enviarlos en la respuesta
        res.send(result);
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});


 



app.use(express.static(path.join(__dirname, "public")));

app.listen(3306, () => {
  console.log("Server running on port 3000");
 
});
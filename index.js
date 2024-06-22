const express = require("express");
const app = express();
const mysql = require("mysql");
const mysqlConexion = require("express-myconnection");
const bodyParser = require("body-parser");

const cors = require("cors");
// Configuración de la conexión a la base de datos
const dbConfig = {
  host: "bbw78mczcfckqp6to5nv-mysql.services.clever-cloud.com",
  user: "uzpcg9aquasocbae",
  password: "JldJr3skodxQ55iLISzi",
  database: "bbw78mczcfckqp6to5nv",
  port: 3306,
   
};
 
app.use(cors({
    origin: 'https://inm-fmio.onrender.com',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 
app.use(mysqlConexion(mysql, dbConfig, "single"));

// Ruta de prueba para verificar la conexión
app.get("/", (req, res) => {
  res.send("¡Conexión exitosa a la base de datos en Clever Cloud!");
});

// Ruta para manejar las peticiones a la base de datos
app.get("/peticiones", (req, res) => {
  const query = `SELECT * FROM casas`;

  req.getConnection((err, con) => {
    if (err) {
      console.error("Error al conectar a la base de datos:", err);
      res.status(500).send("Error al conectar a la base de datos");
      return;
    }

    con.query(query, (err, result) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        res.send(err);
        return;
      }

      console.log("Resultados de la consulta:", result);
      res.send(result);
    });
  });
});

app.post("/k", (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    req.getConnection((err, con) => {
    con.query(query, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send('Error inserting user');
        } else {
            console.log('User inserted:', result);
            res.status(200).send('User created successfully');
        }
    });


    })
  });


  app.post("/l", (req, res) => {
    const {numero, precio, correo, metros, baños, descripcion, direccion, cuartos } = req.body
    const metros2 =  parseInt(metros);
    const cuartos2 = parseInt("30")
    console.log(req.body);
        const query = 'INSERT INTO casas (whats,costo, correo, metros, baños,descripcion,ciudad ,cuartos) VALUES (?,?, ?, ?,?,?,?,?)';
    req.getConnection((err, con)=>{
        if(err){
            console.log(err);
        }      
        con.query(query, [numero, precio, correo, metros2, baños, descripcion, direccion, cuartos2], (err, resu)=>{
            if(err){
                console.log(err);
            }
            res.send(resu , "bien")
             
        })
    })
    
 
  });


// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

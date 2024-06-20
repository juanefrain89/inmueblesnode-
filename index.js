const express = require("express");
const mysqlConexion = require("express-myconnection");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la conexión a la base de datos
const config = {
  host: "bdi9402wcemoiygofcsg-mysql.services.clever-cloud.com",
  user: "uuj2rptwesx92ql",
  password: "qdiGNGMNHt7wiGjgFln",
  database: "bdi9402wcemoiygofcsg",
  port: 20558  // Puerto específico de Clever Cloud
};

// Middleware para la conexión MySQL
app.use(mysqlConexion(mysql, config, "single"));

// Rutas
app.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

app.get("/usuarios", (req, res) => {
  const consulta = "SELECT * FROM users";
  
  // Conexión y ejecución de la consulta
  req.getConnection((err, con) => {
    if (err) {
      console.error("Error al conectar a la base de datos:", err);
      res.status(500).send("Error al conectar a la base de datos");
      return;
    }
    
    con.query(consulta, (err, resultados) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        res.status(500).send("Error al ejecutar la consulta");
        return;
      }
      
      console.log("Consulta ejecutada correctamente");
      res.json(resultados); // Enviar resultados como respuesta
    });
  });
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

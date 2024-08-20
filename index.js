const express = require("express");
const mysql = require("mysql");
const mysqlConexion = require("express-myconnection");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

const app = express();

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: "bbw78mczcfckqp6to5nv-mysql.services.clever-cloud.com",
  user: "uzpcg9aquasocbae",
  password: "JldJr3skodxQ55iLISzi5",
  database: "bbw78mczcfckqp6to5nv",
  port: 3306,
};

app.use(cors({
  origin: 'https://inm-fmio.onrender.com',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware personalizado para manejar la reconexión
const reconnectMiddleware = (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) {
      console.error("Error al conectar a la base de datos:", err);
      return res.status(500).send("Error al conectar a la base de datos");
    }

    // Si hubo un error fatal, volver a crear la conexión
    if (err && err.fatal) {
      connection = mysql.createConnection(dbConfig);
      connection.connect(error => {
        if (error) {
          console.error("Error al reconectar a la base de datos:", error);
          return res.status(500).send("Error al reconectar a la base de datos");
        }
        console.log("Reconexion exitosa");
        next();
      });
    } else {
      next();
    }
  });
};

app.use(mysqlConexion(mysql, dbConfig, "single"));
app.use(reconnectMiddleware);

// Configurar multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta de prueba para verificar la conexión
app.get("/", (req, res) => {
  res.send("¡Conexión exitosa a la base de datos en Clever Cloud!");
});
 
app.post("/id", (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  const query = `SELECT * FROM casas WHERE id = ?`;

  req.getConnection((err, con) => {
    if (err) {
      console.error("Error al conectar a la base de datos:", err);
      res.status(500).send("Error al conectar a la base de datos");
      return;
    }

    con.query(query, [id], (err, result) => {
       
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        res.status(500).send(err);
        return;
      }

      console.log(result);
      res.json(result); // Envía los resultados de la consulta al cliente
    });
  });
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

      // Convertir el buffer de la imagen a base64
      result.forEach(row => {
        if (row.imagen) {
          row.imagen = Buffer.from(row.imagen).toString('base64');
        }
      });

     
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
  });
});

app.post("/l", upload.single('imagen'), (req, res) => {
  const { numero, precio, correo, metros, baños, descripcion, direccion, cuartos } = req.body;

  // Convertir metros y cuartos a enteros si es necesario
  const metros2 = parseInt(metros, 10);
  const cuartos2 = parseInt(cuartos, 10);

  // Obtener el buffer de la imagen
  const imagenBuffer = req.file ? req.file.buffer : null;

  console.log(req.body);

  const sql = 'INSERT INTO casas (whats, costo, correo, metros, baños, descripcion, ciudad, cuartos, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [numero, precio, correo, metros2, baños, descripcion, direccion, cuartos2, imagenBuffer];

  req.getConnection((err, con) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error de conexión a la base de datos');
    }

    con.query(sql, values, (err, resu) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error al insertar en la base de datos');
      }
      res.status(200).send({ message: 'Registro exitoso', result: resu });
    });
  });
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

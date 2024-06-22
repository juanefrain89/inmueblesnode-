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
  origin: 'https://inm-fmio.onrender.com/',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Función para manejar la desconexión y reconectar
const handleDisconnect = (dbConfig) => {
  const connection = mysql.createConnection(dbConfig);
  
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to database:', err);
      setTimeout(() => handleDisconnect(dbConfig), 2000); // Reintentar conexión después de 2 segundos
    } else {
      console.log('Connected to the database');
    }
  });

  connection.on('error', err => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal) {
      handleDisconnect(dbConfig); // Reconectar en caso de pérdida de conexión o error fatal
    } else {
      throw err;
    }
  });

  return connection;
};

let connection = handleDisconnect(dbConfig);

app.use((req, res, next) => {
  req.getConnection = (callback) => {
    callback(null, connection);
  };
  next();
});

// Función para ejecutar la consulta con reintento en caso de error
const executeQueryWithRetry = (con, query, params, retries, callback) => {
  con.query(query, params, (err, result) => {
    if (err) {
      if (retries > 0 && (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR')) {
        console.error('Query failed, retrying...', err);
        connection = handleDisconnect(dbConfig); // Reestablecer la conexión
        setTimeout(() => executeQueryWithRetry(connection, query, params, retries - 1, callback), 2000); // Reintentar después de 2 segundos
      } else {
        callback(err, null);
      }
    } else {
      callback(null, result);
    }
  });
};

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
        res.status(500).send("Error al ejecutar la consulta");
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
    if (err) {
      console.error("Error al conectar a la base de datos:", err);
      res.status(500).send("Error al conectar a la base de datos");
      return;
    }

    executeQueryWithRetry(con, query, [username, email, password], 3, (err, result) => {
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

app.post("/l", (req, res) => {
  const { numero, precio, correo, metros, baños, descripcion, direccion, cuartos } = req.body;
  const metros2 = parseInt(metros);
  const cuartos2 = parseInt("30");
  console.log(req.body);
  const query = 'INSERT INTO casas (whats, costo, correo, metros, baños, descripcion, ciudad, cuartos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  req.getConnection((err, con) => {
    if (err) {
      console.error("Error al conectar a la base de datos:", err);
      res.status(500).send("Error al conectar a la base de datos");
      return;
    }

    executeQueryWithRetry(con, query, [numero, precio, correo, metros2, baños, descripcion, direccion, cuartos2], 3, (err, result) => {
      if (err) {
        console.error('Error inserting house:', err);
        res.status(500).send('Error inserting house');
      } else {
        res.send(result);
      }
    });
  });
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

/// Puerto 

process.env.PORT = process.env.PORT || 3000;

// Environment

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de datos

let urldb;

if (process.env.NODE_ENV === 'dev') {
    urldb = 'mongodb://localhost:27017/contactos';
} else {
    urldb = process.env.MONGO_URI;
}

process.env.URLDB = urldb;
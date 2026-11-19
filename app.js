const express = require('express');
const path = require('path');
const mahasiswaRoutes = require('./routes/mahasiswa');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/mahasiswa'));
app.use('/mahasiswa', mahasiswaRoutes);

// Penanganan galat umum
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Terjadi kesalahan pada server: ' + err.message);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

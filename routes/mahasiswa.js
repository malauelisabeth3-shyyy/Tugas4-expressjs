const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Validasi masukan sisi server
function validasi({ nim = '', nama = '', email = '', jurusan = '' }) {
  const errors = [];
  if (!/^\d{10,15}$/.test(nim.trim())) errors.push('NIM wajib berupa angka 10–15 digit.');
  if (nama.trim().length < 3) errors.push('Nama minimal 3 karakter.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.push('Format email tidak valid.');
  if (!jurusan.trim()) errors.push('Jurusan wajib diisi.');
  return errors;
}

// READ (daftar + pencarian)
router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim();
  const [rows] = q
    ? await db.query(
        'SELECT * FROM mahasiswa WHERE nim LIKE ? OR nama LIKE ? ORDER BY id DESC',
        [`%${q}%`, `%${q}%`]
      )
    : await db.query('SELECT * FROM mahasiswa ORDER BY id DESC');
  res.render('index', { rows, q, status: req.query.status || '' });
});

// CREATE (formulir)
router.get('/tambah', (req, res) => {
  res.render('form', {
    judul: 'Tambah Mahasiswa',
    action: '/mahasiswa',
    data: {},
    errors: []
  });
});

// CREATE (proses)
router.post('/', async (req, res) => {
  const errors = validasi(req.body);
  const render = (errs) =>
    res.status(400).render('form', {
      judul: 'Tambah Mahasiswa', action: '/mahasiswa', data: req.body, errors: errs
    });
  if (errors.length) return render(errors);

  try {
    const { nim, nama, email, jurusan } = req.body;
    await db.query(
      'INSERT INTO mahasiswa (nim, nama, email, jurusan) VALUES (?, ?, ?, ?)',
      [nim.trim(), nama.trim(), email.trim(), jurusan.trim()]
    );
    res.redirect('/mahasiswa?status=tambah');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return render(['NIM sudah terdaftar.']);
    throw err;
  }
});

// UPDATE (formulir)
router.get('/:id/edit', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM mahasiswa WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).send('Data tidak ditemukan.');
  res.render('form', {
    judul: 'Ubah Data Mahasiswa',
    action: `/mahasiswa/${req.params.id}/update`,
    data: rows[0],
    errors: []
  });
});

// UPDATE (proses)
router.post('/:id/update', async (req, res) => {
  const action = `/mahasiswa/${req.params.id}/update`;
  const errors = validasi(req.body);
  const render = (errs) =>
    res.status(400).render('form', {
      judul: 'Ubah Data Mahasiswa', action, data: req.body, errors: errs
    });
  if (errors.length) return render(errors);

  try {
    const { nim, nama, email, jurusan } = req.body;
    await db.query(
      'UPDATE mahasiswa SET nim = ?, nama = ?, email = ?, jurusan = ? WHERE id = ?',
      [nim.trim(), nama.trim(), email.trim(), jurusan.trim(), req.params.id]
    );
    res.redirect('/mahasiswa?status=ubah');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return render(['NIM sudah digunakan mahasiswa lain.']);
    throw err;
  }
});

// DELETE
router.post('/:id/hapus', async (req, res) => {
  await db.query('DELETE FROM mahasiswa WHERE id = ?', [req.params.id]);
  res.redirect('/mahasiswa?status=hapus');
});

module.exports = router;

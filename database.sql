CREATE DATABASE IF NOT EXISTS db_crud_tugas4;
USE db_crud_tugas4;

CREATE TABLE IF NOT EXISTS mahasiswa (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nim        VARCHAR(15)  NOT NULL UNIQUE,
  nama       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  jurusan    VARCHAR(50)  NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO mahasiswa (nim, nama, email, jurusan) VALUES
('245150700111001', 'Contoh Mahasiswa Satu', 'satu@student.ub.ac.id', 'Teknologi Informasi'),
('245150700111002', 'Contoh Mahasiswa Dua',  'dua@student.ub.ac.id',  'Teknik Informatika');

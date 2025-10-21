const pool = require("../config/db");

async function listBooks() {
  const [rows] = await pool.query("SELECT * FROM books ORDER BY id DESC");
  return rows;
}

async function getBook(id) {
  const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);
  return rows[0] || null;
}

async function createBook(data) {
  const {
    title,
    author,
    isbn,
    price,
    stock,
    description,
    categoryId,
    coverImage,
    fileUrl,
    publishedDate,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO books 
      (title, author, isbn, price, stock, description, category_id, coverImage, fileUrl, publishedDate) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      author,
      isbn,
      price,
      stock,
      description || null,
      categoryId || null,
      coverImage || null,
      fileUrl || null,
      publishedDate || null,
    ]
  );

  return { id: result.insertId, ...data };
}

async function updateBook(id, data) {
  const {
    title,
    author,
    isbn,
    price,
    stock,
    description,
    categoryId,
    coverImage,
    fileUrl,
    publishedDate,
  } = data;

  await pool.query(
    `UPDATE books SET 
      title=?, author=?, isbn=?, price=?, stock=?, description=?, category_id=?, coverImage=?, fileUrl=?, publishedDate=? 
     WHERE id=?`,
    [
      title,
      author,
      isbn,
      price,
      stock,
      description || null,
      categoryId || null,
      coverImage || null,
      fileUrl || null,
      publishedDate || null,
      id,
    ]
  );
}

async function deleteBook(id) {
  await pool.query("DELETE FROM books WHERE id = ?", [id]);
}

module.exports = { listBooks, getBook, createBook, updateBook, deleteBook };

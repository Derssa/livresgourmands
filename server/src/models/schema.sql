-- Minimal schema for authentication and core entities mapping UML high-level

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role ENUM('CLIENT','ADMIN','EDITOR','MANAGER') NOT NULL DEFAULT 'CLIENT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(150) NOT NULL,
  isbn VARCHAR(20) UNIQUE,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  description TEXT,
  category_id INT,
  coverImage VARCHAR(255),
  fileUrl VARCHAR(255),
  publishedDate DATE,
  CONSTRAINT fk_books_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('PENDING','PAID','CANCELLED') NOT NULL DEFAULT 'PENDING',
  payment_mode VARCHAR(40),
  is_gift BOOLEAN DEFAULT FALSE,
  gift_recipient_name VARCHAR(200),
  gift_recipient_email VARCHAR(190),
  gift_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items (books in an order)
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price_each DECIMAL(10,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Gift lists for authenticated users
CREATE TABLE IF NOT EXISTS gift_lists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  share_code VARCHAR(20) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_gift_lists_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Gift list items (books in a gift list)
CREATE TABLE IF NOT EXISTS gift_list_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gift_list_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_gift_items_list FOREIGN KEY (gift_list_id) REFERENCES gift_lists(id) ON DELETE CASCADE,
  CONSTRAINT fk_gift_items_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Gift purchases (when someone buys from a gift list)
CREATE TABLE IF NOT EXISTS gift_purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gift_list_id INT NOT NULL,
  buyer_user_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT DEFAULT 1,
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_gift_purchases_list FOREIGN KEY (gift_list_id) REFERENCES gift_lists(id) ON DELETE CASCADE,
  CONSTRAINT fk_gift_purchases_buyer FOREIGN KEY (buyer_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_gift_purchases_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Reviews and comments
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  rating TINYINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  content TEXT NOT NULL,
  validated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Library ownership (purchased or gifted e-books)
CREATE TABLE IF NOT EXISTS user_ebooks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  source ENUM('PURCHASE','GIFT') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_ebooks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_ebooks_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_book (user_id, book_id)
);

-- Gift redemption tokens (emailed to recipients)
CREATE TABLE IF NOT EXISTS gift_redemptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  book_id INT NOT NULL,
  recipient_email VARCHAR(190) NOT NULL,
  token VARCHAR(64) NOT NULL UNIQUE,
  redeemed_by_user_id INT NULL,
  redeemed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_gift_redemptions_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_gift_redemptions_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  CONSTRAINT fk_gift_redemptions_user FOREIGN KEY (redeemed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);



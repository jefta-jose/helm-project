-- seed.sql
INSERT INTO users(email, password) VALUES
('ndegwajeff4@gmail.com', 'my1234password'),
('catendegwa4@gmail.com', 'my1234password');

INSERT INTO products(name, price) VALUES
('Laptop', 1200.00),
('Mouse', 25.50);

INSERT INTO purchases(user_id, product_id) VALUES
(1, 1),
(2, 2);
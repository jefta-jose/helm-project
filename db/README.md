# Postgres DB Setup for Helm Project

This guide walks you through setting up a Postgres database for a Helm project, creating tables, and seeding initial data.

---

## 1. Run the Postgres container

```bash
docker run \
  --name helm-project-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=helm_project \
  -p 5432:5432 \
  -v helm-project-pgdata:/var/lib/postgresql \
  -d postgres
```

* Spins up the latest Postgres image
* Container name: `helm-project-postgres`
* Exposes port `5432` for host access
* Persists data in a Docker volume

---

## 2. Connect to the container and database

1. Open a shell inside the container:

```bash
docker exec -it <container-id> sh
```

2. Launch the Postgres interactive client:

```bash
psql -U postgres -d helm_project
```

> Note: `-U postgres` specifies the user, and `-d helm_project` connects to the correct database.

---

## 3. Create the tables

### Users table

```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

### Products table

```sql
CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL
);
```

### Purchases table

```sql
CREATE TABLE purchases (
  purchase_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);
```

> **Tip:** Tables must be created in this order because `purchases` depends on `users` and `products`.

---

## 4. Seed the database with initial data

### Create a `seed.sql` file

```sql
-- seed.sql
INSERT INTO users(email, password) VALUES
('testuser4@gmail.com', 'my1234password'),
('testusrer5@gmail.com', 'my1234password');

INSERT INTO products(name, price) VALUES
('Laptop', 1200.00),
('Mouse', 25.50);

INSERT INTO purchases(user_id, product_id) VALUES
(1, 1),
(2, 2);
```

> Using a SQL file is easier than typing multi-line commands in the interactive shell.

---

### Execute `seed.sql`

#### Option 1: Copy file into the container and run

```bash
docker cp seed.sql <container_id>:/seed.sql
docker exec -it <container-id> sh
psql -U postgres -d helm_project -f seed.sql
```

✅ At this point:

* Postgres container is running
* Database `helm_project` is ready
* Tables and initial data are set up and persisted

---
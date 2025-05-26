const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = 3000;

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "journal";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Главная страница
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// API для получения списка авторов
app.get("/api/authors", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const authors = await db.collection("Articles").distinct("authors");
    res.json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при получении авторов" });
  } finally {
    await client.close();
  }
});

// Список статей
app.get("/articles", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const articles = await db.collection("Articles").find().toArray();

    let html = `
      <h2>Список статей</h2>
      <ul>
    `;
    articles.forEach((article, index) => {
      html += `<li><b>${index + 1}. ${article.title}</b><br>
        Авторы: ${article.authors.join(", ")}<br>
        Дата: ${new Date(article.publishDate).toLocaleDateString()}
      </li><br>`;
    });

    html += "</ul><a href='/'>Назад</a>";
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка при получении статей");
  } finally {
    await client.close();
  }
});

// Поиск по названию
app.post("/searchByTitle", async (req, res) => {
  const searchText = req.body.title || "";
  try {
    await client.connect();
    const db = client.db(dbName);
    const articles = await db.collection("Articles").find({
      title: { $regex: searchText, $options: "i" }
    }).toArray();

    let html = `
      <h2>Результаты поиска по названию: "${searchText}"</h2>
      <ul>
    `;
    articles.forEach((article, index) => {
      html += `<li><b>${index + 1}. ${article.title}</b><br>
        Авторы: ${article.authors.join(", ")}<br>
        Дата: ${new Date(article.publishDate).toLocaleDateString()}
      </li><br>`;
    });

    html += "</ul><a href='/'>Назад</a>";
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка при поиске статей");
  } finally {
    await client.close();
  }
});

// Поиск по автору
app.post("/searchByAuthor", async (req, res) => {
  const authorName = req.body.author;
  if (!authorName) {
    return res.status(400).send("Не указан автор для поиска");
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const articles = await db.collection("Articles").find({
      authors: authorName
    }).toArray();

    let html = `
      <h2>Результаты поиска по автору: "${authorName}"</h2>
      <ul>
    `;
    
    if (articles.length === 0) {
      html += "<li>Статьи не найдены</li>";
    } else {
      articles.forEach((article, index) => {
        html += `<li><b>${index + 1}. ${article.title}</b><br>
          Авторы: ${article.authors.join(", ")}<br>
          Дата: ${new Date(article.publishDate).toLocaleDateString()}
        </li><br>`;
      });
    }

    html += "</ul><a href='/'>Назад</a>";
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка при поиске по автору");
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен: http://localhost:${port}`);
});

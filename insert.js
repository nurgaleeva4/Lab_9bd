const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "journal";

async function run() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Articles");

    await collection.deleteMany({});

    const tags = ["наука", "исследования", "технологии"];


    const articles = [
      {
        title: "Искусственный интеллект в медицине",
        authors: ["Иван Иванов", "Ольга Петрова"],
        publishDate: new Date("2023-11-01"),
        content: "Содержание статьи о применении ИИ в диагностике заболеваний...",
        tags,
        reviews: [
          { name: "Анна", text: "Отличная статья!", rating: 9 },
          { name: "Сергей", text: "Немного сложная терминология", rating: 7 }
        ]
      },
      {
        title: "Квантовые вычисления: будущее науки",
        authors: ["Алексей Смирнов"],
        publishDate: new Date("2023-12-15"),
        content: "Подробности о принципах квантовых вычислений...",
        tags,
        reviews: [
          { name: "Дмитрий", text: "Очень интересно!", rating: 10 }
        ]
      },
      {
        title: "Возобновляемая энергия и экология",
        authors: ["Ольга Петрова"],
        publishDate: new Date("2024-01-10"),
        content: "Влияние солнечной и ветровой энергии на окружающую среду...",
        tags,
        reviews: [
          { name: "Мария", text: "Полезная информация", rating: 8 },
          { name: "Павел", text: "Хотелось бы больше примеров", rating: 6 }
        ]
      },
      {
        title: "Биоинженерия: перспективы развития",
        authors: ["Николай Фёдоров", "Ирина Алексеева"],
        publishDate: new Date("2024-02-28"),
        content: "Обзор достижений в области биоинженерии...",
        tags,
        reviews: []
      },
      {
        title: "Робототехника в образовании",
        authors: ["Елена Кузнецова"],
        publishDate: new Date("2024-03-20"),
        content: "Как роботы помогают обучению детей и студентов...",
        tags,
        reviews: [
          { name: "Тимур", text: "Замечательная тема!", rating: 9 }
        ]
      }
    ];

    await collection.insertMany(articles);
    console.log("Статьи успешно добавлены!");
  } catch (err) {
    console.error("Ошибка:", err);
  } finally {
    await client.close();
  }
}

run();

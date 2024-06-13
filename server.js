import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const filePath = "entries.json";

// 데이터 불러오기
app.get("/api/entries", (req, res) => {
  if (fs.existsSync(filePath)) {
    const entries = JSON.parse(fs.readFileSync(filePath));
    res.json(entries);
  } else {
    res.json([]);
  }
});

// 데이터 저장
app.post("/api/entries", (req, res) => {
  const entries = req.body;
  fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

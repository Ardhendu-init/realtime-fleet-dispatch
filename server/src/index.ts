import express from "express";
import cors from "cors";
import http from "http";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hey There ");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

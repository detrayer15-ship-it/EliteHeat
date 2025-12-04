import express from "express";
const app = express();
app.use(express.json());

app.post("/api/submit", (req, res) => {
  res.json({ message: "OK", body: req.body });
});

app.listen(3000, () => console.log("Server running on port 3000"));

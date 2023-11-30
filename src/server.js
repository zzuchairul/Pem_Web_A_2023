const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  return res.json({
    status: "OK",
    message: "Selamat Datang di Banner-API!",
  });
});

// Read
app.get("/dairy", async (req, res) => {
  const data = await db("dairys");

  return res.json({
    status: "OK",
    message: "SUCCESS get all data",
    data: data,
  });
});

app.get("/dairy/params/:id", async (req, res) => {
  const params = req.params;

  const data = await db("dairys").where("id", "=", params.id).first();

  if (!data) {
    return res.status(404).json({
      status: "FAIL",
      message: "DATA NOT FOUND!",
    });
  }

  return res.json({
    status: "OK",
    message: "Success",
    data: data,
  });
});

app.get("/dairy/query", async (req, res) => {
  const query = req.query;

  const data = await db("dairys").where("judul", "LIKE", `%${query.judul}%`);

  return res.json({
    status: "OK",
    message: "Success",
    data: data,
  });
});

// Create
app.post("/dairy/add", async (req, res) => {
  const body = req.body;

  const dataInput = {
    judul: body.judul,
    text: body.text,
  };

  await db("dairys").insert(dataInput);

  return res.status(201).json({
    status: "OK",
    message: "SUCCESS add dairy",
  });
});

// Update
app.post("/dairy/update/:id", async (req, res) => {
  const params = req.params;
  const body = req.body;

  const data = await db("dairys").where("id", "=", params.id).first();

  if (!data) {
    return res.status(404).json({
      status: "FAIL",
      message: "Tidak Ada Data",
    });
  }

  await db("dairys").where("id", "=", params.id).update({
    judul: body.judul,
    text: body.text,
  });

  return res.json({
    status: "OK",
    message: "SUCCESS update dairy",
  });
});

// delete
app.post("/dairy/delete/:id", async (req, res) => {
  const params = req.params;
  await db("dairys").where("id", "=", params.id).delete();
  return res.json({
    status: "OK",
    message: "SUCCESS delete dairy",
  });
});

app.listen(3333, () => console.log("application run at http://localhost:3333"));

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

//Initiera Express
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//Anslut till MongoDB
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Ansluten till MongoDB");
  }).catch((error) => {
    console.log("Fel vid anslutning till databas: " + error);
  });

//ToDo Schema
const ToDoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Du måste ange en titel"],
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: [true, "Du måste ange en status"],
  },
});

//Skapa en modell
const Todolist = mongoose.model("Todolist", ToDoSchema);

//Routes
//Läs ut från databasen
app.get("/dt210g-todolist/todolist", async (req, res) => {
  try {
    //Hämta data från databasen och sortera den i fallande ordning efter id
    let result = await Todolist.find({}).sort({ _id: -1 });

    //Kontrollera om resultatet är tomt
    if (!result.length) {
      return res
        .status(200)
        .json([]);
    }

    //Om databasfrågan fungerar som den ska, returnera statuskod samt datan från servern
    return res.status(200).json(result);
  } catch (error) {
    console.error("Fel vid databasfråga: ", error); //Logga felmeddelande
    return res
      .status(500)
      .json({ error: "Internt serverfel. Kontrollera loggar." }); //Svar med statuskod och felmeddelande
  }
});

//Lägg till i databasen
app.post("/dt210g-todolist/todolist", async (req, res) => {

  //Skapa variabler med data från formuläret
  const title = (req.body.title || "").trim();
  const description = (req.body.description || "").trim();
  const status = (req.body.status || "").trim();

  let errors = []; //Variabel med tom array för att lagra ev felmeddelanden i

  if (!title) errors.push("Du måste ange en titel.");
  if (!status) errors.push("Du måste ange en status.");

  //Kontrollera om det finns några fel i listan
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    let result = await Todolist.create({ title, description, status });
    return res.status(201).json(result);
  } catch (error) {
    console.error("Fel vid skapande av todo:", error);
    return res.status(500).json({ error: "Kunde inte skapa todo." });
  }
});

//Uppdatera i databasen
app.put("/dt210g-todolist/todolist/:id", async (req, res) => {
  const todoid = req.params.id;
  const { title, description, status } = req.body;

  //Skapa ett tomt objekt för att lagra uppdateringar
  const updates = {};

  //Funktion för att lägga till uppdateringar om fälten inte är undefined
  function addUpdate(field, value) {
    if (value !== undefined && value.trim() !== "") {
      updates[field] = value.trim();
    }
  }

  //Kör funktionen med uppdateringar för varje fält
  addUpdate('title', title);
  addUpdate('description', description);
  addUpdate('status', status);

  //Om inga uppdateringar har gjorts, returnera ett fel
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Inga uppdateringar är gjorda." });
  }

  // Kontrollera att ID:t är ett giltigt MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(todoid)) {
    return res.status(400).json({ error: "Ogiltigt ID-format." });
  }

  try {
    //Försök att uppdatera i MongoDB
    const result = await Todolist.findByIdAndUpdate(todoid, updates, { new: true });

    //Om inget uppdaterades (angivet ID hittades inte)
    if (!result) {
      return res.status(404).json({ error: "Todo med angivet ID hittades inte." });
    }

    //Om uppdateringen fungerade, skicka 200-status och mer info om det uppdateringen
    res.status(200).json({
      message: "Todo uppdaterades.",
      updatedTodo: result
    });
  } catch (error) {
    //Logga och hantera eventuella fel vid databasanrop med 500-status och meddelande
    console.error("Fel vid uppdatering av todo: ", error);
    res.status(500).json({ error: "Internt serverfel. Kontrollera loggar." });
  }
});

//Ta bort en todo
app.delete("/dt210g-todolist/todolist/:id", async (req, res) => {
  const todoid = req.params.id;  //Hämta id

  //Kontrollera att ID:t är ett giltigt MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(todoid)) {
    return res.status(400).json({ error: "Ogiltigt ID-format." });
  }

  //Försök radera todon från databasen
  try {
    //Försök att hitta och radera todon från databasen
    const result = await Todolist.findByIdAndDelete(todoid);

    //Om inget hittades med angivet ID, skicka 404-status och meddelande
    if (!result) {
      return res.status(404).json({ error: "Todo med angivet ID hittades inte." });
    }

    //Raderingen lyckades, skicka bekräftelse
    res.status(200).json({ message: "Todo borttagen" });
  } catch (error) {
    //Logga och hantera eventuella fel vid databasfrågan med 500-status och meddelande
    console.error("Fel vid databasfråga: ", error);
    res.status(500).json({ error: "Internt serverfel. Kontrollera loggar." });
  }
});

app.listen(port, () => {
  console.log('Servern körs på port: ' + port);
});
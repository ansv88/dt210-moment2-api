# Webbtjänst (API) för att hantera en att göra lista
Det här repot innehåller kod för ett enklare REST API byggt med Express och MongoDB. API:t är skapat för att hantera en "att göra"-lista (todos). APIet är uppbyggt med CRUD (Create, Read, Update, Delete).

## Länk
En liveversion av APIet finns tillgänglig på följande URL:
[https://dt210g-moment2-api.onrender.com]

## Installation, databas
APIet använder en MongoDB-databas. Alla id:n för objekten automatgenereras av MongoDB.
Klona källkodsfilerna, kör kommando npm install för att installera nödvändiga npm-paket.

## Användning
Nedan finns beskrivet hur man når APIet med olika ändpunkter:

|Metod  |Ändpunkt                      |Beskrivning                                                       |
|-------|------------------------------|------------------------------------------------------------------|
|GET    |/dt210g-todolist/todolist     |Hämtar alla todos i fallande ordning på _id.                      |
|POST   |/dt210g-todolist/todolist     |Skapar en ny todo. Kräver ett JSON-objekt enligt strukturen nedan.|
|PUT    |/dt210g-todolist/todolist/:id |Uppdaterar en befintlig todo med angivet :id.                     |
|DELETE |/dt210g-todolist/todolist/:id |Raderar en todo med angivet ID.                                   |

Ett objekt returneras/skickas som JSON med följande struktur:
```
  {
    "_id":"67a924f8f12b2b0b28ddaa89",
    "title":"Plugga",
    "description":"Gör klart moment 2",
    "status":"Avklarad",
  }
```
const fs = require("fs");
const raw = JSON.parse(fs.readFileSync("./src/data/rawProtocolos.json", "utf8"));
raw.forEach(q => console.log(q.numero + " " + q.enunciado.substring(0,20) + "... => " + q.opciones.join(" | ")));

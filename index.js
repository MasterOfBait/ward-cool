require('dotenv').config();
const express = require("express");
const discordBot = require("./discordBot");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use("/", routes);

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

discordBot.start();

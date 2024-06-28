const express = require("express");
const { servers } = require("./discordBot");
const { httpGet } = require("./utils");
require('dotenv').config();

const router = express.Router();

router.post('/addserver', (request, response) => {
  servers[request.body.Index] = request.body.Data;
  response.json(`Server ${request.body.Data.Name} has been added.`);
});

router.get('/servers', (request, response) => {
  const formattedResponse = { servers };
  response.json(formattedResponse);
});

router.post('/updateserver', (request, response) => {
  servers[request.body.Index] = request.body.Data;
  response.json(`Server ${request.body.Data.Name} has been updated.`);
});

router.get('/externaldata', async (req, res) => {
  try {
    const serverResponse = await httpGet(`https://games.roblox.com/v1/games/${process.env.PLACE_ID}/servers/Public?sortOrder=Asc&limit=100`);
    const groupResponse = await httpGet(`https://groups.roblox.com/v1/groups/${process.env.GROUP_ID}`);
    const externalData = {
      group: groupResponse,
      servers: serverResponse,
      placeId: process.env.PLACE_ID,
      groupId: process.env.GROUP_ID
    };
    res.json(externalData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/removeserver', (request, response) => {
  servers[request.body.Index] = null;
  response.json(`Server ${request.body.Index} has been removed.`);
});

router.get('/', (request, response) => {
  response.send(':3');
});

module.exports = router;

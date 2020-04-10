var util = require("util");
var express = require("express");
var addon = express();

var respond = function (res, data) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
};

var MANIFEST = {
  id: "org.stremio.hdtm",
  version: "1.0.0",

  name: "HDTM",
  description: "HD Collection of Tamil Movies",

  //"icon": "URL to 256x256 monochrome png icon", 
  //"background": "URL to 1024x786 png/jpg background",

  types: ["movie"], // your add-on will be preferred for those content types

  // set what type of resources we will return
  resources: [
    "catalog",
    "stream"
  ],

  // set catalogs, we'll be making 2 catalogs in this case, 1 for movies and 1 for series
  catalogs: [
    { type: "movie", id: "Hello World" }
  ],

  // prefix of item IDs (ie: "tt0032138")
  idPrefixes: ["tt"]
};

var METAHUB_URL = 'https://images.metahub.space/poster/medium/%s/img';

var CATALOG = {
  movie: [
    { id: "tt2700001", name: "96", genres: ["Adventure", "Family", "Fantasy", "Musical"] },
    { id: "tt2700002", name: "Dharala Prabhu", genres: ["Drama", "Sci-Fi"] },
    { id: "tt2700003", name: "Kannum Kannum Kollaiyadithaal", genres: ["Horror", "Mystery"] }
],

var STREAMS = {
  "movie": {
    "tt2700001": [
      { title: "Torrent", infoHash: "143e60fe61717a8682ef86a1a8d211297fa3e25b" }
    ],
    "tt2700002": [
      { title: "Torrent", infoHash: "63b42f91075f5aee7303e75f1084e9221031ea31" }
    ],
    "tt2700003": [
      { title: "Torrent", infoHash: "dfe6f146be39ce1e3f615f53788ee3f0476ad838" }
    ],

  };


addon.param('type', function (req, res, next, val) {
  if (MANIFEST.types.includes(val)) {
    next();
  } else {
    next("Unsupported type " + val);
  }
});

addon.get('/manifest.json', function (req, res) {
  respond(res, MANIFEST);
});

addon.get('/catalog/:type/:id.json', function (req, res, next) {
  var metas = CATALOG[req.params.type].map(function (item) {
    return {
      id: item.id,
      type: req.params.type,
      name: item.name,
      genres: item.genres,
      poster: util.format(METAHUB_URL, item.id)
    };
  });

  respond(res, { metas: metas });
});

addon.get('/stream/:type/:id.json', function (req, res, next) {
  var streams = STREAMS[req.params.type][req.params.id] || [];

  respond(res, { streams: streams });
});

if (module.parent) {
  module.exports = addon;
} else {
  addon.listen(7000, function () {
    console.log('Add-on Repository URL: http://127.0.0.1:7000/manifest.json');
  });
}


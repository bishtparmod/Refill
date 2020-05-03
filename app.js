var express = require('express'),
  path = require('path'),
  app = express(),
  fs = require('fs');

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  var url = req.url
  console.log(url);
  if (url.indexOf('.chunk') !== -1) {
    url = `/static${url.split('/static')[1]}`
  }

  fs.lstat(path.join(__dirname, 'build', url), (err, stats) => {
    console.log("stats ===> ", stats);
    console.log("err ===> ", err);
    if (err) {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }
    if (stats) {
      res.sendFile(path.join(__dirname, 'build', url));
    }
  })
});


app.listen(3000);
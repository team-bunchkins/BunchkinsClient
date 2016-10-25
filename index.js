var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('src'));

app.get('/', (req, res) => {
    res.sendFile(getFullPath('index.html'));
});

var port = process.env.PORT || 4200;

app.listen(port, () => {
   console.log('App listening on port ' + port);
});

//////////////////

function getFullPath(name) {
    return path.join(__dirname + '/src/' + name);
}

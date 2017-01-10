'use strict';

const Hapi = require('hapi');
var mysql = require('mysql');
const Hoek = require('hoek');
const Path = require('path');

const server = new Hapi.Server();
server.connection( {port: 80} );

server.register(require('vision'), (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'views'
    });
});

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'xxxxx',
    password : 'xxxxx',
    database : 'xxxxx' 
});

connection.connect();
function indexHandler(request,reply) {

connection.query('SELECT title,text FROM posts', function(err, rows, fields) {
if (err) { 
    throw err;
}
 reply.view('index' , {post: rows} );
});
}

function addHandler(request,reply) {
var addPost = {title: 'TitleTest123', text: 'TextTest123'};
connection.query('INSERT INTO posts SET ?', addPost, function(err,result) {
if (err) {
    throw err;
}
    console.log(result);
});
} 

server.route({ method: 'GET', path: '/', handler: indexHandler});
server.route({ method: 'GET', path: '/add', handler: addHandler});
server.start((err)=> {
if (err) {
throw err;
}
console.log('Server running...');
});





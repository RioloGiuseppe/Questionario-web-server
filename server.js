var http = require("http")
var url = require("url");
var path = require("path");
var fs = require("fs");
var qs = require('querystring');
var config = require('./config');

function e500(response) {
   fs.readFile(process.cwd() + '/html/500.html', "binary", function(err, file) {
      if (err) {
         response.writeHead(500, {
            "Content-Type": "text/plain"
         });
         response.write(err + "\n");
         response.end();
         return;
      }
      response.writeHead(200, {
         "Content-Type": "text/html"
      });
      response.write(file, "binary");
      response.end();
   });
}

function e404(response) {
   fs.readFile(process.cwd() + '/html/404.html', "binary", function(err, file) {
      if (err) {
         e500(response);
         return;
      }
      //out file
      response.writeHead(200, {
         "Content-Type": "text/html"
      });
      response.write(file, "binary");
      response.end();
   });
}

function e403(response) {
   fs.readFile(process.cwd() + '/html/403.html', "binary", function(err, file) {
      if (err) {
         e500(response);
         return;
      }
      response.writeHead(200, {
         "Content-Type": "text/html"
      });
      response.write(file, "binary");
      response.end();
   });
}

function e200(response) {
   fs.readFile(process.cwd() + '/html/200.html', "binary", function(err, file) {
      if (err) {
         e500(response);
         return;
      }
      response.writeHead(200, {
         "Content-Type": "text/html"
      });
      response.write(file, "binary");
      response.end();
   });
}

function dbdl(response) {
   fs.readFile(process.cwd() + '/database.csv', "binary", function(err, file) {
      if (err) {
         e500(response);
         return;
      }
      response.writeHead(200, {
         "Content-Type": "application/octet-stream"
      });
      response.write(file, "binary");
      response.end();
   });
}

http.createServer(function(request, response) {
   var uri = url.parse(request.url).pathname;
   if ((uri.startsWith("/js") || uri.startsWith("/css")) && (uri.endsWith(".js") || uri.endsWith(".css"))) {
      var filename = path.join(process.cwd(), uri);
      fs.exists(filename, function(exists) {
         if (!exists) {
            e404(response);
            return;
         }
         fs.readFile(filename, "binary", function(err, file) {
            if (err) {
               e500(response);
               return;
            }
            response.writeHead(200);
            response.write(file, "binary");
            response.end();
         });
      });
   } else if (uri == "/") {
      if (request.method == "GET") {
         var filename = process.cwd() + '/html/quest.html';
         fs.readFile(filename, "binary", function(err, file) {
            if (err) {
               e500(response);
               return;
            }
            response.writeHead(200, {
               "Content-Type": "text/html"
            });
            response.write(file, "binary");
            response.end();
         });
      } else if (request.method == "POST") {
         var body = '';
         request.on('data', function(data) {
            body += data;
            if (body.length > 1e6)
               request.connection.destroy();
         });
         request.on('end', function() {
            var post = qs.parse(body);
            var csvLine = "";
            //fs.appendFile('database.json', JSON.stringify(post, null, "\t"),function(){});
            for (var key in post) {
               csvLine += post[key] + ",";
            }
            csvLine = csvLine.substring(0, csvLine.length - 1);
            fs.appendFile('database.csv', csvLine + '\n', function(err) {
               console.log(err);
            });
			e200(response);
         });
      } else {
         e404(response);
         return;
      }
   } else if (uri == "/dwn" && request.method == "GET") {
      var filename = process.cwd() + '/html/dwn.html';
      fs.readFile(filename, "binary", function(err, file) {
         if (err) {
            e500(response);
            return;
         }
         response.writeHead(200, {
            "Content-Type": "text/html"
         });
         response.write(file, "binary");
         response.end();
      });
   } else if (uri == "/dwn.csv" && request.method == "POST") {
      var body = '';
      request.on('data', function(data) {
         body += data;
         if (body.length > 1e6)
            request.connection.destroy();
      });
      request.on('end', function() {
         var post = qs.parse(body);
         if (post["code"] == config.password) {
            dbdl(response);
            return;
         } else {
            e403(response);
            return;
         }
      });
   } else {
      e404(response);
      return;
   }
}).listen(parseInt(config.port, 10));
console.log("Server running at http://localhost:" + config.port + "/");
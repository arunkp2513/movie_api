//Variable declarations at the start
const http = require('http'); //assinging an instance of http module to a variable
fs = require('fs');
url = require('url');
// createServer() function is in http module which is called on the http variable created
http.createServer((request,response)=>{
  let addr = request.url; // getting url from the request
  q = url.parse(addr,true); //
  filePath= ' '; // file path will be stored here
// Loggin the recent requests made to the server.
  fs.appendFile('log.txt', 'URL: ' + addr +'\nTimeStamp: ' + new Date() +'\n\n', (err) =>{
    if(err){
      console.log(err);
    } else{
      console.log('added to log');
    }
  });

  // piecing the file path together and placing in the empty Variable

  if(q.pathname.includes('documentation')){ //dot notaion is used to access the pathname of the url which is parsed and stored in q.
    filePath = (__dirname+'/documentation.html'); //__dirname is a module specific variable that provides the path of current directory.
  }else{
    filePath='index.html'; // if the user makes a request for url that does not exsist in the server, they will be directed to main page
  }
  fs.readFile(filePath,(err,data)=>{
    if(err){
      throw err;
    }
  response.writeHead(200,{'content-type' : 'text/html'});
  response.write(data);
  response.end();
});
}).listen(8080);
console.log('My first Node test server is running on Port 8080.');

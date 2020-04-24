const http = require('http');
const httpProxy = require('http-proxy');
const auth = require('basic-auth');

// Create a proxy server with custom application logic
const proxy = httpProxy.createProxyServer({changeOrigin: true, autoRewrite: true, hostRewrite: true, followRedirects: true});


const server = http.createServer(function(req, res) {

  // placeholder domain for testing
  const origin = "https://theverge.com";
  
  // dummy placeholders
  const password = "password";
  const username = "user";

  
  const credentials = auth(req);
  if (!credentials || !isAuthed(credentials, username, password)) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="example"');
    res.end('Access denied.');
  } else {
    // do nothing
    // res.end('Access granted')
  }


  proxy.on('proxyRes', function(proxyRes, req, res) {
    // console.log('Raw [target] response', JSON.stringify(proxyRes.headers, true, 2));
    
    proxyRes.headers['x-proxy'] = "now-padlock-proxy";
    
    // console.log('Updated [proxy] response', JSON.stringify(proxyRes.headers, true, 2));
    
  });
  proxy.web(req, res, { target: `${origin}` });
  
});

console.log("padlock proxy for ZEIT Now started on port 3000...");
server.listen(3000);




const isAuthed = function (credentials, username, password) {
    return credentials.name === username && credentials.pass === password;
}
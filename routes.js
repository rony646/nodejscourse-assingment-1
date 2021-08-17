const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if(url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>App</title></head>');
        res.write('<body><h1>Hello from Node.js Server!</h1><form method="POST" action="/create-user"><input type="text" name="username"/><button type="submit">SIGN-UP</button></form></body>');
        res.write('</html>');

        return res.end();
    };

    if(url === '/users') {

        const usersData = fs.readFileSync('users.txt', { encoding: 'utf8', flag: 'r' } );
        const users = usersData.split(',').map(userName => {
            return `<li>${userName}</li>`
        })

        res.write('<html>');
        res.write('<head><title>Users Page</title></head>');
        res.write(`<body><h2>Users List: </h2>${users.join('')}</ul></body>`)
        res.write('</html>');
        
        return res.end();
    };

    if(url === '/create-user' && method === 'POST') {
        const body = [];

        req.on('data', (chunk) => {
            console.log('CHUNCK: ', chunk);
            body.push(chunk);
        })

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const userName = parsedBody.split('=')[1];

            const usersData = fs.readFileSync('users.txt', { encoding: 'utf8', flage: 'r' });

            fs.writeFile('users.txt', `${usersData},${userName}`, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/users');
                return res.end();
            })           
        });

    };
};

module.exports = requestHandler;
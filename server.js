function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}
const express = require('express');
const app = express();
app.use(requireHTTPS);
app.use(express.static(`./dist/admin-dashboard`));

app.get('/', (req, res) => {
  res.sendFile(('index.html', {root: `./dist/admin-dashboard/`}))
});

app.get('/working', (req, res) => {
  console.log('this is it');
})

app.listen(8080);

console.log('app is working')

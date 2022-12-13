const v1 = require('./v1')
// const fs = require('fs')
const { PageController } = require('../controllers')

module.exports = (app => {

  // app.get('/styles/index.css', (req, res) => {
  //   res.writeHead(200, {'Content-Type': 'text/css'});
  //   res.write(fs.readSync('styles/index.css').toString())
  // })

  // pages
  app.get('/', PageController.index)
  
  app.get('/home', (req, res) => {
    res.render('index', { page: 'Forum Home' })
  })
  
  app.get('/signin', (req, res) => {
    res.render('signin', { page: 'Sign In Forum', nextPage: req.session ? req.session.nextPage : '/' })
  })

  app.get('/signup', (req, res) => {
    res.render('signup', { page: 'Sign Up Forum' })
  })

  app.get('/post/:id', PageController.postDetail)
  
  
  // api requests
  app.use('/api/v1', v1)
})
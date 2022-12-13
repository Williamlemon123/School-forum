const { Router } = require('express')
const { AuthValidator, PostValidator } = require('../validators')
const { AuthController, PostController, PageController } = require('../controllers')
const router = Router()

// accounts
router.post('/login', AuthValidator.postLogin, AuthController.login)
router.post('/signup', AuthValidator.postSignup, AuthController.signup)
router.post('/logout', AuthController.logout)

router.post('/post', PostValidator.postPost, PostController.posting)
router.get('/post', PostController.getPosts)
router.delete('/post/:id', PostController.deletePost)

router.post('/comment', PostValidator.postComment, PostController.postComment)

router.post('/like', PostValidator.postLike, PostController.postLike)
router.post('/dislike', PostValidator.postLike, PostController.postDislike)


router.all('*', (req, res) => res.status(404).json('Unknow Request'))

module.exports = router
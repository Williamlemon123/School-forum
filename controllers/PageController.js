const { User, Post, Comment } = require('../models')
const { encryptMD5, generateToken, decryptToken, getDate } = require('../utils')

const sortByHeat = (a, b) => {
  const heatOfA = a.comments.total * 3 + a.likes.total * 2 + a.views.total
  const heatOfB = b.comments.total * 3 + b.likes.total * 2 + b.views.total
  return heatOfB - heatOfA
}


class PageController {
  
  /**
   * index page
   * require login
   */
  async index (req, res, next) {
    try {
      if (!req.session) {
        res.redirect('/signin')
        return
      }

      const auth = decryptToken(req.session.token || '')

      if (!auth) {
        res.redirect('/signin')
        return
      }
      
      const posts = await Post.find({}).sort({ created_at: -1 })
      const results = []
      for (const p of posts) {
        const post = {
          ...p._doc,
          id: p._id,
          created_at: getDate(p.created_at),
          updated_at: getDate(p.updated_at),
          abstract: p.content.length > 100 ? p.content.slice(0, 120) + '...' : p.content,
          views: {
            total: p.views.length,
            viewed: p.views.find(id => id == auth.id),
          },
          likes: {
            total: p.likes.length,
            liked: p.likes.find(id => id == auth.id),
          },
          images: p.images.length > 3 ? p.images.slice(0, 4) : p.images,
        }
        const commentTotal = await Comment.countDocuments({ post_id: post.id })

        post.comments = {
          total: commentTotal
        }
        results.push(post)
      }
      const sort = req.query.sort
      if (sort !== 'time') {
        results.sort(sortByHeat)
      }
      res.render('index', { page: 'Pittsburgh Forum', user: auth, posts: results })

    } catch (error) {
      next(error)
    }
  }

  async postDetail (req, res, next) {
    try {
      const auth = decryptToken(req.session.token)
      if (!auth) {
        // res.status(403).json({
        //   code: 403,
        //   msg: 'Not Authorized',
        // })
        req.session.nextPage = `/post/${req.params.id}`
        res.redirect('/signin')
        return
      }
      const id = req.params.id
      if (!id) {
        res.status(400).json({
          msg: 'Invalid Post ID',
          code: 400,
        })
        return
      }
      const post = await Post.findById(id)
      if (!post) {
        res.redirect('/')
        return
      }
      // +1 viewed
      post.views = [...post._doc.views, auth.id]
      await post.save()

      const p = {
        ...post._doc,
        id: post.id,
        created_at: getDate(post.created_at),
        updated_at: getDate(post.updated_at),
        views: {
          total: post.views.length,
          viewed: post.views.includes(auth.id),
        },
        likes: {
          total: post.likes.length,
          liked: post.likes.includes(auth.id),
        },
        images: post.images,
      }

      const commentDocs = await Comment.find({ post_id: post.id })
      const commentTotal = commentDocs.length
      const comments = commentDocs.map(c => ({
          created_at: getDate(c.created_at),
          id: c._id,
          reply_comment_id: c.reply_comment_id,
          post_id: c.post_id,
          author: c.author,
          content: c.content,
      })).map((c, i, arr) => {
        c.subComments = arr.filter(a => a.reply_comment_id == c.id)
        return c
      }).filter(c => c.reply_comment_id === null)
      
      p.comments = comments
      res.render('post', { post: p, user: auth, commentTotal: commentTotal })
    } catch (error) {
      next(error)
    }
  }
  
  /**
   * Returns current node of comment.
   */
  formatComment (comments, current) {
    
  }
  
}

module.exports = new PageController()
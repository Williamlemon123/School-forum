const { User, Post, Comment } = require('../models')
const { encryptMD5, generateToken, decryptToken, getTS } = require('../utils')

class PostController {
  
  async posting (req, res, next) {
    if (!req.session.token) {
      res.status(403).json({
        code: 403,
        msg: 'Not Authorized',
      })
      return
    }
    const user = decryptToken(req.session.token)

    const { title, content, images } = req.body
    try {
      const post = await Post.create({
        title,
        content,
        created_at: getTS(),
        updated_at: getTS(),
        images, 
        author: user,
        likes: [],
        dislikes: [],
        views: [],
      })


      res.status(201).json({
        code: 201,
        msg: 'posted',
        data: post._id,
      })
    } catch (error) {
      next(error)
    }
  }

  async getPosts (req, res, next) {
    try {
      const posts = await Post.find({}).sort({ created_at: -1 })

      res.json({
        code: 200,
        msg: 'posts',
        data: posts,
      })
    } catch (error) {
      next(error)
    }
  }

  async deletePost (req, res, next) {
    try {
      const auth = decryptToken(req.session.token)
      if (!auth) {
        res.status(403).json({
          code: 403,
          msg: 'Not Authorized',
        })
        return
      }
      const id = req.params.id
      const post = await Post.findById(id)
      if (!id || !post) {
        res.status(400).json({
          msg: 'Invalid Post ID',
          code: 400,
        })
        return
      }

      if (auth.role !== 'admin' && post.author.id !== auth.id) {
        res.status(403).json({
          code: 403,
          msg: 'Not Authorized',
        })
        return
      }
      await Post.deleteOne({ _id: id })
      res.json({
        code: 200,
        msg: 'deleted',
      })
    } catch (e) {
      next(e)
    }
  }
  
  async postComment (req, res, next) {
    const auth = decryptToken(req.session.token)
    if (!auth) {
      res.status(403).json({
        code: 403,
        msg: 'Not Authorized',
      })
      return
    }
    try {
      const { content, postId, commentId } = req.body

      const post = await Post.findById(postId)
      if (!post) {
        res.status(400).json({
          code: 400,
          msg: 'No Post Found',
        })
        return
      }
      const commentData = {
        content,
        post_id: postId,
        author: auth,
        created_at: getTS(),
        destroyed: false,
      }
      if (commentId) {
        commentData.reply_comment_id = commentId
      }
      const newComment = await Comment.create(commentData)
      res.status(201).json({
        code: 201,
        msg: 'Comment Posted',
        data: newComment._id,
      })
    } catch (e) {
      next(e)
    }
  }
  
  async postLike (req, res, next) {
    const auth = decryptToken(req.session.token)
    if (!auth) {
      res.status(403).json({
        code: 403,
        msg: 'Not Authorized',
      })
      return
    }
    try {
      const { postId } = req.body

      const post = await Post.findById(postId)
      if (!post) {
        res.status(400).json({
          code: 400,
          msg: 'No Post Found',
        })
        return
      }
      if (!post.likes.includes(auth.id)) post.likes.push(auth.id)
      await post.save()
      res.status(201).json({
        code: 201,
        msg: 'Liked!',
      })
    } catch (e) {
      next(e)
    }
  }
  
  async postDislike (req, res, next) {
    const auth = decryptToken(req.session.token)
    if (!auth) {
      res.status(403).json({
        code: 403,
        msg: 'Not Authorized',
      })
      return
    }
    try {
      const { postId } = req.body

      const post = await Post.findById(postId)
      if (!post) {
        res.status(400).json({
          code: 400,
          msg: 'No Post Found',
        })
        return
      }
      post.likes = post.likes.filter(l => l != auth.id)
      await post.save()
      res.status(201).json({
        code: 201,
        msg: 'Liked!',
      })
    } catch (e) {
      next(e)
    }
  }
  
}

module.exports = new PostController()
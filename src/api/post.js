const express = require('express');
const { Post, UserPost ,User } = require('../db/models');

const router = express.Router();

/**
 * Create a new blog post
 * req.body is expected to contain {text: required(string), tags: optional(Array<string>)}
 */
router.post('/post', async (req, res, next) => {
  try {
    // Validation
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { text, tags } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ error: 'Must provide text for the new post' });
    }

    // Create new post
    const values = {
      text,
    };
    if (tags) {
      values.tags = tags.join(',');
    }
    const post = await Post.create(values);
    await UserPost.create({
      userId: req.user.id,
      postId: post.id,
    });

    res.json({ post });
  } catch (error) {
    next(error);
  }
});

// Get the posts based on the userId
router.route('/posts/:id').get( async(req,res) =>{
  try {
    // The param will be type caste to Integer

    const userId = await parseInt(req.params.id);

    // If the userId is not Integer then It will throw error
    if(!Number.isInteger(userId))
    {
      res.status(400).json({
        "Error Message" : "Id is Invalid"
      })
    }

    else
    {

      const findUser = await User.findOne({
        where : {
          id: userId
        }
      })


    //  If the user is found from the Users Table then it will check for the post
    if(findUser)
    {

    const getPosts = await Post.getPostsByUserId(userId);




    getPosts.forEach(post => {

        post.tags = post.tags.split(",");

    });

    // If the user has uploaded any post then we will get the final response 
    if(getPosts.length != 0)
    {
      res.status(200).json({"posts" : getPosts});
    }
    else
    {
      res.status(404).json({
        "Error Message" : "User has not uploaded any post yet !"
      })
    }


  }
  // If there is no such user with the particular id , then It will throw the Error
  else
  {
    res.status(404).json({
      "Error Message" : "No such User Exists"
    })
  }


  }

  } catch (error) {
    res.status(400).json(error);
  }
} );


module.exports = router;

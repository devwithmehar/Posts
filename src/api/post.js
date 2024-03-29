const express = require('express');
const res = require('express/lib/response');
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


/**
 *  Method : GET
 * Set the Error if someone did not give the parameter
*/
router.route("/posts").get(async(req,res) =>{
  try {
    res.status(400).json({
      "Error Message" : "Id is required"
    })

  } catch (error) {
    res.status(400).json(error);
  }
})



/**
 * Method : GET
 * Get the all the post uploaded by a particular user
 * here we use Id as the parameter for the userId
 */
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


/**
 * Method : PUT
 * Update the particular post
 * here we use Id as the parameter for the postId
 */
  router.route("/posts/:id").put( async (req, res) =>{
    try{
       const postId = parseInt(req.params.id);



      if(!Number.isInteger(postId))
      {
        res.status(400).json({
          "Error Message" : "Id is Invalid"
        })
      }
      else
      {
        const findPost = await Post.findOne({
          where : {
            id: postId
          }
        })

        // if the post is not found then it will throw error
        if(!findPost)
        {
          res.status(404).json({
            "Error Message" : "Post not found !"
          })
        }
        else
        {
          const {authorIds, text, tags} = await req.body;

          if(!text)
          {
            res.status(400).json({
              "Error Message" : "Text is Required!"
            })
          }
          else if(!authorIds)
          {
            res.status(400).json({
              "Error Message" : "Author Ids are Required!"
            })
          }
          else if (!Array.isArray(authorIds) )
          {
            res.status(400).json({
              "Error Message" : "Author Ids are invalid"
            })
          }
          else if(authorIds.length == 0)
          {
            res.status(400).json({
              "Error Message" : "Author Ids are invalid"
            })
          }
          else
          {

            for(const ids of authorIds)
            {
              //  console.log(ids);
               const findUserPost = await UserPost.findAll({where : { userId : ids }});


              // console.log(findUserPost);
              findUserPost.forEach(async (element) =>{
                console.log(element.dataValues);

                // tried the set and update method but it is not saving anything in the database
                // tried to update it in this way but still the data is not saved.
                element.dataValues.postId = await postId;

                // the data is not been save

                await element.save();

                console.log("New Data : ",element.dataValues);
              })

            }


            const values = {
              text,
            }
            if(tags)
            {
              values.tags = tags.join(",");
            }
            if(authorIds)
            {
              values.authorIds = authorIds.join(",");
            }

            findPost.text = values.text;
            findPost.tags = values.tags;
            findPost.authorIds = values.authorIds;



            // save the post in the database
            findPost.save().then(
              result => {

                result.tags = result.tags.split(",");
                result.authorIds = result.authorIds.split(",");
                return result;
              }
            ).then(finalResult =>{
              //  console.log(finalResult)

              // One the data is saved then we can sent response according to the need
              res.status(200).json({
                "id" : finalResult.id,
                "authorIds" : finalResult.authorIds,
                "createdAt" : finalResult.createdAt,
                "likes" : finalResult.likes,
                "popularity" : finalResult.popularity,
                "reads" : finalResult.reads,
                "tags" : finalResult.tags,
                "text" : finalResult.text,
                "updatedAt" : finalResult.updatedAt
              });
            })




          }


        }

      }

    }
    catch(error)
    {
      res.status(400).json(error);
    }
  })

 async function updateUserPost(userId, postIds)
  {
    try {

      console.log(userId)
      let findUserPost = await UserPost.findAll({
        where : {
          userId : userId
        }
      })

      if(!findUserPost)
      {
        console.log(`No user with userId ${userId} exists `);
      }
      else
      {
        // console.log(findUserPost[0]);
        await findUserPost.forEach(userPost =>{
          console.log(userPost.dataValues);
          userPost.dataValues.postId =  postIds;
          console.log(" new user post :",userPost.dataValues)
          userPost.update(
            {
              postId : postIds
            },
            {
              where: {
                userId : userId
              }
            }
          ).then(result =>{
            console.log(result.save());
          })




        });





      }

    } catch (error) {
      console.log(error);
    }
  }


module.exports = router;

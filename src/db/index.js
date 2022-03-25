const db = require('./db');

require('./models');

db.sync({force : true})
.then((result)=>{
  console.log(result);
})
.catch(error)
{
  console.log(error);
}

module.exports = db;

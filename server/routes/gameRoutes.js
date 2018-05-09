const router = require('express').Router();
const { createUser } = require('../../database/queries'); // TODO: make createGame query

router.post('/newGame', (req, res) => {
  console.log(`req.user: ${JSON.stringify(req.user)}`)
  res.send({
    userId: req.user.id,
    username: req.user.username
  });
});

module.exports = router;
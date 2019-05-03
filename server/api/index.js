const router = require('express').Router();
module.exports = router;

router.use('/uploads', require('./uploads'));

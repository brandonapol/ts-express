const express = require('express')
const router = express.Router()

const contactController = require('../controllers/contactController')

router.route('/').get(contactController.getContacts).post(contactController.setContact)
router.route('/:id').delete(contactController.deleteContact).put(updateContact)

module.exports = router


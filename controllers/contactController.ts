const asyncHandler = require('express-async-handler')

const Contact = require('../models/contactModel')
const User = require('../models/contactModel')

const getContacts = asyncHandler(async(req, res) => {
    const contacts = await Contact.find({ user: req.user.id })

    res.status(200).json(contacts)
})

const setContact = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please add text field')
    }

    const contact = Contact.create({
        text: req.body.text,
        user: req.user.id,
    })

    res.status(200).json(contact)
})

// @desc    Update contacts
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
        res.status(400)
        throw new Error('Contact not found')
    }

    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // ensure logged in user matches contact user
    if (contact.user.toString() != user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedContact = await contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedContact)
})

// @desc    Delete contacts
// @route   DELETE /api/goals/:id
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
        res.status(400)
        throw new Error('contact not found')
    }

    await contact.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getContacts,
    setContact,
    updateContact,
    deleteContact
}
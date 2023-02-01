// const asyncHandler = require('express-async-handler')
import asyncHandler from 'express-async-handler'
import { Request } from 'express'

// const Contact = require('../models/contactModel')
import Contact from '../models/contactModel'
// const User = require('../models/contactModel')
import User  from '../models/userModel'

interface IRequest extends Request {
    user: {
        id: any
    },
}

const getContacts = asyncHandler(async(req: IRequest, res:any) => {

    const userReq = req.user
    try {
        if (userReq.id !== undefined) {
            const contacts = await Contact.find({ user: userReq })
            res.status(200).json(contacts)
        }
    } catch {
        res.status(400)
        throw new Error('No user submitted')
    }
})

const setContact = asyncHandler(async (req:any, res:any) => {
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
const updateContact = asyncHandler(async (req:any, res:any) => {
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
    if (contact.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedContact)
})

// @desc    Delete contacts
// @route   DELETE /api/goals/:id
// @access  Private
const deleteContact = asyncHandler(async (req:any, res:any) => {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
        res.status(400)
        throw new Error('contact not found')
    }

    await contact.remove()

    res.status(200).json({ id: req.params.id })
})

const contactController = {
    getContacts,
    setContact,
    updateContact,
    deleteContact
}

export default contactController;
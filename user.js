const express = require('express')
const router = express.Router()
const connection = require('./mysql')
const bcrypt = require('bcrypt')

router.get('/users', (req, res) => {

    const sql = `
    SELECT userEmail,userFirstName,userLastName,userTel,dateOfBirth
    FROM user
    `

    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({message: err.message})
        }

        res.status(200).json(result)
    })
})


router.post('/users', async (req, res) => {

    const {
        userEmail,
        userPassword,
        userFirstName,
        userLastName,
        userTel,
        dateOfBirth
    } = req.body

    if (!userEmail || !userPassword) {
        return res.status(400).json({message: 'missing password'})
    }

    const checkSQL = "SELECT userEmail FROM user WHERE userEmail=?"

    connection.query(checkSQL, [userEmail], async (err, result) => {

        if (err) {
            return res.status(500).json({message: err.message})
        }

        if (result.length > 0) {
            return res.status(409).json({message: 'duplicate email'})
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(userPassword, salt)

        const insertSQL = `
        INSERT INTO user
        (userEmail,userPassword,userFirstName,userLastName,userTel,dateOfBirth)
        VALUES (?,?,?,?,?,?)
        `

        connection.query(
            insertSQL,
            [
                userEmail,
                hash,
                userFirstName || '',
                userLastName || '',
                userTel || '',
                dateOfBirth || null
            ],
            (err, result) => {

                if (err) {
                    console.log(err)
                    return res.status(500).json({message: err.message})
                }

                res.status(201).json({message: 'user created'})
            }
        )
    })
})

module.exports = router
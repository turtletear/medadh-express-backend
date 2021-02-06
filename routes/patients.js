const express = require('express');
const { route } = require('.');
const router = express.Router();

const {
    getAllPatients,
    createPatient,
    getPatientByUsername,
    getPatientById,
    updatePatientById,
    deletePatientById
} = require('../controllers/patients');

const {response_generator} = require('../middleware')

router.get('/', async (req, res) => {
    const data = await getAllPatients()
    const stat = data.status == "OK" ? 200 : 500
    return response_generator(stat, data, res)
})

router.get('/username/:username', async (req, res) => {
    let username = req.params.username
    const data = await getPatientByUsername(username)
    const stat = data.status == "OK" ? 200 : 500
    return response_generator(stat, data, res)
})

router.get('/:patientId', async (req, res) => {
    let patientId = req.params.patientId
    //console.log(id)
    const data = await getPatientById(patientId)
    const stat = data.status == "OK" ? 200 : 500
    return response_generator(stat, data, res)
})

router.post('/', async (req, res) => {
    const newData = req.body
    const data = await createPatient(newData)
    const stat = data.status == "OK" ? 200 : 500

    return response_generator(stat, data, res)
})

router.put('/:patientId', async (req, res) => {
    let updatedData = req.body
    let patientId = req.params.patientId

    const data = await updatePatientById(patientId, updatedData)
    const stat = data.status  == "OK" ? 200 : 500

    return response_generator(stat, data, res)
})

router.delete('/:patientId', async (req, res) => {
    let patientId = req.params.patientId

    const data = await deletePatientById(patientId)
    const stat = data.status == "OK" ? 200 : 500

    return response_generator(stat, data, res)
})
module.exports = router
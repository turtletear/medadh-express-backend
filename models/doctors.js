const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false)

const doctorSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    patients: [{
        type: Schema.Types.ObjectId,
        ref: 'Patients'
    }]
}, {
    timestamps: true
})

const Doctors = mongoose.model('Doctors', patientSchema)
module.exports = Doctors
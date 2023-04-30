import Patient from "../models/Patient.js";

const addPatient = async (req, res) => {
    const patient = new Patient(req.body);
    // Add to the db attribute the vet id
    patient.vet = req.vet._id;
    try {
        // Save the new patient
        const patientStored = await patient.save();
        res.json(patientStored);
        console.log(patientStored)
    } catch (error) {
        console.log(error)
    }
};

// Get veterinary patients by id 
const getPatients = async (req, res) => {
    const patients = await Patient.find().where('vet').equals(req.vet);
    res.json(patients);
};

// Get only a patient 
const getPatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id)

    if(!patient) {
        res.status(404).json({msg: "Not found"})
    }
    // Check if those ids are the same to find out if it is the patient's vet and display the patient's information
    // Verify the person that creates the patient is the correct to dispay patient's information
    if(patient.vet._id.toString() !== req.vet._id.toString()) {
        return res.json({msg: " Invalid action"});
    }
    
    // Display patient
    res.json(patient);
};

// Update a patient with new information
const updatePatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id)

    if(!patient) {
        res.status(404).json({msg: "Not found"})
    }
    // Check if those ids are the same to find out if it is the patient's vet and display the patient's information
    // Verify the person that creates the patient is the correct to dispay patient's information
    if(patient.vet._id.toString() !== req.vet._id.toString()) {
        return res.json({msg: " Invalid action"});
    }
    
    // Update patient, otherwise it keep the same value
    patient.name = req.body.name || patient.name;
    patient.owner = req.body.owner || patient.owner;
    patient.email = req.body.email || patient.email;
    patient.date = req.body.date || patient.date;
    patient.symptoms = req.body.symptoms || patient.symptoms;

    try {
        // Save the new data
        const patientUpdated = await patient.save();
        res.json(patientUpdated);
    } catch (error) {
        console.log(error)
    }
};

const deletePatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id)

    if(!patient) {
        res.status(404).json({msg: "Not found"})
    }
    // Check if those ids are the same to find out if it is the patient's vet and display the patient's information
    // Verify the person that creates the patient is the correct to dispay patient's information
    if(patient.vet._id.toString() !== req.vet._id.toString()) {
        return res.json({msg: " Invalid action"});
    }
    
    try {
        await patient.deleteOne();
        res.json({msg: 'The patient has been deleted'});
    } catch (error) {
        console.log(error);
    }
};

export { addPatient, getPatients, getPatient, updatePatient, deletePatient}
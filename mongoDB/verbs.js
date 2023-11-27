import mongoose from "mongoose";

const verbSchema = new mongoose.Schema({
    eng: String,
    rus: String,
    explanation_eng: String,
    explanation_rus: String,
    }
)

const Verb = mongoose.model('verbs_bies',verbSchema);
export default Verb;
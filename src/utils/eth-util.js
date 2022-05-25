import store from "../utils/store";

export const getPatientInfoForDoctor = async (patient_address, callback) => {
    let { web3, CovidRecord } = store.getState().global_vars;
    let res = await CovidRecord.getPatientInfoForDoctor.call(patient_address);
    callback(res);
} 
export const addDose = async (patient_address, patient_doseType, patient_doseDate, callback) => {
    let { web3, CovidRecord } = store.getState().global_vars;
    let res = await CovidRecord.addDose.call(patient_address, patient_doseType, patient_doseDate);
    callback(res);
} 


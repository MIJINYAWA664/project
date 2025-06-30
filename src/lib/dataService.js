// Simple data service using localStorage
const STORAGE_KEYS = {
  PATIENTS: 'cirs_patients',
  VACCINES: 'cirs_vaccines',
  VACCINATION_RECORDS: 'cirs_vaccination_records'
};

// Default data
const defaultPatients = [
  {
    id: 'patient-1',
    full_name: 'Emma Smith',
    date_of_birth: '2022-03-15',
    gender: 'female',
    parent_name: 'John Smith',
    phone: '+1-555-0101',
    email: 'john.smith@email.com',
    address: '123 Main Street, Anytown, ST 12345',
    emergency_contact: '+1-555-0102',
    medical_notes: 'No known allergies',
    parent_id: 'parent-1',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'patient-2',
    full_name: 'Liam Johnson',
    date_of_birth: '2021-08-22',
    gender: 'male',
    parent_name: 'Lisa Johnson',
    phone: '+1-555-0201',
    email: 'lisa.johnson@email.com',
    address: '456 Oak Avenue, Somewhere, ST 67890',
    emergency_contact: '+1-555-0202',
    medical_notes: 'Mild eczema',
    created_at: '2024-01-20T00:00:00Z'
  }
];

const defaultVaccines = [
  {
    id: 'vaccine-1',
    name: 'Hepatitis B',
    description: 'Protects against hepatitis B virus infection',
    recommended_age_months: 0,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'vaccine-2',
    name: 'DTaP (Diphtheria, Tetanus, Pertussis)',
    description: 'Protects against diphtheria, tetanus, and pertussis',
    recommended_age_months: 2,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'vaccine-3',
    name: 'MMR (Measles, Mumps, Rubella)',
    description: 'Protects against measles, mumps, and rubella',
    recommended_age_months: 12,
    created_at: '2024-01-01T00:00:00Z'
  }
];

const defaultVaccinationRecords = [
  {
    id: 'record-1',
    patient_id: 'patient-1',
    vaccine_id: 'vaccine-1',
    due_date: '2022-03-15',
    administered_date: '2022-03-16',
    administered_by: 'Dr. Sarah Johnson',
    notes: 'No adverse reactions',
    created_at: '2022-03-16T00:00:00Z'
  },
  {
    id: 'record-2',
    patient_id: 'patient-1',
    vaccine_id: 'vaccine-2',
    due_date: '2022-05-15',
    administered_date: null,
    administered_by: null,
    notes: null,
    created_at: '2022-05-15T00:00:00Z'
  }
];

// Initialize default data
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(defaultPatients));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VACCINES)) {
    localStorage.setItem(STORAGE_KEYS.VACCINES, JSON.stringify(defaultVaccines));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VACCINATION_RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.VACCINATION_RECORDS, JSON.stringify(defaultVaccinationRecords));
  }
};

initializeData();

export const dataService = {
  // Patients
  getPatients: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
  },

  getPatient: (id) => {
    const patients = dataService.getPatients();
    return patients.find(p => p.id === id);
  },

  createPatient: (patientData) => {
    const patients = dataService.getPatients();
    const newPatient = {
      ...patientData,
      id: `patient-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    patients.push(newPatient);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    return newPatient;
  },

  updatePatient: (id, patientData) => {
    const patients = dataService.getPatients();
    const index = patients.findIndex(p => p.id === id);
    if (index !== -1) {
      patients[index] = { ...patients[index], ...patientData };
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      return patients[index];
    }
    throw new Error('Patient not found');
  },

  // Vaccines
  getVaccines: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.VACCINES) || '[]');
  },

  // Vaccination Records
  getVaccinationRecords: () => {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.VACCINATION_RECORDS) || '[]');
    const patients = dataService.getPatients();
    const vaccines = dataService.getVaccines();
    
    return records.map(record => ({
      ...record,
      patients: patients.find(p => p.id === record.patient_id),
      vaccines: vaccines.find(v => v.id === record.vaccine_id)
    }));
  },

  getVaccinationRecord: (id) => {
    const records = dataService.getVaccinationRecords();
    return records.find(r => r.id === id);
  },

  createVaccinationRecord: (recordData) => {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.VACCINATION_RECORDS) || '[]');
    const newRecord = {
      ...recordData,
      id: `record-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEYS.VACCINATION_RECORDS, JSON.stringify(records));
    return newRecord;
  },

  updateVaccinationRecord: (id, recordData) => {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.VACCINATION_RECORDS) || '[]');
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...recordData };
      localStorage.setItem(STORAGE_KEYS.VACCINATION_RECORDS, JSON.stringify(records));
      return records[index];
    }
    throw new Error('Vaccination record not found');
  }
};
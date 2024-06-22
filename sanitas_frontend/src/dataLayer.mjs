import axios from "axios";
import { calculateYearsBetween } from "./utils/date";

const DEV_URL = "http://localhost:3000";
const BASE_URL = process.env.BACKEND_URL ?? DEV_URL;

/**
 * @template Res - The result value type
 * @template Err - The error value type
 * @typedef {{result: Res}|{error: Err}} Result
 */

/**
 * @callback SearchPatientApiFunction
 * @param {string} query - The query value to search.
 * @param {string} type - The type of query, one of "Nombres", "Carnet", "CodigoColaborador"
 * @returns {Promise<Result<import("./views/SearchPatientView").PatientPreview[], Error>>}
 */

/**
 * Talks to the API to search for patient given the query and type.
 * @type {SearchPatientApiFunction}
 */
export async function searchPatient(query, type) {
  try {
    let response;
    try {
      response = await axios.post(
        BASE_URL + "/patient/search",
        {
          requestSearch: query,
          searchType: type,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      throw new Error("API ERROR", { cause: error });
    }

    const result = response.data.map((r) => {
      if (!r.id) {
        throw new Error("Received patient has no `id`!");
      }

      if (!r.cui) {
        throw new Error("Received patient has no `cui`!");
      }

      if (!r.nombres) {
        throw new Error("Received patient has no `names`!");
      }

      if (!r.apellidos) {
        throw new Error("Received patient has no `apellidos`!");
      }

      if (!r.fecha_nacimiento) {
        throw new Error("Received patient has no `fecha_nacimiento`!");
      }

      return {
        id: r.id,
        cui: r.cui,
        names: `${r.nombres} ${r.apellidos}`,
        age: calculateYearsBetween(r.fecha_nacimiento),
      };
    });

    return { result };
  } catch (error) {
    return { error };
  }
}

/**
 * Asynchronously checks if a CUI (Unique Identity Code) exists in the system by making a GET request to the server.
 *
 * @param {string} cui - The CUI to be checked.
 * @returns {Promise<Object>} A promise that resolves to an object containing a boolean `exists` indicating if the CUI is found, and the `cui` itself.
 * @throws {Error} Throws an error if the request fails or if the server response is not OK.
 */
export const checkCui = async (cui) => {
  try {
    const response = await axios.get(`${BASE_URL}/check-cui/${cui}`);
    return { exists: response.data.exists, cui: cui };
  } catch (error) {
    throw new Error("Error fetching CUI:", error);
  }
};

/**
 * Submits patient data to the server using a POST request. This function is used to either register new patient data or update existing data.
 *
 * @param {Object} patientData - The patient data to be submitted, which includes fields like CUI, names, surnames, gender, and birth date.
 * @param {string} patientData.cui - The unique identifier for the patient.
 * @param {string} patientData.names - The first and middle names of the patient.
 * @param {string} patientData.surnames - The last names of the patient.
 * @param {string} patientData.sex - The sex of the patient, expected to be 'F' for female or 'M' for male based on a boolean condition.
 * @param {string} patientData.birthDate - The birth date of the patient.
 * @returns {Promise<number>} A promise that resolves to the response data from the server.
 * @throws {Error} Throws an error if the server responds with an error status or if any other error occurs during the request.
 */
export const submitPatientData = async (patientData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/patient`,
      {
        cui: patientData.cui,
        names: patientData.names,
        lastNames: patientData.surnames,
        isWoman: patientData.sex ? "F" : "M",
        birthdate: patientData.birthDate,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Error registering information");
    } else if (error.request) {
      throw new Error("No response was received");
    } else {
      throw new Error("Error setting up request");
    }
  }
};

/**
 * @typedef {Object} APIPatient
 * @property {number} id
 * @property {string} cui
 * @property {boolean} isWoman
 * @property {string|null} email
 * @property {string} names
 * @property {string} lastNames
 *
 * @property {string|null} contactName1
 * @property {string|null} contactKinship1
 * @property {string|null} contactPhone1
 *
 * @property {string|null} contactName1
 * @property {string|null} contactKinship1
 * @property {string|null} contactPhone1
 *
 * @property {string|null} bloodType
 * @property {string|null} address
 * @property {number | undefined} insuranceId
 * @property {string} birthdate
 * @property {string|null} phone
 */

/**
 * Calls the API to retrieve the general information of a given patient.
 *
 * @callback GetGeneralPatientInformationAPICall
 * @param {number} id - The Id of the patient.
 * @returns {Promise<Result<APIPatient, Error>>}
 */

/**
 * @type {GetGeneralPatientInformationAPICall}
 */

export const getGeneralPatientInformation = async (id) => {
  const url = `${BASE_URL}/patient/general/${id}`;

  try {
    const response = await axios.get(url);
    const r = response.data;

    if (!r.id) {
      throw new Error("Received patient has no `id`!");
    }

    if (!r.names) {
      throw new Error("Received patient has no `names`!");
    }

    if (!r.lastNames) {
      throw new Error("Received patient has no `lastNames`!");
    }

    if (r.isWoman === undefined) {
      throw new Error("Received patient has no `isWoman`!");
    }

    if (r.email === undefined) {
      throw new Error("Received patient has no `email`!");
    }

    if (r.contactName1 === undefined) {
      throw new Error("Received patient has no `contactName1`!");
    }

    if (r.contactKinship1 === undefined) {
      throw new Error("Received patient has no `contactKinship1`!");
    }

    if (r.contactPhone1 === undefined) {
      throw new Error("Received patient has no `contactPhone1`!");
    }

    if (r.contactName2 === undefined) {
      throw new Error("Received patient has no `contactName2`!");
    }

    if (r.contactKinship2 === undefined) {
      throw new Error("Received patient has no `contactKinship2`!");
    }

    if (r.contactPhone2 === undefined) {
      throw new Error("Received patient has no `contactPhone2`!");
    }

    if (r.bloodType === undefined) {
      throw new Error("Received patient has no `bloodType`!");
    }

    if (r.address === undefined) {
      throw new Error("Received patient has no `address`!");
    }

    if (r.insuranceId === undefined) {
      throw new Error("Received patient has no `insuranceId`!");
    }

    if (!r.birthdate) {
      throw new Error("Received patient has no `birthdate`!");
    }

    if (r.phone === undefined) {
      throw new Error("Received patient has no `phone`!");
    }
    return { result: r };
  } catch (error) {
    return { error };
  }
};

/**
 * Calls the API to update the general information of a given patient.
 *
 * @callback UpdateGeneralPatientInformationAPICall
 * @param {APIPatient} APIPatient - The data of the patient.
 * @returns {Promise<Result<boolean, Error>>}
 */

/**
 * @type {UpdateGeneralPatientInformationAPICall}
 */
export const updateGeneralPatientInformation = async (APIPatient) => {
  const url = `${BASE_URL}/patient/general`;
  try {
    const { data: result } = await axios.put(url, APIPatient);
    return { result };
  } catch (error) {
    return { error };
  }
};

/**
 * @typedef {Object} APIStudentInformation
 * @property {number} patientId
 * @property {string} career
 * @property {string} carnet
 */

/**
 * 	Callback for retrieving the student information of a patient.
 *
 * @callback GetStudentPatientInformationAPICall
 * @param {number} id - The ID of the patient.
 * @returns {Promise<Result<APIStudentInformation, Error>>}
 */

/**
 * @type {GetStudentPatientInformationAPICall}
 */
export const getStudentPatientInformation = async (id) => {
  const url = `${BASE_URL}/patient/student/${id}`;
  try {
    const { data: result } = await axios.get(url);
    return { result };
  } catch (error) {
    return { error };
  }
};

/**
 * 	Callback for updating the student information of a patient.
 *
 * @callback UpdateStudentPatientInformationAPICall
 * @param {APIStudentInformation} APIStudentInfo
 * @returns {Promise<Result<APIStudentInformation, Error>>}
 */

/**
 * @type {UpdateStudentPatientInformationAPICall}
 */
export const updateStudentPatientInformation = async (APIStudentInfo) => {
  const url = `${BASE_URL}/patient/student`;
  try {
    const { data: result } = await axios.put(url, APIStudentInfo);
    return { result };
  } catch (error) {
    return { error };
  }
};

/**
 * Fetches the surgical history for a specific patient by their ID.
 * Handles potential errors and formats the response.
 *
 * @param {string} id - The patient's ID.
 * @returns {Promise<Object>} An object containing either the surgical history data or an error.
 */
export const getSurgicalHistory = async (id) => {
  const url = `${BASE_URL}/patient/surgical-history/${id}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return { result: response.data };
    } else {
      return { error: `Received unexpected status code: ${response.status}` };
    }
  } catch (error) {
    if (error.response) {
      return {
        error: `Failed to fetch data: ${error.response.status} ${error.response.statusText}`,
      };
    } else if (error.request) {
      return { error: "No response received" };
    } else {
      return { error: error.message };
    }
  }
};

/**
 * Updates the surgical history of a patient by sending a PUT request to a specific endpoint.
 * This function constructs a payload from the surgical events provided and sends it to the server.
 *
 * @param {string} patientId - The unique identifier for the patient.
 * @param {Array<Object>} surgicalEvents - An array of objects where each object contains details about a surgical event.
 * @returns {Promise<Object>} - The response data from the server as a promise. If an error occurs during the request,
 * it returns the error message or the error response from the server.
 */
export const updateSurgicalHistory = async (patientId, surgicalEvents) => {
  const url = `${BASE_URL}/patient/surgical-history`;

  const payload = {
    id: patientId,
    hasSurgicalEvent: surgicalEvents.length > 0,
    surgicalEventData: surgicalEvents.map((event) => ({
      surgeryType: event.surgeryType,
      surgeryYear: event.surgeryYear,
      complications: event.complications,
    })),
  };

  try {
    const response = await axios.put(url, payload);
    return { result: response.data };
  } catch (error) {
    if (error.response) {
      return { error: error.response.data };
    } else if (error.request) {
      return { error: "No response received" };
    } else {
      return { error: error.message };
    }
  }
};

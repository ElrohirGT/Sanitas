/**
 * @typedef {Object} PatientPreview
 * @property {string} id
 * @property {string} names
 */

import { useState } from "react";

/**
 * @typedef {Object} SearchPatientViewProps
 * @property {import("src/dataLayer").SearchPatientApiFunction} searchPatientsApiCall
 * @property {import("src/store").UseStoreHook} useStore
 */

/**
 * @param {SearchPatientViewProps} props
 */
export default function SearchPatientView({ searchPatientsApiCall, useStore }) {
  const { query, type } = useStore((store) => store.searchQuery);
  const setSearchQuery = useStore((store) => store.setSearchQuery);
  const [patients, setPatients] = useStore((store) => [store.patients, store.setPatients]);
  const [error, setError] = useState("");

  const showErrorMessage = (message) => setError(`ERROR: ${message}`);
  const hideErrorMessage = () => setError("");

  const emptyQuery = query.trim().length <= 0;

  const searchBtnClick = async () => {
    hideErrorMessage();
    if (emptyQuery) {
      showErrorMessage("Por favor ingrese algo para buscar!");
      return;
    }

    const result = await searchPatientsApiCall(query, type);
    if (result.error) {
      const { error } = result;
      if (error.cause) {
        const { response } = error.cause;
        if (response?.status < 500) {
          showErrorMessage("Búsqueda incorrecta, por favor ingresa todos los parámetros!");
        } else {
          showErrorMessage("Ha ocurrido un error interno, lo sentimos.");
        }
      } else {
        showErrorMessage("The API has changed!");
      }
      return;
    }

    const { result: apiPatients } = result;
    setPatients(apiPatients);
  };

  /**
   * @param {number} id - The ID of the selected patient.
   */
  const genViewBtnClick = (id) => {
    // TODO: Navigate to edit page view
  };

  return (
    <div>
      <div>
        <h1>Sanitas</h1>
      </div>
      <div>
        {
          // NOTE: The default value is defined in the store.
        }
        <select value={type} onChange={(e) => setSearchQuery(query, e.target.value)}>
          <option value="Carnet">Carnet Estudiante</option>
          <option value="CodigoColaborador">Código Colaborador</option>
          <option value="Nombres">Nombres y Apellidos</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setSearchQuery(e.target.value, type)}
          placeholder="Ingrese su búsqueda..."
        />
        <button type="button" onClick={searchBtnClick} disabled={emptyQuery}>
          Buscar
        </button>
      </div>
      <p style={{ color: "red" }}>{error}</p>
      <div>
        {...patients.map((p) => (
          <div key={p.id}>
            <p>{p.names}</p>
            <button type="button" onClick={genViewBtnClick(p.id)}>
              Ver
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

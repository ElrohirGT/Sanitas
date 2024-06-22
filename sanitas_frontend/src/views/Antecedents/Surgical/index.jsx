import React, { useEffect, useState } from "react";
import AppointmentSurgeryCard from "src/components/AppointmentSurgeryCard";
import BaseButton from "src/components/Button/Base/index";
import DashboardSidebar from "src/components/DashboardSidebar";
import DropdownMenu from "src/components/DropdownMenu";
import { BaseInput } from "src/components/Input/index";
import { colors, fonts, fontSize } from "src/theme.mjs";

/**
 * @typedef {Object} SurgicalHistoryProps
 * @property {Function} getBirthdayPatientInfo - Function to fetch the patient's birthdate.
 * @property {Function} getSurgicalHistory - Function to fetch the surgical history of a patient.
 * @property {Function} updateSurgicalHistory - Function to update or add new surgical records for a patient.
 * @property {Object} sidebarConfig - Configuration for the sidebar component, detailing any necessary props.
 * @property {Function} useStore - Custom React hook to access state management, specifically to retrieve the patient's ID.
 *
 * A component to manage and displays a patient's surgical history, allowing users to add and view records.
 *
 * @param {SurgicalHistoryProps} props - The props passed to the SurgicalHistory component.
 * @returns {JSX.Element} - The rendered component with dynamic content based on the fetched data and user interactions.
 */

export function SurgicalHistory({
  getBirthdayPatientInfo,
  getSurgicalHistory,
  updateSurgicalHistory,
  sidebarConfig,
  useStore,
}) {
  const id = useStore((s) => s.selectedPatientId);
  const [surgicalHistory, setSurgicalHistory] = useState([]);
  const [selectedSurgery, setSelectedSurgery] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the patient's birth year to set the default year for new surgeries
  const [birthYear, setBirthYear] = useState(new Date().getFullYear());

  // Fetch the patient's birth year to set the default year for new surgeries
  useEffect(() => {
    const fetchBirthday = async () => {
      try {
        const result = await getBirthdayPatientInfo(id);
        if (result && !result.error && result.result && result.result.birthdate) {
          const birthday = new Date(result.result.birthdate);
          setBirthYear(birthday.getFullYear());
          setError(null);
        } else {
          throw new Error(
            result?.error || "¡Ha ocurrido un error al obtener la fecha de nacimiento!",
          );
        }
      } catch (error) {
        setError(error.message);
      }
    };

    if (id) {
      fetchBirthday();
    }
  }, [id, getBirthdayPatientInfo]);

  // Generate a list of years from the patient's birth year to the current year
  const currentYear = new Date().getFullYear();
  const yearOptions = [];

  for (let year = birthYear; year <= currentYear; year++) {
    yearOptions.push({ value: year, label: year.toString() });
  }

  // Fetch the surgical history data for the selected patient
  useEffect(() => {
    const fetchSurgicalHistory = async () => {
      const result = await getSurgicalHistory(id);
      if (!result.error && result.result && result.result.surgicalEventData) {
        setSurgicalHistory(result.result.surgicalEventData);
      } else if (result.error) {
        if (result.error.status === 404) {
          setSurgicalHistory([]);
        } else {
          setError(
            result.error.message
              || "¡Ha ocurrido un error al obtener los antecedentes quirúrjicos!",
          );
        }
      } else {
        setSurgicalHistory([]);
      }
    };

    if (id) {
      fetchSurgicalHistory();
    }
  }, [id, getSurgicalHistory]);

  // Event handlers for adding, editing, and saving surgical history records
  const handleOpenNewForm = () => {
    setSelectedSurgery({ surgeryType: "", surgeryYear: currentYear.toString(), complications: "" });
    setAddingNew(true);
  };

  // Save the new surgery record to the database
  const handleSaveNewSurgery = async () => {
    if (
      !selectedSurgery.surgeryType
      || !selectedSurgery.surgeryYear
      || selectedSurgery.complications === undefined
    ) {
      setError("Por favor, complete todos los campos antes de guardar el registro quirúrjico");
      return;
    }

    const updatedSurgicalHistory = [...surgicalHistory, selectedSurgery];
    const response = await updateSurgicalHistory(id, updatedSurgicalHistory);

    if (!response.error) {
      setSurgicalHistory(updatedSurgicalHistory);
      setAddingNew(false);
      setSelectedSurgery(null);
      setError(null);
    } else {
      setError(`Ha ocurrido un error al guardar el antecedente quirúrjico: ${response.error}`);
    }
  };

  // Select a surgery record to view
  const handleSelectSurgery = (surgery) => {
    setSelectedSurgery({
      surgeryType: surgery.surgeryType,
      surgeryYear: surgery.surgeryYear,
      complications: surgery.complications,
    });
    setAddingNew(false);
  };

  const handleCancel = () => {
    setSelectedSurgery(null);
    setAddingNew(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: colors.primaryBackground,
        height: "100vh",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "25%",
        }}
      >
        <DashboardSidebar {...sidebarConfig} />
      </div>

      <div
        style={{
          paddingLeft: "2rem",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: colors.secondaryBackground,
            padding: "3.125rem",
            height: "100%",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                color: colors.titleText,
                fontFamily: fonts.titleFont,
                fontSize: fontSize.titleSize,
              }}
            >
              Antecedentes Quirúrjicos
            </h1>
            <h3
              style={{
                fontFamily: fonts.textFont,
                fontWeight: "normal",
                fontSize: fontSize.subtitleSize,
                paddingTop: "0.5rem",
                paddingBottom: "3rem",
              }}
            >
              Registro de antecedentes quirúrjicos
            </h3>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-align",
              alignItems: "space-between",
              width: "100%",
              gap: "2rem",
            }}
          >
            <div
              style={{
                border: `1px solid ${colors.primaryBackground}`,
                borderRadius: "10px",
                padding: "1rem",
                height: "65vh",
                flex: 1,
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  paddingBottom: "0.5rem",
                }}
              >
                <BaseButton
                  text="Agregar antecedente quirúrgico"
                  onClick={handleOpenNewForm}
                  style={{ width: "100%", height: "3rem" }}
                />
                {error && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: fontSize.textSize,
                      color: colors.statusDenied,
                      paddingBottom: "1rem",
                      paddingTop: "2rem",
                    }}
                  >
                    {error}
                  </div>
                )}
              </div>

              {surgicalHistory.length > 0
                ? (
                  surgicalHistory.map((surgery, index) => (
                    <AppointmentSurgeryCard
                      key={index}
                      type="surgical"
                      year={surgery.surgeryYear}
                      surgeryType={surgery.surgeryType}
                      onClick={() => handleSelectSurgery(surgery)}
                    />
                  ))
                )
                : (
                  <p style={{ textAlign: "center", paddingTop: "20px" }}>
                    No se ha encontrado antecedentes quirúrgicos para el paciente.
                  </p>
                )}
            </div>

            {addingNew || selectedSurgery
              ? (
                <div
                  style={{
                    border: `1px solid ${colors.primaryBackground}`,
                    borderRadius: "10px",
                    padding: "1rem",
                    height: "65vh",
                    flex: 1.8,
                    overflowY: "auto",
                    width: "100%",
                  }}
                >
                  <p
                    style={{
                      paddingBottom: "0.5rem",
                      paddingTop: "2rem",
                      fontFamily: fonts.textFont,
                      fontSize: fontSize.textSize,
                    }}
                  >
                    ¿De qué?
                  </p>
                  <BaseInput
                    value={selectedSurgery ? selectedSurgery.surgeryType : ""}
                    onChange={(e) => setSelectedSurgery({ ...selectedSurgery, surgeryType: e.target.value })}
                    readOnly={!addingNew}
                    placeholder="Ingrese acá el motivo o tipo de cirugía."
                    style={{
                      width: "95%",
                      height: "10%",
                      fontFamily: fonts.textFont,
                      fontSize: "1rem",
                    }}
                  />

                  <p
                    style={{
                      paddingBottom: "0.5rem",
                      paddingTop: "2rem",
                      fontFamily: fonts.textFont,
                      fontSize: fontSize.textSize,
                    }}
                  >
                    ¿En qué año?
                  </p>
                  <DropdownMenu
                    options={yearOptions}
                    value={selectedSurgery.surgeryYear}
                    readOnly={!addingNew}
                    onChange={(e) =>
                      setSelectedSurgery({
                        ...selectedSurgery,
                        surgeryYear: e.target.value,
                      })}
                  />

                  <p
                    style={{
                      paddingBottom: "0.5rem",
                      paddingTop: "2rem",
                      fontFamily: fonts.textFont,
                      fontSize: fontSize.textSize,
                    }}
                  >
                    ¿Tuvo alguna complicación?
                  </p>
                  <BaseInput
                    value={selectedSurgery.complications || ""}
                    onChange={(e) => setSelectedSurgery({ ...selectedSurgery, complications: e.target.value })}
                    readOnly={!addingNew}
                    placeholder="Ingrese complicaciones que pudo haber tenido durante o después de la cirugía."
                    style={{
                      width: "95%",
                      height: "15%",
                      fontFamily: fonts.textFont,
                      fontSize: "1rem",
                    }}
                  />

                  <div
                    style={{
                      paddingTop: "5rem",
                      display: "flex",
                      justifyContent: "center",
                      gap: "2rem",
                    }}
                  >
                    {addingNew && (
                      <>
                        <BaseButton
                          text="Guardar"
                          onClick={handleSaveNewSurgery}
                          style={{ width: "30%", height: "3rem" }}
                        />
                        <BaseButton
                          text="Cancelar"
                          onClick={handleCancel}
                          style={{
                            width: "30%",
                            height: "3rem",
                            backgroundColor: "#fff",
                            color: colors.primaryBackground,
                            border: `1.5px solid ${colors.primaryBackground}`,
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              )
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

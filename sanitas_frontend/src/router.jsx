import { Outlet } from "react-router-dom";
import {
  checkCui,
  getGeneralPatientInformation,
  getStudentPatientInformation,
  getSurgicalHistory,
  searchPatient,
  submitPatientData,
  updateGeneralPatientInformation,
  updateStudentPatientInformation,
  updateSurgicalHistory,
} from "./dataLayer.mjs";
import { createEmptyStore } from "./store.mjs";
import { AddPatientView } from "./views/AddPatientView";
import { SurgicalHistory } from "./views/Antecedents/Surgical";
import SearchPatientView from "./views/SearchPatientView";
import UpdateInfoView from "./views/UpdateGeneralInformationView";

const useStore = createEmptyStore();

export const NAV_PATHS = {
  SEARCH_PATIENT: "/",
  ADD_PATIENT: "/new",
  UPDATE_PATIENT: "/update",
};

export const UPDATE_PATIENT_NAV_PATHS = {
  GENERAL_INFORMATION: "general",
  SURGICAL_HISTORY: "surgical",
  // TODO: Add other Navigation routes...
};

/**@type {import("./components/DashboardSidebar").DashboardSidebarProps} */
export const DEFAULT_DASHBOARD_SIDEBAR_PROPS = {
  userInformation: {
    displayName: "Pedrito Pérez",
    title: "Test username",
  },
  onGoBack: (navigate) => {
    navigate(NAV_PATHS.SEARCH_PATIENT);
  },
  navigateToGeneral: (navigate) => {
    navigate(`${NAV_PATHS.UPDATE_PATIENT}/${UPDATE_PATIENT_NAV_PATHS.GENERAL_INFORMATION}`);
  },
  navigateToSurgical: (navigate) => {
    navigate(`${NAV_PATHS.UPDATE_PATIENT}/${UPDATE_PATIENT_NAV_PATHS.SURGICAL_HISTORY}`);
  },
  // TODO: Add other Navigation routes...
};

const updateInfoView = (
  <UpdateInfoView
    getGeneralPatientInformation={getGeneralPatientInformation}
    updateGeneralPatientInformation={updateGeneralPatientInformation}
    getStudentPatientInformation={getStudentPatientInformation}
    updateStudentPatientInformation={updateStudentPatientInformation}
    sidebarConfig={DEFAULT_DASHBOARD_SIDEBAR_PROPS}
    useStore={useStore}
  />
);

const surgicalHistoryView = (
  <SurgicalHistory
    getBirthdayPatientInfo={getGeneralPatientInformation}
    getSurgicalHistory={getSurgicalHistory}
    updateSurgicalHistory={updateSurgicalHistory}
    sidebarConfig={DEFAULT_DASHBOARD_SIDEBAR_PROPS}
    useStore={useStore}
  />
);

export const ROUTES = [
  {
    path: NAV_PATHS.SEARCH_PATIENT,
    element: <SearchPatientView searchPatientsApiCall={searchPatient} useStore={useStore} />,
  },
  {
    path: NAV_PATHS.ADD_PATIENT,
    element: (
      <AddPatientView
        checkCui={checkCui}
        submitPatientData={submitPatientData}
        useStore={useStore}
      />
    ),
  },
  {
    path: NAV_PATHS.UPDATE_PATIENT,
    element: <Outlet />,
    children: [
      {
        index: true,
        element: updateInfoView,
      },
      {
        path: UPDATE_PATIENT_NAV_PATHS.GENERAL_INFORMATION,
        element: updateInfoView,
      },
      {
        path: UPDATE_PATIENT_NAV_PATHS.SURGICAL_HISTORY,
        element: surgicalHistoryView,
      },
      // TODO: Add more routes...
    ],
  },
];

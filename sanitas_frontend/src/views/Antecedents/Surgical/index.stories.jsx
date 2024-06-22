import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { createEmptyStore } from "src/store.mjs";
import { SurgicalHistory } from ".";

export default {
  component: SurgicalHistory,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/surgical-history"]}>
        <Routes>
          <Route path="/surgical-history" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  title: "Views/SurgicalHistory",
};

const dummyPatientId = 12345;

const mockGetBirthdayPatientInfo = async (id) => {
  if (id === dummyPatientId) {
    return { result: { birthdate: "2000-02-11" } };
  }
  return { error: "Patient not found" };
};

const mockGetSurgicalHistory = async (id) => {
  if (id === dummyPatientId) {
    return {
      result: {
        surgicalEventData: [
          { surgeryType: "Appendectomy", surgeryYear: "2019", complications: "None" },
        ],
      },
    };
  }
  return { error: "Patient not found" };
};

const mockUpdateSurgicalHistory = async (id, history) => {
  if (id === dummyPatientId) {
    return { result: "Updated successfully" };
  }
  return { error: "Failed to update surgical history" };
};

const store = createEmptyStore({
  selectedPatientId: dummyPatientId,
});

export const Default = {
  args: {
    getBirthdayPatientInfo: mockGetBirthdayPatientInfo,
    getSurgicalHistory: mockGetSurgicalHistory,
    updateSurgicalHistory: mockUpdateSurgicalHistory,
    sidebarConfig: {
      userInformation: {
        displayName: "Dr. John Smith",
        title: "Cirujano",
      },
    },
    useStore: () => ({ selectedPatientId: store.selectedPatientId }),
  },
};

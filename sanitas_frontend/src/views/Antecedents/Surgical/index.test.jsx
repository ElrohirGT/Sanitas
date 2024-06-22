import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SurgicalHistory } from ".";

const mockGetSurgicalHistory = vi.fn();
const mockUpdateSurgicalHistory = vi.fn();
const mockUseStore = vi.fn();
const sidebarConfig = {
  userInformation: {
    displayName: "Jennifer Bustamante",
    title: "Doctora UVG",
  },
};
const mockGetBirthdayPatientInfo = vi.fn();

const exampleUserInformation = {
  displayName: "Jennifer Bustamante",
  title: "Doctora UVG",
};

const setup = (surgicalHistoryData = []) => {
  mockGetSurgicalHistory.mockResolvedValue({ result: { surgicalEventData: surgicalHistoryData } });
  mockUseStore.mockImplementation(() => ({ selectedPatientId: "1" }));
  mockGetBirthdayPatientInfo.mockResolvedValue({
    result: { birthdate: "1980-05-20" },
  });

  render(
    <MemoryRouter>
      <SurgicalHistory
        getBirthdayPatientInfo={mockGetBirthdayPatientInfo}
        getSurgicalHistory={mockGetSurgicalHistory}
        updateSurgicalHistory={mockUpdateSurgicalHistory}
        sidebarConfig={{ userInformation: exampleUserInformation }}
        useStore={mockUseStore}
      />
    </MemoryRouter>,
  );
};

describe("SurgicalHistory", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("displays multiple surgical histories when provided", async () => {
    const surgicalData = [
      { surgeryType: "Appendectomy", surgeryYear: "2019", complications: "None" },
      { surgeryType: "Gallbladder Removal", surgeryYear: "2021", complications: "Minor infection" },
    ];
    setup(surgicalData);

    await waitFor(() => {
      expect(screen.getByText("Appendectomy")).toBeInTheDocument();
      expect(screen.getByText("2019")).toBeInTheDocument();
      expect(screen.getByText("Gallbladder Removal")).toBeInTheDocument();
      expect(screen.getByText("2021")).toBeInTheDocument();
    });
  });

  it("allows user to add a new surgical record", async () => {
    setup();
    fireEvent.click(screen.getByText(/agregar antecedente quirúrgico/i));

    expect(screen.getByPlaceholderText(/ingrese acá el motivo o tipo de cirugía/i)).toBeVisible();
    expect(screen.getByRole("combobox")).toBeVisible();
    expect(
      screen.getByPlaceholderText(
        /ingrese complicaciones que pudo haber tenido durante o después de la cirugía/i,
      ),
    ).toBeVisible();
  });

  it("resets the input fields and closes the form when cancel is clicked", async () => {
    setup();

    fireEvent.click(screen.getByText(/Agregar antecedente quirúrgico/i));
    fireEvent.change(screen.getByPlaceholderText(/Ingrese acá el motivo o tipo de cirugía/i), {
      target: { value: "Test Surgery" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "2020" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(
        /Ingrese complicaciones que pudo haber tenido durante o después de la cirugía/i,
      ),
      {
        target: { value: "None" },
      },
    );

    fireEvent.click(screen.getByText("Cancelar"));

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText(/Ingrese acá el motivo o tipo de cirugía/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByPlaceholderText(
          /Ingrese complicaciones que pudo haber tenido durante o después de la cirugía/i,
        ),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });
  });
});

import { beforeAll, describe, expect, test } from "@jest/globals";
import axios from "axios";
import { createTestPatientWithSurgery, LOCAL_API_URL } from "../testHelpers.mjs";

const API_URL = `${LOCAL_API_URL}patient/surgical-history/`;

describe("Get Surgical History integration tests", () => {
  let patientId;

  beforeAll(async () => {
    patientId = await createTestPatientWithSurgery({
      surgicalEvent: true,
      surgicalEventData: [
        {
          surgeryType: "Appendectomy",
          surgeryYear: "2023",
          complications: "None",
        },
      ],
    });
  });

  test("Retrieve existing surgical history", async () => {
    const response = await axios.get(API_URL + patientId);

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const surgicalHistory = response.data;

    expect(surgicalHistory).toBeDefined();
    expect(surgicalHistory.patientId).toBe(patientId);
    expect(surgicalHistory.surgicalEvent).toBeTruthy();
    expect(surgicalHistory.surgicalEventData.length).toBeGreaterThan(0);
    expect(surgicalHistory.surgicalEventData[0].surgeryType).toBe("Appendectomy");
  });

  test("Fail to retrieve surgical history for non-existent patient", async () => {
    const nonExistentPatientId = 999999; // Assuming this ID does not exist
    const response = await axios.get(API_URL + nonExistentPatientId, {
      validateStatus: () => true,
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(404);

    const { message } = response.data;
    expect(message).toBe("No surgical history found for the provided ID.");
  });

  test("Invalid ID provided", async () => {
    const invalidId = "10000"; // Assuming this is an invalid ID format
    const response = await axios.get(API_URL + invalidId, { validateStatus: () => true });

    expect(response).toBeDefined();
    expect(response.status).toBe(404);

    const { message } = response.data;
    expect(message).toBe("No surgical history found for the provided ID.");
  });
});
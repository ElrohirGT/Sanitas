import { getPgClient } from "db-conn";
import { logger, withRequest } from "logging";
import { createResponse, mapToAPIStudentInfo } from "utils";

/**
 * Get the student information endpoint handler.
 * This endpoint must return all the information contained inside the ESTUDIANTE table for a specific student.
 */
export const handler = async (event, context) => {
  withRequest(event, context);
  if (event.httpMethod !== "GET") {
    throw new Error(
      `/patient/student/{id} only accepts GET method, you tried: ${event.httpMethod}`,
    );
  }

  let client;
  try {
    const url = process.env.POSTGRES_URL;
    logger.info(url, "Connecting to DB...");
    client = getPgClient(url);
    await client.connect();

    logger.info("Checking if received all parameters...");
    const id = event.pathParameters.id;
    if (!id) {
      logger.error("No id received!");
      const response = {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*", // Allow from anywhere
          "Access-Control-Allow-Methods": "GET", // Allow only GET request
        },
        body: JSON.stringify({ message: "Invalid request: No id supplied!" }),
      };

      return response;
    }
    logger.info("CARNET received!");

    logger.info("Querying DB...");
    const dbResponse = await client.query("SELECT * FROM estudiante WHERE ID_PACIENTE = $1 LIMIT 1;", [id]);
    logger.info(dbResponse, "Query done!");

    if (dbResponse.rowCount === 0) {
      logger.error("No record found!");

      return createResponse()
        .setStatusCode(404)
        .addCORSHeaders()
        .setBody(JSON.stringify({ message: "Invalid request: No student with the given ID found." }))
        .build();
    }

    logger.info("Creating response...");

    logger.info(dbResponse.rows[0], "Responding with:");
    return createResponse()
      .setStatusCode(200)
      .addCORSHeaders()
      .setBody(mapToAPIStudentInfo(dbResponse.rows[0]))
      .build();
  } catch (error) {
    logger.error(error, "An error has occurred!");
    const response = {
      statusCode: 500,
      body: JSON.stringify(error),
    };
    return createResponse()
      .setStatusCode(500)
      .addCORSHeaders()
      .setBody(JSON.stringify(error))
      .build();
  } finally {
    await client?.end();
  }
};

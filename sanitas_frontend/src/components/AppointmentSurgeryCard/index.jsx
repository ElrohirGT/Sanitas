import React, { useState } from "react";
import { colors, fonts } from "src/theme.mjs";

/**
 * @typedef {Object} AppointmentSurgeryCardProps
 * @property {'surgical' | 'appointment'} type - Distinguishes between surgical and appointment types to render appropriate information.
 * @property {string} year - The year of the surgery or appointment.
 * @property {string} surgeryType - The type of surgery, only applicable if `type` is 'surgical'.
 * @property {string} date - The date of the appointment, only applicable if `type` is 'appointment'.
 * @property {string} reason - The reason for the consultation, applicable only if `type` is 'appointment'.
 * @property {React.MouseEventHandler<HTMLDivElement>} onClick - The callback function to be executed when the card is clicked.
 *
 * Renders a card component that displays either surgical or appointment details based on the `type` prop.
 * The card is interactive and changes its style on hover. It supports click interactions that trigger the provided `onClick` callback.
 *
 * The surgical card displays the year and type of surgery with optional truncation of long text.
 * The appointment card shows the date and reason for the consultation, also with optional truncation.
 *
 * Styles are applied directly through inline styles, and hover effects are managed with internal state.
 *
 * @param {AppointmentSurgeryCardProps} props - The properties passed to the card component.
 * @returns {JSX.Element} The React component rendering the card with either surgical or appointment information.
 */
export default function AppointmentSurgeryCard({ type, year, surgeryType, date, reason, onClick }) {
  const [hover, setHover] = useState(false);

  const cardStyle = {
    backgroundColor: hover ? colors.sidebarHover : colors.secondaryBackground,
    borderBottom: hover ? "0.1rem solid transparent" : `0.01rem solid ${colors.darkerGrey}`,
    cursor: "pointer",
    padding: "1.5rem",
    transition: "background-color 0.3s, border-bottom 0.3s",
    paddingTop: "1.5rem",
    paddingBottom: "1.5rem",
  };

  const labelStyle = {
    fontWeight: "bold",
    fontFamily: fonts.textFont,
  };

  const contentStyle = {
    fontFamily: fonts.textFont,
  };

  const truncateText = (text, maxLength = 30) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text || "";
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {type === "surgical"
        ? (
          <>
            <p>
              <span style={labelStyle}>Año:</span> <span style={contentStyle}>{year}</span>
            </p>
            <p>
              <span style={labelStyle}>Tipo de Cirugía:</span>
              <span style={contentStyle}>{truncateText(surgeryType)}</span>
            </p>
          </>
        )
        : (
          <>
            <p>
              <span style={labelStyle}>Fecha:</span> <span style={contentStyle}>{date}</span>
            </p>
            <p>
              <span style={labelStyle}>Motivo de Consulta:</span>
              <span style={contentStyle}>{truncateText(reason)}</span>
            </p>
          </>
        )}
    </div>
  );
}

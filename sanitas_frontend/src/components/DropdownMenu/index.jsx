import React, { useState } from "react";

/**
 * @typedef {Object} DropdownMenuProps
 * @property {string} value - The currently selected value of the dropdown.
 * @property {(event: React.ChangeEvent<HTMLSelectElement>) => void} onChange - The callback function to be executed when the selected option is changed.
 * @property {Option[]} options - An array of objects representing the options available in the dropdown. Each option should have a `value` and a `label`.
 * @property {boolean} [disabled=false] - If true, the dropdown will be non-interactive and displayed in a disabled state.
 * @property {{container: React.CSSProperties, select: React.CSSProperties, option: React.CSSProperties, indicator: React.CSSProperties}} [style] - Custom styles for sub-components:
 *        - `style.container`: Styles for the dropdown container affecting layout and borders.
 *        - `style.select`: Styles for the select element, controlling appearance and interactions.
 *        - `style.option`: Styles for each option, affecting text color and background.
 *        - `style.indicator`: Styles for the dropdown indicator, includes transformations and visibility.
 *
 * Renders a dropdown menu with configurable options and selected value. The dropdown
 * includes a toggleable list that can be opened or closed with a click. The component allows for extensive customization of its appearance and interaction model. It can be rendered as read-only by setting the `disabled` property.
 *
 * @param {DropdownMenuProps} props - The props object for the DropdownMenu component.
 * @returns {JSX.Element} The React Select element with options, wrapped in a styled container.
 */

export default function DropdownMenu({ value, onChange, readOnly = false, options, style = {} }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    if (!readOnly) {
      setIsOpen(!isOpen);
    }
  };

  const handleDropdownChange = (e) => {
    if (!readOnly) {
      onChange(e);
      setIsOpen(false);
    }
  };

  const handleDropdownBlur = () => {
    if (isOpen && !readOnly) {
      setIsOpen(false);
    }
  };
  const defaultStyles = {
    container: {
      position: "relative",
      width: "190px",
      ...style.container,
    },
    select: {
      width: "100%",
      backgroundColor: "#FFFFFF",
      color: "#0F6838",
      borderRadius: "5px",
      padding: "10px 30px 10px 10px",
      border: "2px solid #0F6838",
      cursor: "pointer",
      fontSize: "14px",
      appearance: "none",
      outline: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      ...style.select,
    },
    option: {
      backgroundColor: "#FFFFFF",
      color: "#0F6838",
      ...style.option,
    },
    indicator: {
      position: "absolute",
      top: "50%",
      right: "5%",
      transform: `translateY(-50%) rotate(${isOpen ? "180deg" : "0deg"})`,
      transition: "transform 0.3s",
      pointerEvents: "none",
      color: "#0F6838",
      fontSize: "12px",
      ...style.indicator,
    },
  };

  return (
    <div style={defaultStyles.container}>
      <select
        value={value}
        onChange={handleDropdownChange}
        onMouseDown={toggleDropdown}
        onBlur={handleDropdownBlur}
        style={defaultStyles.select}
        readOnly={readOnly}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} style={defaultStyles.option}>
            {option.label}
          </option>
        ))}
      </select>
      <div style={defaultStyles.indicator}>▼</div>
    </div>
  );
}

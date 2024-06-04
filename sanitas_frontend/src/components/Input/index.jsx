import React from "react";

export default function Input({ type, value, onChange, name, checked, placeholder, label }) {
  switch (type) {
    case "radio":
      return (
        <label>
          <input type={type} name={name} checked={checked} onChange={onChange} />
          {label}
        </label>
      );

    case "date":
      return <input type={type} value={value} onChange={onChange} placeholder={placeholder} />;

    default:
      return <input type={type} value={value} onChange={onChange} placeholder={placeholder} />;
  }
}

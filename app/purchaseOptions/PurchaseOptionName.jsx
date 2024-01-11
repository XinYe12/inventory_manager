// PurchaseOptionNameInput.jsx

import { TextField } from "@shopify/polaris";
import { useState, useCallback } from "react";

const PurchaseOptionNameInput = ({ value, onChange }) => {
  const handleInputChange = useCallback(
    (newValue) => {
      onChange(newValue);
    },
    [onChange]
  );

  return (
    <TextField
      label="Purchase Option Name"
      value={value}
      onChange={handleInputChange}
      autoComplete="off"
      name="name" // Ensure this matches what you're looking for in the action function
    />
  );
};

export default PurchaseOptionNameInput;

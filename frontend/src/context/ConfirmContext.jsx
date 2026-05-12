import React, { createContext, useContext, useState, useRef } from "react";
import ConfirmDialog from "../component/ConfirmDialog";

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({});
  const resolveRef = useRef();

  const confirm = (props) => {
    setOptions(props);
    setOpen(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleClose = (value) => {
    setOpen(false);
    if (resolveRef.current) {
      resolveRef.current(value);
    }
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        open={open}
        onClose={() => handleClose(false)}
        onConfirm={() => handleClose(true)}
        {...options}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};

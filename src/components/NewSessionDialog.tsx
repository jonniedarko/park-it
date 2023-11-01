"use client";
import React, { useRef, useState } from "react";
import {
  Button, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab, TextField
} from "@mui/material";
import { GridAddIcon as AddIcon } from "@mui/x-data-grid";
import { Timestamp } from "firebase/firestore";
import { validateLicensePlate, validatePhoneNumber } from "@/lib/validators";

export function NewSessionDialog({ open, setOpen, onAddNew }) {
  const [dirty, setDirty] = useState(false);
  const [validation, setValidation] = useState({
    phone: null,
    licensePlate: null,
  });
  const licensePlateNumberRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const onInputChange = () => {
    setValidation({
      phone: phoneNumberRef.current?.value &&
        phoneNumberRef.current !== document.activeElement
        ? validatePhoneNumber(phoneNumberRef.current.value)
        : null,
      licensePlate: licensePlateNumberRef.current?.value &&
        licensePlateNumberRef.current !== document.activeElement
        ? validateLicensePlate(licensePlateNumberRef.current.value)
        : null,
    });
    if (!dirty) setDirty(true);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    [licensePlateNumberRef, phoneNumberRef].forEach((ref) => {
      ref.current.value = "";
    });
    setValidation({
      phone: null,
      licensePlate: null,
    });
  };
  const handleAddNew = () => {
    const licensePlate = licensePlateNumberRef.current.value;
    const phone = phoneNumberRef.current.value;
    handleClose();
    onAddNew({
      licensePlate,
      phone,
      entry: Timestamp.fromDate(new Date()),
      status: "active",
    });
  };

  return (
    <div>
      <Fab
        sx={{ position: "absolute", bottom: "20px", right: "20px" }}
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Start New Parking Session</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add License Plate and Phone number to start new session
          </DialogContentText>
          <TextField
            onBlur={onInputChange}
            inputRef={licensePlateNumberRef}
            error={validation.licensePlate === false}
            helperText={validation.licensePlate === false
              ? "Invalid license plate"
              : undefined}
            onChange={onInputChange}
            autoFocus
            margin="dense"
            id="name"
            label="Vehicle Registration"
            fullWidth
            variant="standard" />
          <TextField
            onBlur={onInputChange}
            inputRef={phoneNumberRef}
            error={validation.phone === false}
            helperText={validation.phone === false ? "Invalid phone number" : undefined}
            onChange={onInputChange}
            autoFocus
            margin="dense"
            id="name"
            label="Phone"
            fullWidth
            variant="standard" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleAddNew}
            disabled={!Object.values(validation).every((v) => v === true)}
          >
            Start Session
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

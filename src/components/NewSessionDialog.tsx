"use client";
import React, { useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  TextField,
} from "@mui/material";
import { GridAddIcon as AddIcon } from "@mui/x-data-grid";
import { validateLicensePlate, validatePhoneNumber } from "@/lib/validators";

function hasOpenSession(licensePlate: string, sessions: any[]): any {
  const existingOpenSession = sessions.find(
    (s) => s.licensePlateNumber === licensePlate && !Boolean(s.exitTimestamp),
  );
  return Boolean(existingOpenSession);
}

export function NewSessionDialog({ open, setOpen, onAddNew, sessions = [] }) {
  const [dirty, setDirty] = useState(false);
  const [validation, setValidation] = useState({
    phone: null,
    licensePlate: null,
  });
  const licensePlateNumberRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const onInputChange = () => {
    let licensePlateValidationMessage = null;
    if (
      licensePlateNumberRef.current?.value &&
      hasOpenSession(licensePlateNumberRef.current.value, sessions)
    ) {
      licensePlateValidationMessage = `License Plate ${licensePlateNumberRef.current.value} already has active session`;
    } else if (
      licensePlateNumberRef.current?.value &&
      !validateLicensePlate(licensePlateNumberRef.current.value)
    ) {
      licensePlateValidationMessage = "Invalid license Plate";
    }
    const phoneValid =
      phoneNumberRef.current?.value &&
      phoneNumberRef.current !== document.activeElement &&
      validatePhoneNumber(phoneNumberRef.current.value);
    setValidation({
      phone: phoneValid ? null : "Phone number requires 10 digits",
      licensePlate:
        licensePlateNumberRef.current !== document.activeElement
          ? licensePlateValidationMessage
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
            error={!!validation.licensePlate}
            helperText={validation.licensePlate || ""}
            onChange={onInputChange}
            autoFocus
            margin="dense"
            id="name"
            label="Vehicle Registration"
            fullWidth
            variant="standard"
          />
          <TextField
            onBlur={onInputChange}
            inputRef={phoneNumberRef}
            error={!!validation.phone}
            helperText={!!validation.phone ? "Invalid phone number" : ""}
            onChange={onInputChange}
            autoFocus
            margin="dense"
            id="name"
            label="Phone"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleAddNew}
            disabled={Object.values(validation).some((v) => Boolean(v))}
          >
            Start Session
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

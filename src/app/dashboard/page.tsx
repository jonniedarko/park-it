"use client";
import { useAuthContext } from "@/context/AuthContext";
import {
  GridActionsCellItem,
  GridEventListener,
  GridRenderCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowParams,
} from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import { Alert, Container, Snackbar, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Timestamp } from "firebase/firestore";
import CheckIcon from "@mui/icons-material/NoCrash";
import ActiveIcon from "@mui/icons-material/DirectionsCar";
import { createDocument, setDocument } from "@/firebase/config";
import { CenteredLoadingIndicator } from "@/components/CenteredLoadingIndicator";
import { NewSessionDialog } from "@/components/NewSessionDialog";
import { transformSessionsToGridFormat } from "@/lib/transformers";

const columns = [
  {
    field: "licensePlateNumber",
    headerName: "License Plate Number",
    type: "string",
    width: 200,
    editable: true,
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    type: "string",
    width: 150,
    editable: true,
  },
  {
    field: "entryTimestamp",
    type: "datetime",
    headerName: "Entry Timestamp",
    width: 150,
    editable: true,
    valueGetter: (params) => {
      try {
        return new Date(params.value * 1000);
      } catch (e) {
        console.error("error converting entryTimestamp", e);
        return null;
      }
    },
    renderCell: (props: GridRenderCellParams<any, Date>) => {
      try {
        const d = props.value;
        return (
          <>
            {d.getFullYear()}/{d.getMonth()}/{d.getDate()} {d.getHours()}:
            {d.getMinutes()}
          </>
        );
      } catch (e) {
        console.error("error converting entryTimestamp", e);
        return <>{""}</>;
      }
    },
  },
  {
    field: "exitTimestamp",
    type: "datetime",
    valueGetter: (params) => {
      try {
        return new Date(params.value);
      } catch (e) {
        console.error("error converting exitTimestamp", e);
        return null;
      }
    },
    renderCell: (props: GridRenderCellParams<any, Date>) => {
      try {
        const d = props.value;
        //@ts-ignore typescript errors here but it valid js
        if (isNaN(d)) return "pending";
        return (
          <>
            {d.getFullYear()}/{d.getMonth()}/{d.getDate()} {d.getHours()}:
            {d.getMinutes()}
          </>
        );
      } catch (e) {
        console.error("error converting entryTimestamp", e);
        return <>{""}</>;
      }
    },
    headerName: "Exit Timestamp",
    width: 150,
    editable: true,
  },
] as GridColDef[];

async function getSessions() {
  let res = await fetch("/api/parking_sessions");
  return await res.json();
}

function DashboardPage() {
  //@ts-ignore not typed
  const { user } = useAuthContext();
  const router = useRouter();
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [snack, setSnack] = useState({
    severity: null,
    open: false,
    message: "",
  });
  const [sessions, setSessions] = React.useState<null | any[]>(null);

  async function getSessionsFromRemote() {
    const d = await getSessions();
    const transformed = transformSessionsToGridFormat(d.sessions);
    setSessions(transformed);
  }
  const handleCompleteSessionClick = (id: GridRowId) => async () => {
    let targetSession = sessions.find((s) => s.id === id);
    if (!targetSession) return;
    await setDocument("park_sessions", `${id}`, {
      ...targetSession,
      exitTimestamp: Timestamp.now(),
    });
    setSnack({
      severity: "success",
      open: true,
      message: "Successfully completed session!",
    });
    getSessionsFromRemote();
  };

  const columnsWithActions = useMemo(
    () => [
      ...columns,
      {
        field: "actions",
        type: "actions",
        headerName: "Status",
        width: 100,
        cellClassName: "actions",
        //@ts-ignore
        getActions: ({ id, exitTimestamp }: GridRowParams) => {
          const hasCompletedSession =
            //@ts-ignore
            exitTimestamp instanceof Date && !isNaN(exitTimestamp);
          return [
            <GridActionsCellItem
              key="complete-session"
              icon={
                hasCompletedSession ? (
                  <Tooltip title="Session Ended">
                    <CheckIcon />
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to complete session">
                    <ActiveIcon />
                  </Tooltip>
                )
              }
              label="End Parking Session"
              className="textPrimary"
              disabled={hasCompletedSession}
              onClick={handleCompleteSessionClick(id)}
              color={hasCompletedSession ? "inherit" : "warning"}
            />,
          ];
        },
      },
    ],
    [],
  );

  useEffect(() => {
    if (user == null) router.push("/");
    getSessionsFromRemote();
  }, [user]);

  const addRecord = async ({ licensePlate, phone }) => {
    const id = `TEMP_${Math.max(...sessions.map((s) => s.id), 0) + 1}`;
    try {
      const newRecord = {
        id,
        licensePlateNumber: licensePlate,
        phoneNumber: phone,
        status: "active",
        entryTimestamp: Timestamp.now(),
        exitTimestamp: null,
      };
      setSessions((oldSessions) => [
        ...oldSessions,
        { ...newRecord, isNew: true },
      ]);
      await createDocument("park_sessions", newRecord);
      setSnack({
        severity: "success",
        open: true,
        message: "Session successfully added",
      });
      await getSessionsFromRemote();
    } catch (e) {
      setSnack({
        severity: "error",
        open: true,
        message: "An Error Occured when trying to add Session",
      });
      setSessions(
        (currentSessions) => currentSessions?.filter((s) => s.id === id),
      );
    }
  };
  const handleCloseSnack = () => {
    setSnack((current) => ({ ...current, open: false }));
  };
  return (
    <>
      <h1>Dashboard</h1>
      <div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snack.open}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
        >
          <Alert
            onClose={handleCloseSnack}
            severity={snack.severity}
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
        <Container>
          <h3>Parking Sessions</h3>
          {sessions != null ? (
            <DataGrid
              rows={sessions}
              columns={columnsWithActions}
              disableColumnFilter={false}
              // Provide the custom toolbar component
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  setRows: setSessions,
                },
              }}
            />
          ) : (
            <CenteredLoadingIndicator />
          )}
        </Container>

        <NewSessionDialog
          open={addModalOpen}
          setOpen={setAddModalOpen}
          onAddNew={addRecord}
        />
      </div>
    </>
  );
}

export default DashboardPage;

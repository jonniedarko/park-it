"use client";
import { useAuthContext } from "@/context/AuthContext";
import {
  GridRenderCellParams,
  GridRowId,
  GridRowParams,
} from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Alert, Container, IconButton, Snackbar, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Timestamp } from "firebase/firestore";
import CheckIcon from "@mui/icons-material/NoCrash";
import ActiveIcon from "@mui/icons-material/DirectionsCar";
import { CenteredLoadingIndicator } from "@/components/CenteredLoadingIndicator";
import { NewSessionDialog } from "@/components/NewSessionDialog";
import { transformSessionsToGridFormat } from "@/lib/transformers";

const columns = [
  {
    field: "licensePlateNumber",
    headerName: "License Plate Number",
    type: "string",
    width: 100,
    editable: true,
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    type: "string",
    width: 150,
  },
  {
    field: "entryTimestamp",
    headerName: "Entry Timestamp",
    type: "datetime",
    width: 200,
    renderCell: (props: GridRenderCellParams<any, Date>) => {
      try {
        const d = new Date((props.value as any) * 1000);
        return d.toLocaleString("en-us", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      } catch (e) {
        return <>{""}</>;
      }
    },
  },
  {
    field: "exitTimestamp",
    type: "datetime",
    width: 200,
    renderCell: (props: GridRenderCellParams<any, Date>) => {
      try {
        if (!props.value) {
          return null;
        }
        const d = new Date((props.value as any) * 1000);
        return d.toLocaleString("en-us", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      } catch (e) {
        return "pending";
      }
    },
    headerName: "Exit Timestamp",
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

  const handleCompleteSessionClick = useCallback(
    (id: GridRowId) => async () => {
      let targetSession = sessions.find((s) => s.id === id);
      if (!targetSession) return;
      await fetch(`/api/parking_sessions/${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...targetSession,
          exitTimestamp: Timestamp.now().seconds,
        }),
      });

      setSnack({
        severity: "success",
        open: true,
        message: "Successfully completed session!",
      });
      getSessionsFromRemote();
    },
    [sessions],
  );

  const columnsWithActions = useMemo(
    () =>
      [
        ...columns,
        {
          field: "actions",
          type: "actions",
          headerName: "Status",
          width: 100,
          cellClassName: "actions",
          //@ts-ignore
          renderCell: ({ row: { id, exitTimestamp } }: GridRowParams) => {
            const hasCompletedSession =
              //@ts-ignore
              !isNaN(exitTimestamp) && exitTimestamp > 0;
            return (
              <IconButton
                disabled={hasCompletedSession}
                onClick={handleCompleteSessionClick(id)}
                color={hasCompletedSession ? "inherit" : "warning"}
                key={`complete-session-${id}`}
              >
                {hasCompletedSession ? (
                  <Tooltip title="Session Ended">
                    <CheckIcon />
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to complete session">
                    <ActiveIcon />
                  </Tooltip>
                )}
              </IconButton>
            );
          },
        },
      ] as GridColDef[],
    [handleCompleteSessionClick],
  );

  useEffect(() => {
    if (user == null) router.push("/");
    getSessionsFromRemote();
  }, [user, router]);

  const addRecord = async ({ licensePlate, phone }) => {
    const id = `TEMP_${Math.max(...sessions.map((s) => s.id), 0) + 1}`;
    try {
      const newRecord = {
        licensePlateNumber: licensePlate,
        phoneNumber: phone,
        entryTimestamp: Timestamp.now().seconds,
        exitTimestamp: null,
      };
      setSessions((oldSessions) => [
        ...oldSessions,
        { ...newRecord, id, isNew: true },
      ]);
      const response = await fetch("/api/parking_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecord),
      });
      if (!response.ok) {
        throw "Failed to save";
      }
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
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              // Provide the custom toolbar component
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
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
          sessions={sessions}
        />
      </div>
    </>
  );
}

export default DashboardPage;

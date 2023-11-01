import { GridRowsProp } from "@mui/x-data-grid";
export function transformSessionsToGridFormat(sessions: any): GridRowsProp[] {
  const rows = [];
  if (!sessions || !Object.keys(sessions).length) {
    return rows;
  }

  for (const sessionKey in sessions) {
    const sessionData = sessions[sessionKey];
    const row = {
      id: sessionKey,
      licensePlateNumber: sessionData.licensePlateNumber || "",
      phoneNumber: sessionData.phoneNumber || "",
      status: sessionData.status || "",
      entryTimestamp: sessionData.entryTimestamp
        ? sessionData.entryTimestamp
        : null,
      exitTimestamp: sessionData.exitTimestamp
        ? sessionData.exitTimestamp
        : null,
    };
    rows.push(row);
  }

  return rows;
}

import { GridRowsProp } from "@mui/x-data-grid";

export function sortSessionsByTimestamps(a, b) {
  // Sort by exitTimestamp if both are non-null, with nulls first
  if (a.exitTimestamp === null) return -1;
  if (b.exitTimestamp === null) return 1;
  if (a.exitTimestamp !== b.exitTimestamp)
    return b.exitTimestamp - a.exitTimestamp;

  // If exitTimestamps are equal or both null, sort by entryTimestamp
  return b.entryTimestamp - a.entryTimestamp;
}

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
  return rows.sort(sortSessionsByTimestamps);
}

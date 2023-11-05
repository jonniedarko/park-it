import {
  sortSessionsByTimestamps,
  transformSessionsToGridFormat,
} from "./transformers";

const toTimestamp = (dateString) => new Date(dateString).getTime();

describe("sortSessionsByTimestamps", () => {
  it("should sort sessions correctly by exitTimestamp", () => {
    const sessionA = {
      id: "A",
      entryTimestamp: toTimestamp("2023-10-28 06:30:00"),
      exitTimestamp: toTimestamp("2023-10-28 18:30:00"),
    };
    const sessionB = {
      id: "B",
      entryTimestamp: toTimestamp("2023-10-28 07:30:00"),
      exitTimestamp: toTimestamp("2023-10-28 11:30:00"),
    };
    const sessionC = {
      id: "C",
      entryTimestamp: toTimestamp("2023-10-28 20:30:00"),
      exitTimestamp: null,
    };

    const sessions = [sessionA, sessionB, sessionC];
    sessions.sort(sortSessionsByTimestamps);

    expect(sessions).toEqual([sessionC, sessionB, sessionA]);
  });

  it("should sort sessions correctly by entryTimestamp when exitTimestamps are equal", () => {
    const sessionA = {
      id: "A",
      entryTimestamp: toTimestamp("2023-10-28 08:30:00"),
      exitTimestamp: toTimestamp("2023-10-28 09:30:00"),
    };
    const sessionB = {
      id: "B",
      entryTimestamp: toTimestamp("2023-10-28 07:30:00"),
      exitTimestamp: toTimestamp("2023-10-28 09:30:00"),
    };

    const sessions = [sessionA, sessionB];
    sessions.sort(sortSessionsByTimestamps);

    expect(sessions).toEqual([sessionB, sessionA]);
  });
});
describe("transformSessionsToGridFormat", () => {
  it("should return an empty array when sessions object is empty or null", () => {
    expect(transformSessionsToGridFormat({})).toEqual([]);
    expect(transformSessionsToGridFormat(null)).toEqual([]);
  });

  it("should transform sessions to grid format correctly", () => {
    const sessions = {
      session1: {
        licensePlateNumber: "ABC123",
        phoneNumber: "123-456-7890",
        status: "active",
        entryTimestamp: 1000,
        exitTimestamp: 2000,
      },
      session2: {
        licensePlateNumber: "XYZ987",
        phoneNumber: "987-654-3210",
        status: "inactive",
        entryTimestamp: 500,
        exitTimestamp: null,
      },
    };

    const expectedOutput = [
      {
        id: "session2",
        licensePlateNumber: "XYZ987",
        phoneNumber: "987-654-3210",
        status: "inactive",
        entryTimestamp: 500,
        exitTimestamp: null,
      },
      {
        id: "session1",
        licensePlateNumber: "ABC123",
        phoneNumber: "123-456-7890",
        status: "active",
        entryTimestamp: 1000,
        exitTimestamp: 2000,
      },
    ];

    expect(transformSessionsToGridFormat(sessions)).toEqual(expectedOutput);
  });
});

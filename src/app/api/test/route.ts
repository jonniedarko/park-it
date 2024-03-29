import { createDocument } from "@/firebase/db";
import { Timestamp, DocumentData } from "firebase/firestore";

export const dynamic = "force-dynamic";

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomData = (): Array<DocumentData> => {
  const data = [];
  for (let i = 0; i < 10; i++) {
    const phoneNumber = `555-${getRandomInt(100, 999)}-${getRandomInt(
      1000,
      9999,
    )}`;
    const licensePlateNumber = `${String.fromCharCode(
      getRandomInt(65, 90),
    )}${String.fromCharCode(getRandomInt(65, 90))}${getRandomInt(100, 999)}`;
    const entryTimestamp = Timestamp.fromDate(
      new Date(
        2023,
        getRandomInt(0, 11),
        getRandomInt(1, 28),
        getRandomInt(0, 23),
        getRandomInt(0, 59),
      ),
    ).seconds;
    const exitTimestamp = Timestamp.fromDate(
      new Date(entryTimestamp * 1000 + getRandomInt(1, 12) * 60 * 60 * 1000),
    ).seconds;
    data.push({
      phoneNumber,
      licensePlateNumber,
      entryTimestamp,
      exitTimestamp,
    });
  }
  return data;
};

export async function GET() {
  const data = generateRandomData();
  let i = data.length;
  while (i > 0) {
    await createDocument("parking_sessions", data[--i]);
  }
  return Response.json({
    sessions: data,
  });
}

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const patients = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/patients.json"), "utf-8")
);

export const authTool = async ({ name, dob }) => {
  const normalizedDob = new Date(dob).toISOString().split("T")[0];

  const match = patients.find(p =>
    p.name.toLowerCase() === name.toLowerCase() &&
    p.dob === normalizedDob
  );

  return match || null;
};

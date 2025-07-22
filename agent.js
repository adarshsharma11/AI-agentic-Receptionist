import { createRequire } from "module";
const require = createRequire(import.meta.url);
const chrono = require("chrono-node");

import { authTool } from "./tools/authTool.js";
import { appointmentTool } from "./tools/appointmentTool.js";
import { escalate, isAfterHours } from "./tools/escalationTool.js";

export async function handleQuery(input, context) {
  if (!context.patient) {
    const parsed = chrono.parse(input);
    if (!parsed.length) {
      return "Please say your name and date of birth, like: 'I'm Jane Doe born on July 15, 1986'.";
    }

    const dateText = parsed[0].text;
    const dob = parsed[0].start.date().toISOString().split("T")[0];
    const indexOfDate = input.indexOf(dateText);
    let beforeDate = input.slice(0, indexOfDate);

    // Lowercase version for cleaning
    let rawName = beforeDate.toLowerCase();

    const junkWords = [
      "i’m", "i am", "i'm", "my name is", "name is", "this is",
      "and", "born on", "born", "dob", "with", "is", ","
    ];

    junkWords.forEach(word => {
      rawName = rawName.replace(word, "");
    });

    // Clean up whitespace
    rawName = rawName.replace(/\s+/g, " ").trim();

    // Capitalize each word
    const name = rawName
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    console.log("EXTRACTED NAME:", name);
    console.log("EXTRACTED DOB:", dob);

    const patient = await authTool({ name, dob });

    if (patient) {
      context.patient = patient;
      return `Hi ${name}, how can I assist you today?`;
    }

    return `❌ No match found for name: "${name}" and DOB: ${dob}`;
  }

  const { patient } = context;

  if (input.toLowerCase().includes("reschedule")) {
    if (isAfterHours()) return escalate("reschedule request after hours");
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 2);
    return await appointmentTool.reschedule(patient, newDate.toISOString());
  }

  if (input.toLowerCase().includes("cancel")) {
    if (isAfterHours()) return escalate("cancellation request after hours");
    return await appointmentTool.cancel(patient);
  }

  return "Sorry, I didn’t understand. You can ask to reschedule or cancel.";
}

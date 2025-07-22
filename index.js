import dotenv from "dotenv";
dotenv.config();

import { speak, listen } from "./voice.js";
import { handleQuery } from "./agent.js";

(async () => {
  let context = { patient: null };

  await speak("Hello! This is your AI receptionist. How may I assist you?");

  while (true) {
    const userInput = await listen();
    const response = await handleQuery(userInput, context);
    await speak(response);
  }
})();

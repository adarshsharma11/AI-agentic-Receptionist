import axios from "axios";
import fs from "fs";
import readlineSync from "readline-sync";
import { execSync } from "child_process";

const VOICE_ID = "C8wZRioDZqA6fkwDW6Df";

export async function speak(text) {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        responseType: "arraybuffer",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        }
      }
    );

    fs.writeFileSync("out.mp3", response.data);
    execSync("afplay out.mp3"); // or mpg123 depending on your OS
  } catch (err) {
    if (err.response && err.response.status === 429) {
      console.error("❌ Rate limit hit on ElevenLabs API. Try again later.");
    } else {
      console.error("❌ ElevenLabs API error:", err.message);
    }
  }
}


export async function listen() {
  console.log("🎙️ Listening... (type to simulate)");
  return readlineSync.question("You (voice): ");
}

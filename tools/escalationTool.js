import { config } from "../config.js";

export const isAfterHours = () => {
  const hour = new Date().getHours();
  return hour < config.BUSINESS_HOURS[0] || hour >= config.BUSINESS_HOURS[1];
};

export const escalate = (reason) => {
  return `We’ve created a ticket for our team. A human will call you during business hours. Reason: ${reason}`;
};

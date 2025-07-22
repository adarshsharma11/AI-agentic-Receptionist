export const appointmentTool = {
  reschedule: async (patient, newDate) => {
    patient.appointment.date = newDate;
    patient.appointment.status = "rescheduled";
    return `Appointment rescheduled to ${newDate}`;
  },

  cancel: async (patient) => {
    patient.appointment.status = "cancelled";
    return `Appointment cancelled for ${patient.name}`;
  }
};

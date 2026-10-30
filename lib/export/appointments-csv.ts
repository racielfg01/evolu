// lib/export/appointments-csv.ts
// Filtra citas por día o semana y las convierte a CSV descargable.
import { endOfDay, endOfWeek, format, startOfDay, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import type { FullAppointment } from "@/lib/actions/appointment.actions";

export type ExportMode = "day" | "week";

export interface ExportRange {
  start: Date;
  end: Date;
}

/**
 * Las citas se guardan en UTC y la UI las muestra con sus componentes UTC
 * como si fueran locales (ver normalizeToLocal en ApoimentsManagment).
 * Replicamos esa regla para que la exportación coincida con el calendario.
 */
export function toCalendarDate(date: Date): Date {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

export function getExportRange(mode: ExportMode, date: Date): ExportRange {
  if (mode === "day") {
    return { start: startOfDay(date), end: endOfDay(date) };
  }

  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
}

export function filterAppointmentsByRange(
  appointments: FullAppointment[] | undefined,
  range: ExportRange
): FullAppointment[] {
  if (!appointments) return [];

  const start = range.start.getTime();
  const end = range.end.getTime();

  return appointments
    .filter((appointment) => {
      const date = toCalendarDate(new Date(appointment.date)).getTime();
      return date >= start && date <= end;
    })
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

const HEADERS = [
  "Fecha",
  "Inicio",
  "Fin",
  "Cliente",
  "Email",
  "Teléfono",
  "Servicios",
  "Estado",
  "Duración (min)",
  "Total",
  "Nota",
  "Registrado por",
];

function escapeCell(value: string): string {
  // Evita que Excel interprete el contenido como fórmula.
  const guarded = /^[=+\-@]/.test(value) ? `'${value}` : value;
  if (/[";\n\r]/.test(guarded)) {
    return `"${guarded.replace(/"/g, '""')}"`;
  }
  return guarded;
}

export function appointmentsToCsv(appointments: FullAppointment[]): string {
  const rows = appointments.map((appointment) => {
    const start = toCalendarDate(new Date(appointment.date));
    const end = toCalendarDate(new Date(appointment.endDate));
    const services = appointment.services
      .map((item) => `${item.service.name} x${item.quantity}`)
      .join(" | ");

    return [
      format(start, "yyyy-MM-dd"),
      format(start, "HH:mm"),
      format(end, "HH:mm"),
      appointment.user?.name || "",
      appointment.user?.email || "",
      appointment.user?.phone || "",
      services,
      STATUS_LABELS[appointment.status] || appointment.status,
      String(appointment.duration),
      appointment.total_price.toFixed(2),
      appointment.note || "",
      appointment.createdBy?.name || "Sistema",
    ].map((cell) => escapeCell(String(cell)));
  });

  return [HEADERS.map(escapeCell), ...rows]
    .map((row) => row.join(";"))
    .join("\r\n");
}

export function getExportFileName(
  mode: ExportMode,
  range: ExportRange,
  ext: "csv" | "pdf" = "csv"
): string {
  const suffix = ext === "pdf" ? "pdf" : "csv";
  if (mode === "day") {
    return `citas-${format(range.start, "yyyy-MM-dd")}.${suffix}`;
  }

  return `citas-semana-${format(range.start, "yyyy-MM-dd")}_a_${format(
    range.end,
    "yyyy-MM-dd"
  )}.${suffix}`;
}

export function getExportLabel(mode: ExportMode, range: ExportRange): string {
  if (mode === "day") {
    return format(range.start, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
  }

  return `semana del ${format(range.start, "d MMM", { locale: es })} al ${format(
    range.end,
    "d MMM yyyy",
    { locale: es }
  )}`;
}

/** Descarga el CSV en el navegador (funciona también sin conexión). */
export function downloadCsv(fileName: string, csv: string) {
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// lib/export/appointments-pdf.ts
// Genera un PDF con el detalle completo de citas filtradas por día o semana.
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { FullAppointment } from "@/lib/actions/appointment.actions";
import { toCalendarDate } from "@/lib/export/appointments-csv";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

/** Calcula el total de precios de los servicios de una cita. */
function servicesTotal(services: (FullAppointment["services"][number])[]): number {
  return services.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
}

/** Descarga un PDF en el navegador (funciona offline). */
export function downloadPdf(fileName: string, pdf: jsPDF) {
  const blob = new Blob([pdf.output("blob")], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Construye el PDF con la cabecera, tabla resumida y detalle de cada cita. */
export function appointmentsToPdf(
  appointments: FullAppointment[],
  rangeLabel: string
): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // ── Cabecera ──
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Citas", 14, 20);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Período: ${rangeLabel}`, 14, 28);

  doc.setTextColor(0);
  doc.setFontSize(9);
  doc.text(
    `Generado: ${format(new Date(), "PPP p", { locale: es })}  ·  Total citas: ${appointments.length}`,
    14,
    35
  );

  // ── Tabla resumen ──
  autoTable(doc, {
    head: [["Fecha", "Hora", "Cliente", "Servicios", "Estado", "Registrado por", "Total"]],
    body: appointments.map((a) => {
      const start = toCalendarDate(new Date(a.date));
      const services = a.services.map((s) => `${s.service.name} x${s.quantity}`).join(", ");
      return [
        format(start, "dd/MM/yyyy"),
        format(start, "HH:mm"),
        a.user?.name || "Sin nombre",
        services,
        STATUS_LABELS[a.status] || a.status,
        a.createdBy?.name || "Sistema",
        `$${servicesTotal(a.services).toFixed(2)}`,
      ];
    }),
    startY: 40,
    theme: "grid",
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    headStyles: { fontStyle: "bold", fillColor: [59, 130, 246], textColor: 255 },
  });

  // ── Detalle de cada cita ──
  const docTable = doc as unknown as { lastAutoTable?: { finalY: number } };
  let yPos = docTable.lastAutoTable?.finalY ?? 50;
  yPos += 5;

  appointments.forEach((appointment, idx) => {
    const start = toCalendarDate(new Date(appointment.date));
    const end = toCalendarDate(new Date(appointment.endDate));

    // Salto de página si falta espacio
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    const services = appointment.services
      .map((s) => `${s.service.name} x${s.quantity}`)
      .join(", ");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30);
    doc.text(
      `${idx + 1}. ${format(start, "dd/MM/yyyy HH:mm")} – ${format(end, "HH:mm")}`,
      14,
      yPos
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80);

    const rows: [string, string][] = [
      ["Cliente", appointment.user?.name || "Sin nombre"],
      ["Email", appointment.user?.email || ""],
      ["Teléfono", appointment.user?.phone || ""],
      ["Servicios", services],
      ["Estado", STATUS_LABELS[appointment.status] || appointment.status],
      ["Duración", `${appointment.duration} min`],
      ["Registrado por", appointment.createdBy?.name || "Sistema"],
      ["Total", `$${servicesTotal(appointment.services).toFixed(2)}`],
      ["Nota", appointment.note || "Sin notas"],
    ];

    let rowY = yPos + 8;
    rows.forEach((row) => {
      if (rowY > 275) {
        doc.addPage();
        rowY = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`${row[0]}:`, 16, rowY);
      doc.setFont("helvetica", "normal");
      const valueLines = doc.splitTextToSize(row[1], pageWidth - 56);
      doc.text(valueLines, 42, rowY);
      rowY += 5 * Math.max(1, valueLines.length);
    });

    yPos = rowY + 3;

    // Línea separadora entre citas
    doc.setDrawColor(220);
    doc.setLineWidth(0.3);
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 4;
  });

  return doc;
}

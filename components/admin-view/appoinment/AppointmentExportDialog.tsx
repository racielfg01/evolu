// components/admin-view/appoinment/AppointmentExportDialog.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FullAppointment } from "@/lib/actions/appointment.actions";
import {
  appointmentsToCsv,
  appointmentsToPdf,
  downloadCsv,
  downloadPdf,
  filterAppointmentsByRange,
  getExportFileName,
  getExportLabel,
  getExportRange,
  type ExportMode,
} from "@/lib/export";

interface AppointmentExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: FullAppointment[] | undefined;
}

export function AppointmentExportDialog({
  isOpen,
  onClose,
  appointments,
}: AppointmentExportDialogProps) {
  const [mode, setMode] = useState<ExportMode>("day");
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));

  // Al abrir, partir del día de hoy y formato CSV.
  useEffect(() => {
    if (isOpen) {
      setMode("day");
      setDate(format(new Date(), "yyyy-MM-dd"));
      setExportFormat("csv");
    }
  }, [isOpen]);

  const range = useMemo(
    () => getExportRange(mode, new Date(`${date}T00:00:00`)),
    [mode, date]
  );

  const selected = useMemo(
    () => filterAppointmentsByRange(appointments, range),
    [appointments, range]
  );

  const handleDownload = () => {
    if (selected.length === 0) {
      toast.error("No hay citas en ese rango");
      return;
    }

    if (exportFormat === "pdf") {
      const pdf = appointmentsToPdf(selected, getExportLabel(mode, range));
      downloadPdf(getExportFileName(mode, range, "pdf"), pdf);
    } else {
      downloadCsv(
        getExportFileName(mode, range, "csv"),
        appointmentsToCsv(selected)
      );
    }

    toast.success(
      `${selected.length} ${selected.length === 1 ? "cita descargada" : "citas descargadas"}`
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Descargar citas</DialogTitle>
          <DialogDescription>
            Exporta las citas de un día o de una semana en formato CSV o PDF.
            El archivo se genera en tu dispositivo, así que también funciona
            sin conexión.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Rango</Label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                <input
                  type="radio"
                  name="export-mode"
                  value="day"
                  checked={mode === "day"}
                  onChange={() => setMode("day")}
                  className="h-4 w-4 border-primary text-primary focus:ring-ring"
                />
                Un día
              </label>
              <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                <input
                  type="radio"
                  name="export-mode"
                  value="week"
                  checked={mode === "week"}
                  onChange={() => setMode("week")}
                  className="h-4 w-4 border-primary text-primary focus:ring-ring"
                />
                Una semana (lunes a domingo)
              </label>
            </div>
            <Label>Formato</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                <input
                  type="radio"
                  name="export-format"
                  value="csv"
                  checked={exportFormat === "csv"}
                  onChange={() => setExportFormat("csv")}
                  className="h-4 w-4 border-primary text-primary focus:ring-ring"
                />
                CSV
              </label>
              <label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                <input
                  type="radio"
                  name="export-format"
                  value="pdf"
                  checked={exportFormat === "pdf"}
                  onChange={() => setExportFormat("pdf")}
                  className="h-4 w-4 border-primary text-primary focus:ring-ring"
                />
                PDF
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="export-date">
              {mode === "day" ? "Día" : "Cualquier día de la semana"}
            </Label>
            <Input
              id="export-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {selected.length === 0
              ? "No hay citas en ese rango."
              : `${selected.length} ${
                  selected.length === 1 ? "cita" : "citas"
                } en la ${getExportLabel(mode, range)}.`}
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleDownload} disabled={selected.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Descargar CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

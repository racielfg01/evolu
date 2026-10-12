"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getUsdRate, saveUsdRate } from "@/lib/actions/config.actions";

export function UsdRateSettings() {
  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsdRate().then((value) => setRate(String(value)));
  }, []);

  const handleSave = async () => {
    const value = Number.parseFloat(rate);
    if (Number.isNaN(value) || value < 0) {
      toast.error("Tasa inválida", {
        description: "Ingresa un número mayor o igual a 0",
      });
      return;
    }

    setLoading(true);
    const result = await saveUsdRate(value);
    setLoading(false);

    if (result.success) {
      toast("Precio del USD actualizado", {
        description: `1 USD = ${value}`,
      });
    } else {
      toast.error("Error al guardar la tasa", { description: result.error });
    }
  };

  return (
    <div className="flex flex-col gap-2 py-4 md:gap-4 md:py-6">
      <div className="flex flex-col mx-8">
        <h2 className="text-md font-bold">Moneda</h2>
        <p className="text-muted-foreground text-sm">
          Precio del dólar (USD) usado en la aplicación
        </p>
      </div>

      <div className="mx-8 flex max-w-sm flex-col gap-2">
        <Label htmlFor="usd-rate">Precio del USD</Label>
        <div className="flex gap-2">
          <Input
            id="usd-rate"
            type="number"
            min="0"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

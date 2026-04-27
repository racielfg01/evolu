import React from 'react';

export function AppointmentManager() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Gestor de Citas</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-medium">Juan Pérez</h3>
            <p className="text-sm text-gray-500">Hidratación Profunda - 2:00 PM</p>
          </div>
          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md">Confirmar</button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">María García</h3>
            <p className="text-sm text-gray-500">Masaje Terapéutico - 3:30 PM</p>
          </div>
          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md">Confirmar</button>
        </div>
      </div>
      <div className="mt-6">
        <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Nueva Cita
        </button>
      </div>
    </div>
  );
}
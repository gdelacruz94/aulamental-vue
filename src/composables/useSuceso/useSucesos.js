// src/composables/useSucesos.js
import { useLazyTable } from '@/composables/useLazyTable';
import SucesoService from '@/service/SucesoService';

export function useSucesos() {
  const loadData = async (page, rows, nombre) => {
    const { data } = await SucesoService.getSucesos(page, rows, nombre);
    return data;
  };

  const tabla = useLazyTable(loadData);

  async function crearSuceso(payload) {
    return SucesoService.createSuceso(payload);
  }

   return { ...tabla, crearSuceso };
}


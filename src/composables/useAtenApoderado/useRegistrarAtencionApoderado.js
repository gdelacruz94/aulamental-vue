import { registrarAtencionApoderado } from '@/service/AtencionApoderadosService'

export function useRegistrarAtencionApoderado() {
  const registrar = async ({
    idPsicologo,
    idApoderado,
    motivo,
    resumen,
    conclusiones,
    recomendaciones,
    intervencion,
    comentario
  }) => {
    try {
      const hoy = new Date().toISOString().split('T')[0]

      const body = {
        idpsicologo: idPsicologo,
        idApoderado,
        motivo,
        resumen,
        conclusiones,
        recomendaciones,
        intervencion,
        fecha: hoy,
        comentario
      }

      console.log('📤 Enviando body:', body)

      const { data } = await registrarAtencionApoderado(body)
      return data

    } catch (error) {
      console.error('❌ Error al registrar atención:', error.response?.data || error.message)
      throw error
    }
  }

  return { registrar }
}

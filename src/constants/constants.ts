export const constants = {
  SYSTEM_ID: 'frontEnd_bank',
  VERSION: '1.0.0-RELEASE',
  SERVICES: {
    PRODUCT_SERVICES: {
      APIV1: {
        PATH: '/bp/products',
        CONTROLLERS: {
          VERIFITCATION: '/verification',
        }
      }
    }
  },
  MESSAGES: {
    PRODUCTS:{
      ERROR_SERVICE:'Ha ocurrido un error al consumir el servicio, comuníquese con el equipo administrador.',
      NO_DATA: 'No existen datos para mostrar.',
      UPDATE: 'Persona modificada con éxito',
      DELETE: 'eliminada con éxito',
      CONFIRM_DELETE: '<br>¿Está seguro de eliminar este elemento?'
    },
  }
};

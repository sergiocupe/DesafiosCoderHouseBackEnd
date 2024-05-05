export const swaggerConfiguration = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación API de Ecommerce',
      description: 'Es una API de Ecommerce para CoderHouse'
    }
  },
  apis: ['src/docs/**/*.yaml']
};
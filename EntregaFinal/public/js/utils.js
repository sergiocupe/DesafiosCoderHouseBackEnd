let apiUrl = null;

const obtenerApiUrl = async () => {
  if (apiUrl === null) {
    try {
      const response = await fetch('/env');
      const envVariables = await response.json();
      apiUrl = envVariables.apiUrl;
    } catch (error) {
      console.error('Error fetching environment variables:', error);
      apiUrl = 'http://localhost:8080'; // URL predeterminada
      // Alternativamente, podrías lanzar una excepción para manejar errores en el lugar donde se llama a esta función
      // throw new Error('Error fetching environment variables');
    }
  }
  return apiUrl;
};
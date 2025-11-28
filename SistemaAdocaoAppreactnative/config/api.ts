// Conf centralizada da API
export const API_CONFIG = {
 BASE_URL: 'http://localhost:8000',  
  ENDPOINTS: {
    ANIMAIS: '/animal/',
    ONGS: '/ong/',  
    PESSOAS: '/pessoa/',
    ADOCOES: '/adocao/',
    AGENDAMENTOS: '/agendamento/',
    PAGAMENTOS: '/pagamento/',
    MONITORAMENTOS: '/monitoramento/',
    CAMPANHAS: '/campanha/',
  }
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

//  testar conexão
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ANIMAIS));
    return response.ok;
  } catch (error) {
    console.error('Erro na conexão:', error);
    return false;
  }
};
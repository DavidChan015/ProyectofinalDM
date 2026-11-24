import axios from 'axios';

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'
).replace(/\/+$/, '');

export interface PayloadFacial {
  nombre: string;
  image: string;
}

export const registrarRostro = async (payload: PayloadFacial): Promise<unknown> => {
  const response = await axios.post(`${API_BASE_URL}/api/faces/register`, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 35000,
  });
  return response.data;
};

export const verificarRostro = async (payload: PayloadFacial): Promise<unknown> => {
  const response = await axios.post(`${API_BASE_URL}/api/faces/verify`, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 35000,
  });
  return response.data;
};

// Define un tipo para la respuesta estandarizadaexpor
export type FormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>; 
};
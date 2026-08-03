// Helper for device identification and 6-digit access code generation

export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('simulador_device_id');
  if (!deviceId) {
    deviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('simulador_device_id', deviceId);
  }
  return deviceId;
};

export const generate6DigitCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const formatPhoneNumber = (phone: string): { cleanPhone: string; formattedPhone: string } => {
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 9 && !cleanPhone.startsWith('51')) {
    cleanPhone = '51' + cleanPhone;
  }
  const formattedPhone = '+' + cleanPhone;
  return { cleanPhone, formattedPhone };
};

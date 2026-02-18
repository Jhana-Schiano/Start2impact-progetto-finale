export const isEmailValid = (email: unknown): email is string => {
  if (typeof email !== "string" || email.trim() === "") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isPhoneValid = (phone: unknown): phone is string => {
  if (typeof phone !== "string" || phone.trim() === "") {
    return false;
  }

  const phoneRegex = /^[0-9\s\-+()]+$/;
  return phoneRegex.test(phone);
};

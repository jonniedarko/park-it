export function validatePhoneNumber(value: string): boolean {
  if (!value) return false;
  const phoneNum = ["(", ")", "+1", "-", " "].reduce(
    (str, ch) => str.replace(ch, ""),
    value,
  );
  const tenDigitPhoneNumberRegex = /^\d{10}$/;
  return tenDigitPhoneNumberRegex.test(phoneNum);
}

export function validateLicensePlate(value: string): boolean {
  const licensePlateRegex = /^[a-zA-Z0-9]{3,6}$/;
  return licensePlateRegex.test(value);
}

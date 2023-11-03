import { validatePhoneNumber, validateLicensePlate } from "./validators";

describe("validatePhoneNumber", () => {
  it("should return false for empty string", () => {
    expect(validatePhoneNumber("")).toBe(false);
  });

  it("should return true for valid phone numbers", () => {
    const validPhoneNumbers = [
      "+1 (123) 456-7890",
      "(123) 456-7890",
      "123-456-7890",
      "1234567890",
    ];
    validPhoneNumbers.forEach((phoneNumber) => {
      expect(validatePhoneNumber(phoneNumber)).toBe(true);
    });
  });

  it("should return false for invalid phone numbers", () => {
    const invalidPhoneNumbers = [
      "123-456-789",
      "234567890",
      "abc-123-4567",
      "+1 (123) 456-78901", // too long
    ];
    invalidPhoneNumbers.forEach((phoneNumber) => {
      expect(validatePhoneNumber(phoneNumber)).toBe(false);
    });
  });
});

describe("validateLicensePlate", () => {
  it("should return true for valid license plates", () => {
    const validLicensePlates = ["ABC123", "AB123", "A123", "123ABC", "1234AB"];
    validLicensePlates.forEach((licensePlate) => {
      expect(validateLicensePlate(licensePlate)).toBe(true);
    });
  });

  it("should return false for invalid license plates", () => {
    const invalidLicensePlates = [
      "AB", // too short
      "ABC1234", // too long
      "ABC-123", // contains a hyphen
      "AB 123", // contains a space
    ];
    invalidLicensePlates.forEach((licensePlate) => {
      expect(validateLicensePlate(licensePlate)).toBe(false);
    });
  });
});

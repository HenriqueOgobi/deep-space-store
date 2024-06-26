const cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;

describe('CPF Regex Validation', () => {
  test('valid CPF with dots and dash', () => {
    const validCpf = '123.456.789-09';
    expect(cpfRegex.test(validCpf)).toBe(true);
  });

  test('valid CPF without formatting', () => {
    const validCpf = '12345678909';
    expect(cpfRegex.test(validCpf)).toBe(true);
  });

  test('invalid CPF with incorrect length', () => {
    const invalidCpf = '123.456.789-0';
    expect(cpfRegex.test(invalidCpf)).toBe(false);
  });

  test('invalid CPF with letters', () => {
    const invalidCpf = '123.456.789-0a';
    expect(cpfRegex.test(invalidCpf)).toBe(false);
  });

  test('invalid CPF with special characters', () => {
    const invalidCpf = '123.456.789-@#';
    expect(cpfRegex.test(invalidCpf)).toBe(false);
  });
});

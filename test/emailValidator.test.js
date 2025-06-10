const isValidEmail = require('../src/emailValidator');

describe('Validação de e-mail', () => {
  test('E-mails válidos', () => {
    expect(isValidEmail('exemplo@email.com')).toBe(true);
    expect(isValidEmail('usuario123@dominio.org')).toBe(true);
    expect(isValidEmail('nome.sobrenome@empresa.co')).toBe(true);
  });

  test('E-mails inválidos', () => {
    expect(isValidEmail('')).toBe(false);                        // vazio
    expect(isValidEmail('texto-sem-arroba.com')).toBe(false);   // sem @
    expect(isValidEmail('usuario@')).toBe(false);               // sem domínio
    expect(isValidEmail('@dominio.com')).toBe(false);           // sem nome
    expect(isValidEmail('usuario@dominio')).toBe(false);        // sem TLD (.com)
    expect(isValidEmail('usu@rio@dominio.com')).toBe(false);    // dois @
    expect(isValidEmail('usuario@dominio..com')).toBe(false);   // dois pontos
  });
});

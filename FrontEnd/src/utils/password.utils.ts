/**
 * Générateur de mot de passe sécurisé par défaut
 * Comporte des majuscules, minuscules, chiffres et caractères spéciaux
 */
export const generateSecurePassword = (length = 12): string => {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Sans I, O pour éviter la confusion
  const lower = 'abcdefghijkmnopqrstuvwxyz'; // Sans l pour éviter la confusion
  const digits = '23456789'; // Sans 0, 1 pour lisibilité
  const symbols = '!@#$%&*+?-=';

  // Garantir au moins 1 caractère de chaque groupe
  const passwordChars = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    upper[Math.floor(Math.random() * upper.length)],
    digits[Math.floor(Math.random() * digits.length)],
  ];

  const allChars = upper + lower + digits + symbols;
  for (let i = passwordChars.length; i < length; i++) {
    passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Mélanger de manière aléatoire (Fisher-Yates)
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join('');
};

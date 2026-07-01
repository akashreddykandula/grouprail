import { customAlphabet } from 'nanoid';

// Uppercase alphanumeric, no ambiguous characters (0, O, I, l)
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const generateCode = customAlphabet(alphabet, 8);

export const generateInviteCode = () => {
  return generateCode();
};

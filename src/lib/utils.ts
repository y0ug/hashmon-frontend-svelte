/**
 * Processes a hash string by truncating it to 32 characters and determining its type based on length.
 * 
 * @param {string} hash - The hash string to process.
 * @returns {{ truncatedHash: string, type: string }}
 */
export function processHash(hash: string): { truncatedHash: string; type: string; } {
  // Determine the type based on length
  let type;
  switch (hash.length) {
    case 32:
      type = 'MD5';
      break;
    case 40:
      type = 'SHA1';
      break;
    case 64:
      type = 'SHA256';
      break;
    case 96:
      type = 'SHA384';
      break;
    case 128:
      type = 'SHA512';
      break;
    default:
      type = 'Unknown';
      break;
  }

  // Truncate the hash to 32 characters, adding ellipsis if it's longer
  const truncatedHash = hash.length > 32 ? `${hash.slice(0, 32)}...` : hash;

  return { truncatedHash, type };
}

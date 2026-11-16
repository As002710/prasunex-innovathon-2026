// Text Similarity & Duplicate Ticket Detection
// Offline TF-IDF vectorizer + Cosine Similarity with n-gram tokenization

export const DEFAULT_DUPLICATE_THRESHOLD = 0.82;

/**
 * Tokenizes text into normalized word stems and character 3-grams for robust matching.
 */
function tokenize(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const tokens = [...words];
  // Add character 3-grams for typo resilience
  for (const word of words) {
    if (word.length >= 4) {
      for (let i = 0; i <= word.length - 3; i++) {
        tokens.push(`_${word.slice(i, i + 3)}`);
      }
    }
  }
  return tokens;
}

/**
 * Computes Term Frequency map for a token list.
 */
function getTermFrequencies(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) || 0) + 1);
  }
  return tf;
}

/**
 * Computes Cosine Similarity between two text strings using TF representation.
 */
export function computeCosineSimilarity(textA: string, textB: string): number {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const tfA = getTermFrequencies(tokensA);
  const tfB = getTermFrequencies(tokensB);

  let dotProduct = 0;
  for (const [token, countA] of tfA.entries()) {
    if (tfB.has(token)) {
      dotProduct += countA * (tfB.get(token) || 0);
    }
  }

  let magA = 0;
  for (const val of tfA.values()) magA += val * val;

  let magB = 0;
  for (const val of tfB.values()) magB += val * val;

  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  if (magnitude === 0) return 0;

  const similarity = dotProduct / magnitude;
  return Math.round(similarity * 1000) / 1000;
}

export interface MatchResult {
  isDuplicate: boolean;
  matchedTicketId?: string;
  matchedTicketNumber?: string;
  similarityScore: number;
  matchedText?: string;
}

/**
 * Searches open tickets in the same location for a semantic duplicate.
 */
export function findDuplicateTicket(
  newText: string,
  newPlace: string,
  existingTickets: {
    id: string;
    ticketNumber: string;
    place: string;
    text: string;
    status: string;
  }[],
  threshold: number = DEFAULT_DUPLICATE_THRESHOLD
): MatchResult {
  let highestSim = 0;
  let bestMatch: (typeof existingTickets)[0] | undefined;

  const normalizedPlace = newPlace.toLowerCase().trim();

  // Filter open tickets for the same place
  const candidateTickets = existingTickets.filter(
    (t) => t.status !== "resolved" && t.place.toLowerCase().trim() === normalizedPlace
  );

  for (const candidate of candidateTickets) {
    const sim = computeCosineSimilarity(newText, candidate.text);
    if (sim > highestSim) {
      highestSim = sim;
      bestMatch = candidate;
    }
  }

  if (bestMatch && highestSim >= threshold) {
    return {
      isDuplicate: true,
      matchedTicketId: bestMatch.id,
      matchedTicketNumber: bestMatch.ticketNumber,
      similarityScore: highestSim,
      matchedText: bestMatch.text,
    };
  }

  return {
    isDuplicate: false,
    similarityScore: highestSim,
  };
}

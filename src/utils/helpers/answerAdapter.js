// Penerjemah jawaban antara bentuk UI dan bentuk API (lihat api-contract.md).
//   UI : { none, aspects: [{ key, sentiment: "Positif" | "Netral" | "Negatif" | "" }] }
//   API: { aspect: [{ aspect, sentiment: "positive" | "neutral" | "negative" | null }],
//          informative: true | false | null }

const SENTIMENT_TO_API = {
  Positif: "positive",
  Netral: "neutral",
  Negatif: "negative",
};

const SENTIMENT_FROM_API = {
  positive: "Positif",
  neutral: "Netral",
  negative: "Negatif",
};

export const toApiAnswer = (answer) => {
  if (answer.none) return { aspect: [], informative: false };

  if (answer.aspects.length > 0) {
    return {
      aspect: answer.aspects.map((a) => ({
        aspect: a.key,
        sentiment: SENTIMENT_TO_API[a.sentiment] ?? null,
      })),
      informative: true,
    };
  }

  // Tanpa aspek dan tanpa centang: jawaban dikosongkan.
  return { aspect: [], informative: null };
};

export const fromApiAnswer = (answer) => {
  if (answer.informative === false) return { none: true, aspects: [] };

  if (answer.informative === true) {
    return {
      none: false,
      aspects: answer.aspect.map((a) => ({
        key: a.aspect,
        sentiment: SENTIMENT_FROM_API[a.sentiment] ?? "",
      })),
    };
  }

  return { none: false, aspects: [] };
};
export const isAnswerDone = (answer) =>
  answer.none ||
  (answer.aspects.length > 0 && answer.aspects.every((a) => a.sentiment));

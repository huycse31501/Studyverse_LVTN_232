export function minQuestionsToPass(
  passScoreStr: string,
  totalQuestions: number
) {
  const passScore = parseInt(passScoreStr, 10);

  const pointsPerQuestion = 10 / totalQuestions;

  const minQuestionsToPass = Math.ceil(passScore / pointsPerQuestion);

  return minQuestionsToPass;
}

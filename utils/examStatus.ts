import { isEmpty } from "lodash";

export function calculateCorrectAnswers(
  submissions: any[],
  questions: any[]
): string | undefined {
  if (submissions.length === 0) {
    return undefined;
  }

  let correctAnswersCount = 0;
  const submission = submissions[submissions.length - 1];
  const { answers } = submission;

  for (let key in answers) {
    let answer = answers[key];
    if (answer.isPass === 0) {
      return undefined;
    }
    if (answer.isPass === 1) {
      correctAnswersCount++;
    } else if (answer.isPass === -1) {
      continue;
    } else {
      let question = questions.find((q: any) => q.id.toString() === key);
      if (question && question.correctChoice.content === answer.content) {
        correctAnswersCount++;
      }
    }
  }
  const grade = (correctAnswersCount * 10) / questions.length;
  return `${grade}/10`;
}
export function getExamStatus(
  submissions: any,
  questions: any,
  correctAnswerToPass: any
) {
  if (submissions.length === 0) {
    return "pending";
  }
  let totalQuestions = questions.length;
  let correctAnswersCount = 0;
  const submission = submissions[submissions.length - 1];
  const { answers } = submission;
  if (isEmpty(answers)) {
    let question = questions.find((q: any) => q.type === 2);
    if (question) {
      return "grading"
    }
  }
  for (let key in answers) {
    let answer = answers[key];
    if (answer.isPass === 0) {
      return "grading";
    }
    if (answer.isPass === 1) {
      correctAnswersCount++;
    } else if (answer.isPass === -1) {
      continue;
    } else {
      let question = questions.find((q: any) => q.id.toString() === key);
      if (
        question.type === 1 &&
        question.correctChoice.content === answer.content
      ) {
        correctAnswersCount++;
      }
    }
  }
  if (correctAnswersCount >= correctAnswerToPass) {
    return "completed";
  } else {
    return "failed";
  }
}

export function getExamStatusForHistory(
  submission: any,
  questions: any,
  correctAnswerToPass: any
) {
  let correctAnswersCount = 0;

  const { answers } = submission;
  if (isEmpty(answers)) {
    let question = questions.find((q: any) => q.type === 2);
    if (question) {
      return "grading"
    }
  }
  for (let key in answers) {
    let answer = answers[key];
    if (answer.isPass === 0) {
      return "grading";
    }
    if (answer.isPass === 1) {
      correctAnswersCount++;
    } else if (answer.isPass === -1) {
      continue;
    } else {
      let question = questions.find((q: any) => q.id.toString() === key);
      if (question && question.correctChoice.content === answer.content) {
        correctAnswersCount++;
      }
    }
  }
  if (correctAnswersCount >= correctAnswerToPass) {
    return "pass";
  } else {
    return "fail";
  }
}

export function CountCorrectAnswer(submission: any, questions: any) {
  let correctAnswersCount = 0;

  const { answers } = submission;
  for (let key in answers) {
    let answer = answers[key];
    if (answer.isPass === 0 || answer.isPass === -1) {
      continue;
    }
    if (answer.isPass === 1) {
      correctAnswersCount++;
    } else {
      let question = questions.find((q: any) => q.id.toString() === key);
      if (question && question.correctChoice.content === answer.content) {
        correctAnswersCount++;
      }
    }
  }
  return correctAnswersCount;
}

export function CountCorrectAnswerForDashboard(answers: any, questions: any) {
  let correctAnswersCount = 0;

  for (let key in answers) {
    let answer = answers[key];
    if (answer.choiceId === null) {
      continue;
    } else {
      let question = questions.find(
        (q: any) => q.id.toString() === answer.id.toString()
      );

      if (question && question.correctChoice.id === answer.choiceId) {
        correctAnswersCount++;
      }
    }
  }
  return correctAnswersCount;
}

export function getExamStatusForHistoryForDashboard(
  answers: any,
  questions: any,
  correctAnswerToPass: any
) {
  let correctAnswersCount = 0;
  for (let key in answers) {
    let answer = answers[key];
    if (answer.choiceId === null) {
      return "grading";
    } else {
      let question = questions.find(
        (q: any) => q.id.toString() === answer.id.toString()
      );

      if (question && question.correctChoice.id === answer.choiceId) {
        correctAnswersCount++;
      }
    }
  }
  if (correctAnswersCount >= correctAnswerToPass) {
    return "pass";
  } else {
    return "fail";
  }
}

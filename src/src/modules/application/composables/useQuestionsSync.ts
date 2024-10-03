import { useMutation } from "@vue/apollo-composable";
import questionsSync from "../graphql/syncQuestions.mutation.gql";

export type QuestionInput = {
  points: number | null;
  expert_comment: string;
  user_application_questionnaire: {
    id: number;
  };
};

export type QuestionInputProjects = {
  id: number;
  expert_comment: string;
};

type QuestionsSyncInput = {
  userQuestionScorings: QuestionInput[];
  projects: QuestionInputProjects[];
};

export const useQuestionsSync = () => {
  const { mutate: syncQuestions, loading, onError } = useMutation<{ userQuestionScoring: QuestionInput[] }, { userQuestionScoringsSync: QuestionsSyncInput }>(questionsSync);

  return {
    syncQuestions,
    onError,
    loading,
  };
};

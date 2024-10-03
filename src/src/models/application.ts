import { type Document, type User } from ".";
import { type STATUS_VALUE_TYPE } from "@/modules/application/constants/status";

export type ResponsibleUser = {
  id: number;
  user: User;
  user_application: {
    id: number;
  };
};

export type ApplicationSelf = {
  id: number;
  name: string;
};

export type Application = {
  id: number;
  user: User;
  user_application_responsibles: ResponsibleUser;
  application: ApplicationSelf;
  status: STATUS_VALUE_TYPE;
  created_at: string;
  is_edited: boolean;
};

export type ApplicationQuestionAnswer = {
  id: number;
  question: {
    id: number;
    text: string;
  };
  answer: {
    id: number;
    text: string;
  };
  company_comment: string;
  user_question_scoring: {
    id?: number;
    expert_comment: string;
    points: number | null;
  };
  questionIndex?: number;
  value: string | null;
  documents: Document[];
  is_edited: boolean;
};

export type ApplicationRes = {
  points: number | null;
  expert_comment: string;
  user_application_questionnaire: number | null;
};

export type ApplicationCannedAnswer = {
  id: number;
  points: number | null;
  text: string;
};

export type ApplicationQuestion = {
  id: number;
  user_application_questionnaires: ApplicationQuestionAnswer[];
  question_canned_answers: ApplicationCannedAnswer[];
  text: string;
  system_name: string;
};

export type ApplicationProject = {
  id: number;
  name: string;
  description: string;
  expert_comment: string;
  date_start: string;
  date_end: string;
  place: string;
  investment_volume: string;
  project_direction: {
    id: number;
    name: string;
  };
  documents: Document[];
};

export type Area = {
  id: number;
  name: string;
  description: string;
  application_area_questions: ApplicationQuestion[];
  children: Area[];
  projects: ApplicationProject[];
};

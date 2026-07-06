export interface UserState {
  username: string;
  mockRole: "Student" | "Tutor" | "Admin";
  totalPoints: number;
  globalRank: number;
}

export interface Step {
  stepIndex: number;
  prompt: string;
  expectedInput: string;
}

export interface BlankLine {
  lineIndex: number;
  textBefore: string;
  blankValue: string;
  textAfter: string;
}

export interface Problem {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  author: string;
  format: "typing" | "blanks";
  instructions: string;
  steps?: Step[];
  blankLines?: BlankLine[];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  accuracy: string;
}

export interface AppState {
  currentUserState: UserState;
  problems: Problem[];
  leaderboard: LeaderboardEntry[];
}

export type RobotTest = {
  name: string;
  id: string;
};

export type RobotState = {
  failedTests: RobotTest[];
  currentTest: RobotTest | null;
  currentTestIndex: number;
  totalFailedTestCount: number;
  isLoading: boolean;
  goToPreviousTest: () => void;
  goToNextTest: () => void;
};

export interface RestRequestData {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
}

export type RobotTest = {
  name: string;
  id: string;
};

export type RobotState = {
  failedTests: RobotTest[];
  currentTest: RobotTest | null;
  currentTestIndex: number;
  totalFailedTestCount: number;
  isPageLoaded: boolean;
  goToPreviousTest: () => void;
  goToNextTest: () => void;
};

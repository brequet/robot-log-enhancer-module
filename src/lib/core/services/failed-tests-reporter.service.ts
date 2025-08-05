import type { RobotTest } from "../types";

export function formatTestsAsRobotParams(failedTests: RobotTest[]): string {
  return failedTests
    .map((robotTest) => `--test "${robotTest.name}"`)
    .join(" ")
    .trim();
}

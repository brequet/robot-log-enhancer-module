import type { RobotTest } from "$lib/features/robot-log/robot.types";

export function formatTestsAsRobotParams(failedTests: RobotTest[]): string {
  return failedTests
    .map((robotTest) => `--test "${robotTest.name}"`)
    .join(" ")
    .trim();
}

import type { CodeSnippet, RestRequestData } from "../types";

const PARSER_REGEX = {
  URL: /url=(https?:\/\/\S+)/,
  METHOD: /(GET|POST|PUT|DELETE|PATCH)\s+Request/i,
  HEADERS: /headers=({.*?})/,
  BODY: /body=b'([\s\S]*?)'/,
};

const HEADERS_TO_IGNORE: Set<string> = new Set([
  "Content-Length",
  "Connection",
  "Host",
  "User-Agent",
]);

/**
 * Parses a raw text log to extract structured request data.
 * @param text The raw string containing the request details.
 * @returns A structured RestRequestData object or null if parsing fails.
 */
function parseRestRequest(text: string): RestRequestData | null {
  try {
    const urlMatch = PARSER_REGEX.URL.exec(text);
    const methodMatch = PARSER_REGEX.METHOD.exec(text);
    const headersMatch = PARSER_REGEX.HEADERS.exec(text);
    const bodyMatch = PARSER_REGEX.BODY.exec(text);

    if (!urlMatch || !methodMatch) {
      console.warn("Could not find required URL or Method in the input text.");
      return null;
    }

    const [, url] = urlMatch;
    const [, method] = methodMatch;
    const body = bodyMatch ? bodyMatch[1] : "";
    let headers: Record<string, string> = {};

    if (headersMatch) {
      // The header string is not valid JSON (uses single quotes).
      const headerJsonString = headersMatch[1].replace(/'/g, '"');
      const allHeaders = JSON.parse(headerJsonString);

      headers = Object.fromEntries(
        Object.entries(allHeaders).filter(
          ([key]) => !HEADERS_TO_IGNORE.has(key)
        ) as Array<[string, string]>
      );
    }

    return { url, method, headers, body };
  } catch (error) {
    console.error("Error parsing REST request data:", error);
    return null;
  }
}

/**
 * Converts request data to a PowerShell 7 command using Invoke-RestMethod.
 * @param data The structured request data.
 * @returns A string containing the PowerShell 7 command.
 */
function convertToPowerShell7(data: RestRequestData): string {
  const commandParts: string[] = [
    "Invoke-RestMethod",
    `-Method ${data.method}`,
    `-Uri '${data.url}'`,
  ];

  if (Object.keys(data.headers).length > 0) {
    const headerEntries = Object.entries(data.headers)
      .map(([key, value]) => `  '${key}' = '${value}'`)
      .join(";\n");
    commandParts.push(`-Headers @{\n${headerEntries}\n}`);
  }

  if (data.body) {
    if (data.headers["Content-Type"]) {
      commandParts.push(`-ContentType '${data.headers["Content-Type"]}'`);
    }
    commandParts.push(`-Body @'\n${data.body}\n'@`);
  }

  return commandParts.join(" `\n");
}

/**
 * Converts request data to a PowerShell 5 command using Invoke-RestMethod.
 * @param data The structured request data.
 * @returns A string containing the PowerShell 7 command.
 */
function convertToPowerShell5(data: RestRequestData): string {
  const commandParts: string[] = [
    "Invoke-WebRequest",
    `-Method ${data.method}`,
    `-Uri '${data.url}'`,
  ];

  if (Object.keys(data.headers).length > 0) {
    const headerEntries = Object.entries(data.headers)
      .map(([key, value]) => `  '${key}' = '${value}'`)
      .join(";\n");
    commandParts.push(`-Headers @{\n${headerEntries}\n}`);
  }

  if (data.body) {
    if (data.headers["Content-Type"]) {
      commandParts.push(`-ContentType '${data.headers["Content-Type"]}'`);
    }
    // Using a "here-string" is safe and works in PS5 as well.
    commandParts.push(`-Body @'\n${data.body}\n'@`);
  }

  return commandParts.join(" `\n");
}

/**
 * Converts request data to a Windows CMD command using curl.exe.
 * @param data The structured request data.
 * @returns A string containing the Windows CMD command.
 */
function convertToCmd(data: RestRequestData): string {
  const commandParts: string[] = [
    `curl -X ${data.method}`,
    `"${data.url}"`,
  ];

  if (Object.keys(data.headers).length > 0) {
    const headerParts = Object.entries(data.headers)
      .map(([key, value]) => `-H "${key}: ${value}"`);
    commandParts.push(...headerParts);
  }

  if (data.body) {
    const escapedBody = data.body.replace(/"/g, '\\"');
    commandParts.push(`-d "${escapedBody}"`);
  }

  return commandParts.join(" ");
}

interface Converter {
  fileType: string;
  generate: (data: RestRequestData) => string;
}

const CONVERTERS: Converter[] = [
  { fileType: "PowerShell 5", generate: convertToPowerShell5 },
  { fileType: "PowerShell 7", generate: convertToPowerShell7 },
  { fileType: "CMD", generate: convertToCmd },
];

/**
 * The main service function that orchestrates parsing and command generation.
 * @param text The raw string containing the request details.
 * @returns An array of generated code snippets.
 */
export function generateCurlCommands(text: string): CodeSnippet[] {
  const data = parseRestRequest(text);

  if (!data) {
    return [{ fileType: "Error", text: "Could not parse request data. Check console for details." }];
  }

  return CONVERTERS.map(({ fileType, generate }) => ({
    fileType,
    text: generate(data),
  }));
}

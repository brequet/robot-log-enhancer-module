import type { RestRequestData } from "../types";

function parseRestRequest(text: string): RestRequestData | null {
  try {
    const urlMatch = /url=(https?:\/\/\S+)/.exec(text);
    const methodMatch = /(GET|POST|PUT|DELETE|PATCH)\s+Request/i.exec(text);
    const headersMatch = /headers=({[^}]+})/.exec(text);
    const bodyMatch = /body=b'([\s\S]*)'/.exec(text);

    if (!urlMatch || !methodMatch) return null;

    let headers = {};
    if (headersMatch) {
      const headerText = headersMatch[1]
        .replace(/'/g, '"')
        .replace(/:\s/g, ": ");
      headers = JSON.parse(headerText);
    }

    return {
      url: urlMatch[1],
      method: methodMatch[1],
      headers,
      body: bodyMatch ? bodyMatch[1] : "",
    };
  } catch (e) {
    console.error("Error parsing REST request data:", e);
    return null;
  }
}

export function convertToPowerShellCurl(text: string): string {
  const data = parseRestRequest(text);
  if (!data) return "Error: Could not parse request data.";

  let powershellCmd = `Invoke-RestMethod -Method ${data.method} \`\n-Uri '${data.url}'`;

  if (Object.keys(data.headers).length > 0) {
    const headerString = Object.entries(data.headers)
      .map(([key, value]) => `'${key}'='${value}'`)
      .join("\n ");
    powershellCmd += ` \`\n-Headers @{\n ${headerString}\n}`;
  }

  powershellCmd += ` \`\n-SkipCertificateCheck`;

  if (data.body) {
    if (data.headers["Content-Type"]) {
      powershellCmd += ` \`\n-ContentType '${data.headers["Content-Type"]}'`;
    }
    powershellCmd += ` \`\n-Body '${data.body}'`;
  }

  return powershellCmd;
}

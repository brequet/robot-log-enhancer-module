export function getFailedTestsElementFromPage(): HTMLElement[] {
  return [...document.getElementsByClassName("test")].filter((htmlElement) => {
    const headerLeft = htmlElement.querySelector(
      ".element-header-left"
    ) as HTMLElement;
    return headerLeft?.title.includes("FAIL") ?? false;
  }) as HTMLElement[];
}

export function getNumberOfFailedTestsFromPage(): number {
  const totalStatsRow = document.querySelector("#total-stats > tbody > tr");
  if (!totalStatsRow) return 0;

  return Number(totalStatsRow.childNodes[5].textContent);
}

export function convertToPowerShellCurl(text: string) {
  const urlMatch = RegExp(/url=(https?:\/\/\S+)/).exec(text);
  const url = urlMatch ? urlMatch[1] : '';

  const methodMatch = RegExp(/(GET|POST|PUT|DELETE|PATCH)\s+Request/i).exec(text);
  const method = methodMatch ? methodMatch[1] : '';

  const headersMatch = RegExp(/headers=({[^}]+})/).exec(text);
  let headers = {};
  if (headersMatch) {
    try {
      // Convert the Python-style dict to JSON format
      const headerText = headersMatch[1]
        .replace(/'/g, '"')
        .replace(/:\s/g, ': ');
      headers = JSON.parse(headerText);
    } catch (e) {
      console.error('Error parsing headers:', e);
    }
  }

  const bodyMatch = RegExp(/body=b'(.+)'/).exec(text);
  let body = '';
  if (bodyMatch) {
    try {
      body = bodyMatch[1];
    } catch (e) {
      console.error('Error parsing body:', e);
    }
  }

  let powershellCmd = `Invoke-RestMethod -Method ${method} \`\n-Uri '${url}'`;

  if (Object.keys(headers).length > 0) {
    const headerString = Object.entries(headers)
      .map(([key, value]) => `'${key}'='${value}'`)
      .join('\n ');
    powershellCmd += ` \`\n-Headers @{\n ${headerString}\n}`;
  }

  powershellCmd += ` \`\n-SkipCertificateCheck`

  if (body) {
    if (headers['Content-Type']) {
      powershellCmd += ` \`\n-ContentType '${headers['Content-Type']}'`;
    }
    powershellCmd += ` \`\n-Body '${body}'`;
  }

  return powershellCmd;
}

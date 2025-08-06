export interface RestRequestData {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
}

export type CodeSnippet = {
  fileType: string;
  text: string;
};

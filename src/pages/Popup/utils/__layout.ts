export const extractDomainFromUrl = (url: string): string | null => {
  // Regular expression to match the domain in a URL
  const domainRegex = /:\/\/(www\.)?([^/]+)\//;

  // Use the exec method to search for the pattern in the URL
  const match = domainRegex.exec(url);

  if (match && match[2]) {
    // match[2] contains the domain
    return match[2];
  } else {
    // No match found, return null
    return null;
  }
}
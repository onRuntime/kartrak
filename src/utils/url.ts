export const cleanUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.search = "";
    parsedUrl.hash = "";
    return parsedUrl.toString();
  } catch (error) {
    return url; // Return the original URL or handle the error as needed
  }
};

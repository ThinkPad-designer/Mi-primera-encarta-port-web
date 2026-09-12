// Encarta's Windows URLs are case-insensitive, including the shared quiz bank.
export function contentRewriteRules(files: string[], activityId: string, base: string): [RegExp, string][] {
  return files
    .filter(path => path.startsWith(`dswmedia/iaf/e/${activityId}/`) ||
      path.startsWith('dswmedia/shared/') || path.startsWith('dswmedia/quiz/'))
    .map(path => {
      const url = new URL(path, base).href;
      return [new RegExp('^' + url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i'), url];
    });
}

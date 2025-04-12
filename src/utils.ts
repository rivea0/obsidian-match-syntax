import nlp from 'compromise/two';
import { IOffsetOutput, IRange } from './types';
import type { Text } from '@codemirror/state';

export function getMatchRanges(docEl: Text, textToMatch: string): IRange[] {
  const ranges: IRange[] = [];
  const lineCount = docEl.lines;

  for (let lineIdx = 0; lineIdx < lineCount; lineIdx++) {
    // Line numbers are 1-based
    const lineObj = docEl.line(lineIdx + 1);
    const offsets = getMatchOffsets(lineObj.text, textToMatch);
    for (const matchEl of offsets) {
      ranges.push({
        from: lineObj.from + matchEl.offset.start,
        to: lineObj.from + matchEl.offset.start + matchEl.offset.length,
      });
    }
  }

  return ranges;
}

function getMatchOffsets(
  docText: string,
  matchSyntax: string
): IOffsetOutput[] {
  const doc = nlp(docText);
  const results = doc.match(matchSyntax).out('offset');

  return results;
}

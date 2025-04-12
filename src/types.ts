export interface MatchSyntaxPluginSettings {
  showNumberOfMatchesNotification: boolean;
}

export interface IOffsetOutput {
  text: string,
  terms: {
    text: string,
    pre: string,
    post: string,
    tags: string[],
    normal: string,
    index: number[],
    id: string,
    chunk: string,
    dirty: boolean,
    offset: IOffset
  }[],
  offset: IOffset
}

export interface IRange {
  from: number,
  to: number
}

interface IOffset {
  index: number,
  start: number,
  length: number
}

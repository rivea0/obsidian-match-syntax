export default class MatchSyntaxString {
  str: string;

  constructor(str = '') {
    this.str = str;
  }

  getValue() {
    return this.str;
  }

  setValue(newValue: string) {
    this.str = newValue;
  }

  clearValue() {
    this.str = '';
  }
}

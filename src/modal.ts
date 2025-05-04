import { App, Modal, Setting } from 'obsidian';

export class MatchTextModal extends Modal {
  constructor(app: App, onSubmit: (textToMatch: string) => void) {
    super(app);
    this.setTitle('Enter match syntax: ');

    let matchStr = '';
    const settingContent = this.contentEl;

    const matchInput = new Setting(settingContent);
    matchInput.setClass('match-syntax-input-setting');
    matchInput.addText((text) => {
      text.inputEl.addClass('match-syntax-input-element');
      text.setPlaceholder('#adverb+ good...');
      text.onChange((value) => {
        matchStr = value;
      });
    });

    new Setting(settingContent).addButton((btn) =>
      btn
        .setButtonText('Find matches')
        .setCta()
        .onClick(() => {
          this.close();
          onSubmit(matchStr);
        })
    );
  }
}

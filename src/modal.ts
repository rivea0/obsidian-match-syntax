import { App, Modal, Setting } from 'obsidian';
import type { KeymapEventHandler } from 'obsidian';

export class MatchTextModal extends Modal {
  #keymapEvtHandler: KeymapEventHandler | null = null;
  constructor(app: App, onSubmit: (textToMatch: string) => void) {
    super(app);
    this.setTitle('Enter match syntax: ');
    this.#keymapEvtHandler = this.scope.register([], 'Enter', (evt: KeyboardEvent) => {
      if (evt.isComposing) {
        return;
      }
      evt.preventDefault();
      const findMatchesBtn = document
        .getElementsByClassName('mod-cta')
        .item(0) as HTMLButtonElement | null;
      if (findMatchesBtn) {
        findMatchesBtn.click();
      }
    });

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

  onClose(): void {
    if (this.#keymapEvtHandler) {
      this.scope.unregister(this.#keymapEvtHandler);
      this.#keymapEvtHandler = null;
    }
  }
}

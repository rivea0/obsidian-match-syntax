import { App, PluginSettingTab, Setting } from 'obsidian';
import MatchSyntaxPlugin from './main';

let keepHighlights = false;

export class MatchSyntaxSettingTab extends PluginSettingTab {
  plugin: MatchSyntaxPlugin;

  constructor(app: App, plugin: MatchSyntaxPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Notify the number of matches found')
      .setDesc(
        'The number of match results will be shown in a notification when you search for a match syntax'
      )
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.showNumberOfMatchesNotification)
          .onChange(async (value) => {
            this.plugin.settings.showNumberOfMatchesNotification = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Manually clear the highlights')
      .setDesc(
        'Do not automatically clear highlights when there is a change in the editor'
      )
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.manuallyClearHighlights)
          .onChange(async (value) => {
            this.plugin.settings.manuallyClearHighlights = value;
            await this.plugin.saveSettings();
            keepHighlights = !keepHighlights;
          });
      });
  }
}

export { keepHighlights };

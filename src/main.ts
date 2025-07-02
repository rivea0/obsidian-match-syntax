import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { EditorView, ViewPlugin, Decoration } from '@codemirror/view';
import { MatchTextModal } from './modal';
import { getMatchRanges } from './utils';
import MatchSyntaxString from './syntaxObj';
import type { PluginValue, DecorationSet, PluginSpec } from '@codemirror/view';
import type { MatchSyntaxPluginSettings, IRange } from './types';

const DEFAULT_SETTINGS: MatchSyntaxPluginSettings = {
  showNumberOfMatchesNotification: true,
};

const SYNTAX = new MatchSyntaxString();

export default class MatchSyntaxPlugin extends Plugin {
  settings: MatchSyntaxPluginSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new MatchSyntaxSettingTab(this.app, this));

    const highlightViewPlugin = ViewPlugin.fromClass(
      HighlighterPlugin,
      pluginSpec
    );
    this.registerEditorExtension(highlightViewPlugin);

    this.addCommand({
      id: 'enter-match-syntax',
      name: 'Enter match syntax',
      editorCallback: (editor) => {
        // @ts-expect-error
        const cm6Editor: EditorView = editor.cm;
        const plugin = cm6Editor.plugin(highlightViewPlugin);
        const docEl = cm6Editor.state.doc;
        new MatchTextModal(this.app, (textToMatch) => {
          SYNTAX.setValue(textToMatch);
          const ranges = getMatchRanges(docEl, SYNTAX.getValue());
          if (plugin) {
            plugin.makeDeco(ranges);
          }
          if (this.settings.showNumberOfMatchesNotification) {
            const numberOfMatches = ranges.length
            new Notice(`${numberOfMatches} match${numberOfMatches === 1 ? '' : 'es'} found.`);
          }
        }).open();
      },
    });

    this.addCommand({
      id: 'clear-match-highlights',
      name: 'Clear match highlights',
      editorCallback: (editor) => {
        // @ts-expect-error
        const cm6Editor: EditorView = editor.cm;
        const plugin = cm6Editor.plugin(highlightViewPlugin);
        if (plugin) {
          if (plugin.decorations === Decoration.none) {
            new Notice('No decorations found!');
          } else {
            SYNTAX.clearValue();
            plugin.clearDeco();
          }
        }
      }
    });
  }

  onunload() {
    SYNTAX.clearValue();
    if (import.meta.env.MODE === 'development') {
      console.log('unloading plugin');
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class MatchSyntaxSettingTab extends PluginSettingTab {
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
  }
}

class HighlighterPlugin implements PluginValue {
  decorations: DecorationSet;
  constructor(view: EditorView) {
    this.decorations = Decoration.none;
  }
  makeDeco(ranges: IRange[]) {
    const deco = [];
    const highlightDeco = Decoration.mark({
      class: 'match-syntax-highlight-text',
      attributes: { 'data-contents': 'string' },
    });

    for (const rangeObj of ranges) {
      deco.push(highlightDeco.range(rangeObj.from, rangeObj.to));
    }
    this.decorations = Decoration.set(deco);
  }

  clearDeco() {
    this.decorations = Decoration.none;
  }
}

const pluginSpec: PluginSpec<HighlighterPlugin> = {
  decorations: (value: HighlighterPlugin) => value.decorations,
};

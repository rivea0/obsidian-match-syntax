import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { EditorView, ViewPlugin, Decoration } from '@codemirror/view';
import { MatchTextModal } from './modal';
import { getMatchRanges } from './utils';
import type { PluginValue, DecorationSet, PluginSpec } from '@codemirror/view';
import type { MatchSyntaxPluginSettings, IRange } from './types';

const DEFAULT_SETTINGS: MatchSyntaxPluginSettings = {
  showHighlightsOnReadingView: false,
};

export default class MatchSyntaxPlugin extends Plugin {
  settings: MatchSyntaxPluginSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new MatchSyntaxSettingTab(this.app, this));
    console.log(this.settings.showHighlightsOnReadingView);

    const highlightViewPlugin = ViewPlugin.fromClass(
      HighlighterPlugin,
      pluginSpec
    );
    this.registerEditorExtension(highlightViewPlugin);

    this.addCommand({
      id: 'enter-match-syntax',
      name: 'Enter match syntax',
      checkCallback: (checking: boolean) => {
        const markdownView =
          this.app.workspace.getActiveViewOfType(MarkdownView);
        let cm6Editor: EditorView;
        if (markdownView) {
          if (!checking) {
            // @ts-expect-error
            cm6Editor = markdownView.editor.cm;
            const plugin = cm6Editor.plugin(highlightViewPlugin);
            const docEl = cm6Editor.state.doc;
            new MatchTextModal(this.app, (textToMatch) => {
              const ranges = getMatchRanges(docEl, textToMatch);
              if (plugin) {
                plugin.makeDeco(ranges);
              }
            }).open();
          }
          return true;
        }
      },
    });

    this.addCommand({
      id: 'clear-match-highlights',
      name: 'Clear match highlights',
      checkCallback: (checking: boolean) => {
        const markdownView =
          this.app.workspace.getActiveViewOfType(MarkdownView);
        let cm6Editor: EditorView;
        if (markdownView) {
          if (!checking) {
            // @ts-expect-error
            cm6Editor = markdownView.editor.cm;
            const plugin = cm6Editor.plugin(highlightViewPlugin);
            if (plugin) {
              plugin.clearDeco();
            }
          }
          return true;
        }
      },
    });
  }

  onunload() {
    console.log('unloading plugin');
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
      .setName('Show highlights on reading view')
      .setDesc('The match results will show both in editing and reading views')
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.showHighlightsOnReadingView)
          .onChange(async (value) => {
            this.plugin.settings.showHighlightsOnReadingView = value;
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
      class: 'highlight-text',
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

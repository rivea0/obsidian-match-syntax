import {
  App,
  MarkdownView,
  Modal,
  Plugin,
  PluginSettingTab,
  Setting,
} from 'obsidian';
import { EditorView, ViewPlugin, Decoration } from '@codemirror/view';
import nlp from 'compromise/two';
import type { PluginValue, DecorationSet, PluginSpec } from '@codemirror/view';
import type { MatchSyntaxPluginSettings, IOffsetOutput, IRange } from './types';

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
            const lineCount = docEl.lines;
            const ranges: IRange[] = [];
            new MatchTextModal(this.app, (textToMatch) => {
              for (let lineIdx = 0; lineIdx < lineCount; lineIdx++) {
                // Line numbers are 1-based
                const lineObj = docEl.line(lineIdx + 1);
                const doc = nlp(lineObj.text);
                const m: IOffsetOutput[] = doc.match(textToMatch).out('offset');
                for (const matchEl of m) {
                  ranges.push({
                    from: lineObj.from + matchEl.offset.start,
                    to:
                      lineObj.from +
                      matchEl.offset.start +
                      matchEl.offset.length,
                  });
                }
              }
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

class MatchTextModal extends Modal {
  constructor(app: App, onSubmit: (textToMatch: string) => void) {
    super(app);
    this.setTitle('Enter match syntax: ');

    let matchStr = '';
    const settingContent = this.contentEl;

    const matchInput = new Setting(settingContent);
    matchInput.setClass('match-input-setting');
    matchInput.addText((text) => {
      text.inputEl.addClass('match-input');
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

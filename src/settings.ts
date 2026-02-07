import { App, Plugin, PluginSettingTab, Setting, normalizePath } from 'obsidian';


export interface LinkMonitorSettings {
	linkBookmarkFilePath: string;
	clippingFolder: string;
	lavaServerUrl: string;
	useExternalService: boolean;
	stabilityThresholdSeconds: number;
	watchDailyNote?: boolean;
	dailyNotePath: string;
	dailyNoteFormat: string;
	blockedDomains: string;
	defaultTags: string;
	parserType: string;
}

export const DEFAULT_SETTINGS: LinkMonitorSettings = {
	linkBookmarkFilePath: 'lava/bookmarks.md',
	clippingFolder: 'lava',
	lavaServerUrl: 'https://lava-linkstash.onrender.com/api',
	useExternalService: false,
	stabilityThresholdSeconds: 2,
	watchDailyNote: false,
	dailyNotePath: 'Daily',
	dailyNoteFormat: 'YYYY-MM-DD',
	blockedDomains: 'docs.google.com,sheets.google.com,sites.google.com,drive.google.com',
	defaultTags: 'clippings',
	parserType: 'jsdom'
}

export interface LinkMonitorPluginInterface {
	settings: LinkMonitorSettings;
	saveSettings(): Promise<void>;
	stabilityThresholdMs: number;
}

export class LinkMonitorSettingTab extends PluginSettingTab {
	plugin: LinkMonitorPluginInterface;

	constructor(app: App, plugin: Plugin) {
		super(app, plugin);
		this.plugin = plugin as unknown as LinkMonitorPluginInterface;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Link bookmark file')
			.setDesc('Path to the Markdown file containing links to monitor and process (relative to vault root)')
			.addText(text => text
				.setPlaceholder('Bookmarks.md')
				.setValue(this.plugin.settings.linkBookmarkFilePath)
				.onChange(async (value: string) => {
					this.plugin.settings.linkBookmarkFilePath = normalizePath(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Processing delay seconds')
			.setDesc('Delay after file changes before processing links to avoid processing incomplete edits')
			.addSlider(slider => slider
				.setLimits(1, 10, 1)
				.setValue(this.plugin.settings.stabilityThresholdSeconds)
				.setDynamicTooltip()
				.onChange(async (value: number) => {
					this.plugin.settings.stabilityThresholdSeconds = value;
					await this.plugin.saveSettings();
					this.plugin.stabilityThresholdMs = value * 1000;
				}));

		new Setting(containerEl)
			.setName('Watch daily note')
			.setDesc('Enable monitoring of today\'s daily note for links in addition to the bookmark file')
			.addToggle(toggle => toggle
				.setValue(!!this.plugin.settings.watchDailyNote)
				.onChange(async (value: boolean) => {
					this.plugin.settings.watchDailyNote = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Daily note path')
			.setDesc('Folder path where daily notes are stored (leave empty for vault root)')
			.addText(text => text
				.setPlaceholder('Daily')
				.setValue(this.plugin.settings.dailyNotePath)
				.onChange(async (value: string) => {
					this.plugin.settings.dailyNotePath = normalizePath(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Daily note format')
			.setDesc('Date format template for daily note filenames (use yyyy, mm, dd placeholders)')
			.addText(text => text
				// eslint-disable-next-line obsidianmd/ui/sentence-case -- placeholder intentionally shows date format tokens
				.setPlaceholder('YYYY-MM-DD')
				.setValue(this.plugin.settings.dailyNoteFormat)
				.onChange(async (value: string) => {
					this.plugin.settings.dailyNoteFormat = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Clipping folder')
			.setDesc('Folder where processed link clippings will be saved (created automatically if needed)')
			.addText(text => text
				.setPlaceholder('Clippings')
				.setValue(this.plugin.settings.clippingFolder)
				.onChange(async (value: string) => {
					this.plugin.settings.clippingFolder = normalizePath(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Lava server URL')
			.setDesc('URL of the lava server for link processing')
			.addText(text => text
				.setPlaceholder('https://lava-linkstash.onrender.com/api')
				.setValue(this.plugin.settings.lavaServerUrl)
				.onChange(async (value: string) => {
					this.plugin.settings.lavaServerUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Use external service')
			.addToggle(toggle => toggle
				.setValue(!!this.plugin.settings.useExternalService)
				.onChange(async (value: boolean) => {
					this.plugin.settings.useExternalService = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Blocked domains')
			.setDesc('Comma-separated list of domains to skip when processing links (e.g., docs.google.com,sheets.google.com)')
			.addText(text => text
				// eslint-disable-next-line obsidianmd/ui/sentence-case -- placeholder intentionally lists domains
				.setPlaceholder('docs.google.com,sheets.google.com,sites.google.com,drive.google.com')
				.setValue(this.plugin.settings.blockedDomains)
				.onChange(async (value: string) => {
					this.plugin.settings.blockedDomains = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default tags')
			.setDesc('Comma-separated list of tags to add to all clippings (e.g., clippings,web)')
			.addText(text => text
				.setPlaceholder('Clippings')
				.setValue(this.plugin.settings.defaultTags)
				.onChange(async (value: string) => {
					this.plugin.settings.defaultTags = value;
					await this.plugin.saveSettings();
				}));
	}
}

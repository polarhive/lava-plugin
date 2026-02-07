# lava plugin

Extract links from your vault and save them as durable Markdown clippings with frontmatter (title, source, tags) so you can curate and search saved content right in your vault. 

- Monitor specified Markdown files (e.g., a bookmarks file and optionally daily notes) for links
- Save processed content as individual clippings in a configurable folder
- Supports both markdown links (`[text](url)`) and bare URLs
- Configurable processing delay, blocked domains, parser type, and default tags
- Manual processing command and automatic processing on file changes

---

## Quick Install

1. Download the latest release from the GitHub releases page: https://github.com/polarhive/lava-plugin/releases
2. Unzip and copy the release artifacts (`main.js`, `manifest.json`, `styles.css` if present) into:
   `<Your Vault>/.obsidian/plugins/lava/`
3. Reload Obsidian and enable **lava** in Settings → Community plugins.

---

## Security & privacy:

- The plugin does not collect or transmit any user data by default.
- If the "Use external service" option is enabled, links will be sent to the configured lava server for processing. The default server is operated by the plugin author and uses a hosted backend. You can also self-host your own lava server if you prefer.
- The plugin only processes links found in the specified bookmark file and optionally the daily note. It does not monitor or access any other files in your vault

## License

This plugin is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

Made with ❤️ by polarhive — https://polarhive.net

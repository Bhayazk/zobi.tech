const fs = require('fs/promises');
const path = require('path');

class PluginManager {
  constructor(directory) {
    this.directory = directory;
    this.pluginCache = new Map();
  }

  async loadPlugins() {
    try {
      console.log("[❄𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉❄] Loading plugins...");
      const pluginFiles = await this.getPluginFiles(this.directory);

      for (const filePath of pluginFiles) {
        if (!this.pluginCache.has(filePath)) {
          await this.loadPlugin(filePath);
        }
      }

      console.log("[❄𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉❄] Plugins loaded successfully.");
    } catch (error) {
      console.error("[❄𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉❄] Error loading plugins:", error);
    }
  }

  async getPluginFiles(directory) {
    const folders = await fs.readdir(directory);
    let pluginFiles = [];

    for (const folder of folders) {
      const folderPath = path.join(directory, folder);
      const stats = await fs.stat(folderPath);

      if (stats.isDirectory()) {
        const files = await fs.readdir(folderPath);
        const jsFiles = files
          .filter(file => file.endsWith('.js'))
          .map(file => path.join(folderPath, file));
        pluginFiles = pluginFiles.concat(jsFiles);
      } else if (folder.endsWith('.js')) {
        pluginFiles.push(folderPath);
      }
    }

    return pluginFiles;
  }

  async loadPlugin(filePath) {
    try {
      const plugins = require(filePath);

      if (Array.isArray(plugins)) {
        const validPlugins = plugins.filter(
          plugin => plugin && Array.isArray(plugin.command) && typeof plugin.operate === 'function'
        );

        if (validPlugins.length > 0) {
          this.pluginCache.set(filePath, validPlugins);
          console.log(`✅ Loaded plugin(s) from: ${filePath}, commands: ${validPlugins.map(p => p.command).join(', ')}`);
          return true;
        } else {
          console.warn(`⚠ No valid plugins found in: ${filePath}`);
          return false;
        }
      } else {
        console.warn(`⚠ Plugin file does not export an array: ${filePath}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error loading plugin (${filePath}):`, error);
      return false;
    }
  }

  async unloadPlugin(filePath) {
    const plugins = this.pluginCache.get(filePath);

    if (Array.isArray(plugins)) {
      for (const plugin of plugins) {
        try {
          if (typeof plugin.cleanup === 'function') {
            await plugin.cleanup();
          }
        } catch (error) {
          console.error(`❌ Error during cleanup in plugin (${filePath}):`, error);
        }
      }
    }

    try {
      delete require.cache[require.resolve(filePath)];
      this.pluginCache.delete(filePath);
      console.log(`🔄 Plugin unloaded: ${filePath}`);
    } catch (error) {
      console.error(`❌ Error unloading plugin (${filePath}):`, error);
    }
  }

  async unloadAllPlugins() {
    const filePaths = Array.from(this.pluginCache.keys());
    for (const filePath of filePaths) {
      await this.unloadPlugin(filePath);
    }
  }

  async reloadPlugin(filePath) {
    await this.unloadPlugin(filePath);
    await this.loadPlugin(filePath);
  }

  async executePlugin(globalContext, command) {
    for (const [_, pluginArray] of this.pluginCache.entries()) {
      for (const plugin of pluginArray) {
        try {
          if (Array.isArray(plugin.command) && plugin.command.includes(command)) {
            await plugin.operate(globalContext);
            return true;
          }
        } catch (error) {
          console.error(`❌ Error executing plugin (${plugin.command}):`, error);
        }
      }
    }
    return false;
  }
}

module.exports = PluginManager;

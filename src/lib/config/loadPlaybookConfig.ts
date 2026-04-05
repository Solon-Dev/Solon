/**
 * Playbook Configuration Loader
 *
 * Loads playbook configuration from .solon.config.json file
 * Falls back to all playbooks enabled if no config file exists
 */

import { promises as fs } from 'fs';
import path from 'path';
import { PlaybookConfig, Playbook } from '../playbooks/types';
import { getPlaybooksByNames, ALL_PLAYBOOKS } from '../playbooks/presets';

/**
 * Default configuration: all playbooks enabled
 */
const DEFAULT_CONFIG: PlaybookConfig = {
  playbooks: ['accessibility', 'security', 'best-practices']
};

// Simple in-memory cache
let cachedConfig: PlaybookConfig | null = null;
let lastLoadTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

/**
 * Load playbook configuration from repository root
 * Looks for .solon.config.json in the project root directory
 *
 * @returns PlaybookConfig object with enabled playbook names
 */
export async function loadPlaybookConfig(): Promise<PlaybookConfig> {
  const now = Date.now();
  if (cachedConfig && (now - lastLoadTime < CACHE_TTL)) {
    return cachedConfig;
  }

  try {
    // Try to read config file from project root
    const configPath = path.join(process.cwd(), '.solon.config.json');
    const configContent = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent) as PlaybookConfig;

    // Validate config structure
    if (!config.playbooks || !Array.isArray(config.playbooks)) {
      console.warn('Invalid .solon.config.json structure, using defaults');
      cachedConfig = DEFAULT_CONFIG;
      lastLoadTime = now;
      return DEFAULT_CONFIG;
    }

    // Validate that specified playbooks exist
    const validPlaybooks = config.playbooks.filter(name => {
      const exists = ALL_PLAYBOOKS.some(
        p => p.name.toLowerCase() === name.toLowerCase()
      );
      if (!exists) {
        console.warn(`Unknown playbook "${name}" in config, ignoring`);
      }
      return exists;
    });

    if (validPlaybooks.length === 0) {
      console.warn('No valid playbooks in config, using defaults');
      cachedConfig = DEFAULT_CONFIG;
      lastLoadTime = now;
      return DEFAULT_CONFIG;
    }

    cachedConfig = { playbooks: validPlaybooks };
    lastLoadTime = now;
    return cachedConfig;
  } catch (error) {
    // Config file doesn't exist or is invalid - use defaults
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('No .solon.config.json found, enabling all playbooks by default');
    } else {
      console.warn('Error reading .solon.config.json, using defaults:', error);
    }
    cachedConfig = DEFAULT_CONFIG;
    lastLoadTime = now;
    return DEFAULT_CONFIG;
  }
}

/**
 * Load enabled playbooks based on configuration
 * This is the main function to use in the API route
 *
 * @returns Array of Playbook objects that are enabled
 */
export async function loadEnabledPlaybooks(): Promise<Playbook[]> {
  const config = await loadPlaybookConfig();
  return getPlaybooksByNames(config.playbooks);
}

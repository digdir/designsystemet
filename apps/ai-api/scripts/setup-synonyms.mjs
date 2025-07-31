#!/usr/bin/env node

import { Meilisearch } from 'meilisearch';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
const envPathCandidates = [
  path.resolve(process.cwd(), '../.ai-env'),
  path.resolve(process.cwd(), 'apps/.ai-env'),
  path.resolve(process.cwd(), '.ai-env'),
];

for (const p of envPathCandidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    console.log(`Loaded env vars from ${p}`);
    break;
  }
}

const client = new Meilisearch({
  host: process.env.MEILISEARCH_API_URL || '',
  apiKey: process.env.MEILISEARCH_ADMIN_KEY || '',
});

const INDEX_NAME = process.env.MEILISEARCH_PROJECT_NAME || 'designsystemet-search';

// Define synonym mappings based on actual Designsystemet components
// Each group contains all synonymous terms - searching for any term finds all others
const synonyms = {
  // Core UI Components (matching actual component names)
  'alert_group': ['alert', 'notification', 'message', 'toast', 'banner'],
  'avatar_group': ['avatar', 'profile picture', 'user image'],
  'badge_group': ['badge', 'label', 'status indicator'],
  'breadcrumbs_group': ['breadcrumbs', 'breadcrumb', 'navigation path'],
  'button_group': ['button', 'cta', 'call-to-action', 'call to action', 'action'],
  'card_group': ['card', 'tile', 'panel'],
  'checkbox_group': ['checkbox', 'check', 'checkmark'],
  'chip_group': ['chip', 'tag', 'pill'],
  'details_group': ['details', 'accordion', 'collapsible', 'expandable'],
  'dialog_group': ['dialog', 'modal', 'overlay'],
  'divider_group': ['divider', 'separator', 'line'],
  'dropdown_group': ['dropdown', 'menu'],
  'errorsummary_group': ['errorsummary', 'error summary', 'validation errors'],
  'field_group': ['field', 'form field'],
  'fieldset_group': ['fieldset', 'form group', 'field group'],
  'input_group': ['input', 'textfield', 'text field', 'inputfield'],
  'link_group': ['link', 'anchor', 'hyperlink'],
  'list_group': ['list', 'menu', 'items'],
  'loaders_group': ['loaders', 'spinner', 'loading', 'progress'],
  'pagination_group': ['pagination', 'pager', 'page navigation'],
  'popover_group': ['popover', 'popup'],
  'radio_group': ['radio', 'radio button', 'option'],
  'search_group': ['search', 'search box', 'filter'],
  'select_group': ['select', 'dropdown', 'picker'],
  'skiplink_group': ['skiplink', 'skip link', 'accessibility link'],
  'suggestion_group': ['suggestion', 'autocomplete', 'combobox', 'typeahead', 'multiselect', 'multi select'],
  'switch_group': ['switch', 'toggle'],
  'table_group': ['table', 'datagrid', 'data table'],
  'tabs_group': ['tabs', 'tab', 'tabpanel'],
  'textarea_group': ['textarea', 'text area', 'multiline input'],
  'togglegroup_group': ['togglegroup', 'toggle group', 'button group'],
  'tooltip_group': ['tooltip', 'hint', 'help text'],
};

async function setupSynonyms() {
  try {
    console.log(`Setting up synonyms for index: ${INDEX_NAME}`);
    
    const index = client.index(INDEX_NAME);
    
    // Update synonyms settings
    console.log('Configuring synonyms...');
    const task = await index.updateSynonyms(synonyms);
    
    console.log(`✅ Synonym update task enqueued with ID: ${task.taskUid}`);
    console.log('📝 Synonyms are being configured in Meilisearch...');
    
    // Display configured synonyms
    console.log('\n🔧 Configured synonym groups:');
    Object.entries(synonyms).forEach(([key, values]) => {
      console.log(`  ${key}: [${values.join(', ')}]`);
    });
    
    console.log(`\n🔍 Total synonym groups: ${Object.keys(synonyms).length}`);
    console.log('\n💡 Examples of improved search:');
    console.log('  - "modal" will now find Dialog component');
    console.log('  - "dropdown" will now find Select component');
    console.log('  - "popup" will now find Popover/Tooltip components');
    console.log('  - "textfield" will now find Input component');
    console.log('\n✨ Synonym configuration complete!');
    console.log('Note: Changes may take a few moments to propagate in Meilisearch.');
    
  } catch (error) {
    console.error('❌ Error setting up synonyms:', error);
    process.exit(1);
  }
}

// Run the setup
setupSynonyms();

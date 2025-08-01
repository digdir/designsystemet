#!/usr/bin/env node

import dotenv from 'dotenv';
import fs from 'fs';
import { Meilisearch } from 'meilisearch';
import path from 'path';

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

const INDEX_NAME =
  process.env.MEILISEARCH_PROJECT_NAME || 'designsystemet-search';

// TODO: Update synonyms with Norwegian terms
// TODO: Update synonyms with designer terms/Figma terms
// TODO: check https://designsystems.surf/ for other synonyms

// Convert grouped synonyms to Meilisearch "mutual association format":
// https://www.meilisearch.com/docs/learn/relevancy/synonyms#mutual-association
// Each term must explicitly be made bidirectional so Meilisearch can find synonyms in both directions
// Example: alert -> notification, message, toast, banner
// Example: notification -> alert, message, toast, banner
// Example: message -> alert, notification, toast, banner
// Example: toast -> alert, notification, message, banner
// Example: banner -> alert, notification, message, toast
function createMutualAssociations(groups) {
  const synonyms = {};
  Object.values(groups).forEach((group) => {
    group.forEach((term) => {
      synonyms[term] = group.filter((synonym) => synonym !== term);
    });
  });
  return synonyms;
}

// Synonym groups based on actual Designsystemet components (as of 2025-07-31)
const synonymGroups = {
  alert: ['alert', 'notification', 'message', 'toast', 'banner'],
  avatar: ['avatar', 'profile picture', 'user image'],
  badge: ['badge', 'label', 'status indicator'],
  breadcrumbs: ['breadcrumbs', 'breadcrumb', 'navigation path'],
  button: ['button', 'cta', 'call-to-action', 'call to action', 'action'],
  card: ['card', 'tile', 'panel'],
  checkbox: ['checkbox', 'check', 'checkmark'],
  chip: ['chip', 'tag', 'pill'],
  details: ['details', 'accordion', 'collapsible', 'expandable'],
  dialog: ['dialog', 'modal', 'overlay'],
  divider: ['divider', 'separator', 'line'],
  dropdown: ['dropdown', 'menu'],
  errorsummary: ['errorsummary', 'error summary', 'validation errors'],
  field: ['field', 'form field'],
  fieldset: ['fieldset', 'form group', 'field group'],
  input: ['input', 'textfield', 'text field', 'inputfield'],
  link: ['link', 'anchor', 'hyperlink'],
  list: ['list', 'menu', 'items'],
  loaders: ['loaders', 'spinner', 'loading', 'progress'],
  pagination: ['pagination', 'pager', 'page navigation'],
  popover: ['popover', 'popup'],
  radio: ['radio', 'radio button', 'option'],
  search: ['search', 'search box', 'filter'],
  select: ['select', 'dropdown', 'picker'],
  skiplink: ['skiplink', 'skip link', 'accessibility link'],
  suggestion: [
    'suggestion',
    'autocomplete',
    'combobox',
    'typeahead',
    'multiselect',
    'multi select',
  ],
  switch: ['switch', 'toggle'],
  table: ['table', 'datagrid', 'data table'],
  tabs: ['tabs', 'tab', 'tabpanel'],
  textarea: ['textarea', 'text area', 'multiline input'],
  togglegroup: ['togglegroup', 'toggle group', 'button group'],
  tooltip: ['tooltip', 'hint', 'help text'],
};

// Generate proper Meilisearch synonym format
const synonyms = createMutualAssociations(synonymGroups);

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
    console.log(
      'Note: Changes may take a few moments to propagate in Meilisearch.',
    );
  } catch (error) {
    console.error('❌ Error setting up synonyms:', error);
    process.exit(1);
  }
}

// Run the setup
setupSynonyms();

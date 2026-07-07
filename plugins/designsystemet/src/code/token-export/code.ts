import type { CodeModule } from '../../code/harness'
import { postToUi } from '../../code/harness'
import { importToFigma } from './importer'
import { tokenExportManifest } from './manifest'
import { checkVariableStructure, prepareVariables } from './prepare-variables'
import type { FlatToken, PreviewData, SerializedPreviewData } from './types'

const ID = tokenExportManifest.id

export const tokenExportCodeModule: CodeModule = {
  id: ID,
  async handle(msg) {
    if (msg.type === 'check-variable-structure') {
      const status = await checkVariableStructure()
      postToUi(ID, 'variable-structure-status', { status })
      return
    }

    if (msg.type === 'prepare-variables') {
      try {
        const result = await prepareVariables()
        postToUi(ID, 'prepare-variables-result', { result })
        // Re-check so the UI reflects the post-prime structure.
        const status = await checkVariableStructure()
        postToUi(ID, 'variable-structure-status', { status })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Ukjent feil under forberedelse'
        postToUi(ID, 'prepare-variables-result', { result: { status: 'error', message } })
      }
      return
    }

    if (msg.type === 'open-external') {
      figma.openExternal(msg.url as string)
      return
    }

    if (msg.type === 'import-to-figma') {
      // Defensive guard: never import into a file that still uses the old variable
      // structure, even if the UI button state was stale. This is what would otherwise
      // create a duplicate "Color" collection and break the file.
      const structure = await checkVariableStructure()
      if (structure.state !== 'ok') {
        postToUi(ID, 'import-error', {
          message: 'Variabelstrukturen må forberedes før import. ' + structure.message,
        })
        return
      }

      try {
        const result = await importToFigma({
          preview: rehydratePreview(msg.preview as SerializedPreviewData),
          selectedTheme: msg.selectedTheme as string | null,
          selectedScheme: msg.selectedScheme as string | null,
        })
        postToUi(ID, 'import-success', { logs: result.logs })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Ukjent feil under import'
        postToUi(ID, 'import-error', { message })
      }
      return
    }
  },
}

function rehydratePreview(preview: SerializedPreviewData): PreviewData {
  return {
    ...preview,
    tokenLookup: new Map<string, FlatToken>(preview.tokenLookupEntries),
  }
}

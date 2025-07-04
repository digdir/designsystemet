# PowerShell script to rename main component files to lowercase
# This handles files like Switch.tsx -> switch.tsx

function Convert-ToKebabCase {
    param([string]$Text)
    
    # Convert PascalCase to kebab-case
    $result = $Text -creplace '([A-Z]+)([A-Z][a-z])', '$1-$2'
    $result = $result -creplace '([a-z])([A-Z])', '$1-$2'
    return $result.ToLower()
}

function Rename-MainFiles {
    param([string]$Directory)
    
    Write-Host "Processing directory: $Directory"
    
    # Get files that match main component patterns
    $files = Get-ChildItem -Path $Directory -File | Where-Object { 
        ($_.Name -like "*.tsx" -or $_.Name -like "*.ts" -or $_.Name -like "*.mdx" -or $_.Name -like "*.stories.tsx" -or $_.Name -like "*.test.tsx" -or $_.Name -like "*.chromatic.tsx") -and
        $_.Name -notlike "index.*" -and 
        $_.Name -notlike "*-*" -and  # Skip files that already have hyphens
        $_.Name -cmatch '^[A-Z]'  # Only files starting with uppercase
    }
    
    foreach ($file in $files) {
        $oldName = $file.Name
        $nameWithoutExtension = [System.IO.Path]::GetFileNameWithoutExtension($oldName)
        $extension = $file.Extension
        
        # Convert to kebab-case
        $newNameWithoutExtension = Convert-ToKebabCase $nameWithoutExtension
        $newName = "$newNameWithoutExtension$extension"
        
        if ($oldName -cne $newName) {
            $oldPath = $file.FullName
            $newPath = Join-Path $Directory $newName
            
            Write-Host "  Renaming: $oldName -> $newName"
            
            # Use git mv for proper tracking
            git mv $oldPath $newPath
        }
    }
}

# Set working directory
Set-Location "c:\kode\designsystemet"

Write-Host "Starting main file renaming process..."

# Process components (skip Combobox)
$componentsDir = "packages\react\src\components"
$componentFolders = Get-ChildItem -Path $componentsDir -Directory | Where-Object { $_.Name -ne "Combobox" }

foreach ($folder in $componentFolders) {
    Rename-MainFiles $folder.FullName
}

# Process utilities
$utilitiesDir = "packages\react\src\utilities"
$utilityFolders = Get-ChildItem -Path $utilitiesDir -Directory

foreach ($folder in $utilityFolders) {
    Rename-MainFiles $folder.FullName
}

Write-Host "Main file renaming complete!"
Write-Host "Run 'git status' to see all the changes."

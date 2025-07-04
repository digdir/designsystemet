# PowerShell script to rename all files from PascalCase to kebab-case
# Skips Combobox folder as requested

function Convert-ToKebabCase {
    param([string]$Text)
    
    # Convert PascalCase to kebab-case
    # First handle sequences of uppercase letters followed by lowercase (like "HTMLParser" -> "HTML-Parser")
    $result = $Text -creplace '([A-Z]+)([A-Z][a-z])', '$1-$2'
    # Then handle lowercase followed by uppercase (like "camelCase" -> "camel-Case")
    $result = $result -creplace '([a-z])([A-Z])', '$1-$2'
    # Handle single uppercase words at the beginning or standalone (like "Switch" -> "switch")
    $result = $result -creplace '^([A-Z])', '$1'
    # Convert to lowercase
    return $result.ToLower()
}

function Rename-FilesInDirectory {
    param([string]$Directory)
    
    Write-Host "Processing directory: $Directory"
    
    # Get all files (not directories) in the current directory
    $files = Get-ChildItem -Path $Directory -File | Where-Object { 
        $_.Name -notlike "index.*" -and 
        $_.Name -notlike "*.json" -and
        $_.Name -notlike "*.html" -and
        $_.Name -notlike "README.md"
    }
    
    foreach ($file in $files) {
        $oldName = $file.Name
        $nameWithoutExtension = [System.IO.Path]::GetFileNameWithoutExtension($oldName)
        $extension = $file.Extension
        
        # Convert to kebab-case
        $newNameWithoutExtension = Convert-ToKebabCase $nameWithoutExtension
        $newName = "$newNameWithoutExtension$extension"
        
        if ($oldName -ne $newName) {
            $oldPath = $file.FullName
            $newPath = Join-Path $Directory $newName
            
            Write-Host "  Renaming: $oldName -> $newName"
            
            # Use git mv for proper tracking
            & git mv $oldPath $newPath
        }
    }
    
    # Recursively process subdirectories (like html-examples)
    $subdirs = Get-ChildItem -Path $Directory -Directory
    foreach ($subdir in $subdirs) {
        Rename-FilesInDirectory $subdir.FullName
    }
}

# Set working directory
Set-Location "c:\kode\designsystemet"

Write-Host "Starting file renaming process..."

# Process components (skip Combobox)
$componentsDir = "packages\react\src\components"
$componentFolders = Get-ChildItem -Path $componentsDir -Directory | Where-Object { $_.Name -ne "Combobox" }

foreach ($folder in $componentFolders) {
    Rename-FilesInDirectory $folder.FullName
}

# Process utilities
$utilitiesDir = "packages\react\src\utilities"
$utilityFolders = Get-ChildItem -Path $utilitiesDir -Directory

foreach ($folder in $utilityFolders) {
    Rename-FilesInDirectory $folder.FullName
}

Write-Host "File renaming complete!"
Write-Host "Run 'git status' to see all the changes."

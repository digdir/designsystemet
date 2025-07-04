function Convert-ToKebabCase {
    param([string]$Text)
    $result = $Text -creplace '([A-Z]+)([A-Z][a-z])', '$1-$2'
    $result = $result -creplace '([a-z])([A-Z])', '$1-$2'
    return $result.ToLower()
}

$Directory = "c:\kode\designsystemet\packages\react\src\components\button"
Write-Host "Processing directory: $Directory"

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
    
    $newNameWithoutExtension = Convert-ToKebabCase $nameWithoutExtension
    $newName = "$newNameWithoutExtension$extension"
    
    Write-Host "File: $oldName"
    Write-Host "  Old name without ext: $nameWithoutExtension"
    Write-Host "  New name without ext: $newNameWithoutExtension"
    Write-Host "  New name: $newName"
    Write-Host "  Different? $($oldName -ne $newName)"
    
    if ($oldName -ne $newName) {
        $oldPath = $file.FullName
        $newPath = Join-Path $Directory $newName
        
        Write-Host "  Would rename: $oldPath -> $newPath"
        Write-Host "  Running: git mv `"$oldPath`" `"$newPath`""
        
        try {
            git mv $oldPath $newPath
            Write-Host "  SUCCESS!"
        } catch {
            Write-Host "  ERROR: $_"
        }
    }
    Write-Host ""
}

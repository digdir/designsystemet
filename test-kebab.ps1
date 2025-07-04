function Convert-ToKebabCase {
    param([string]$Text)
    
    # Convert PascalCase to kebab-case
    $result = $Text -creplace '([A-Z]+)([A-Z][a-z])', '$1-$2'
    $result = $result -creplace '([a-z])([A-Z])', '$1-$2'
    return $result.ToLower()
}

Write-Host "Testing conversion:"
Write-Host "Switch -> $(Convert-ToKebabCase 'Switch')"
Write-Host "Button -> $(Convert-ToKebabCase 'Button')"
Write-Host "SwitchButton -> $(Convert-ToKebabCase 'SwitchButton')"
Write-Host "ErrorSummary -> $(Convert-ToKebabCase 'ErrorSummary')"

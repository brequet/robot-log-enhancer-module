# --- Configuration ---
$SourceHtmlFile = ".\temp\log.html"
$OutputHtmlFile = ".\temp\log.injected.html"
$BuiltJsFile = ".\dist\robot-log-enhancer.umd.js"

# --- Main Script ---

if (-not (Test-Path $SourceHtmlFile)) {
    Write-Host "Source file not found at $SourceHtmlFile. Please place your log.html there." -ForegroundColor Red
    exit 1
}

# Step 1: Build the project
Write-Host "Building the project..." -ForegroundColor Cyan
yarn run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "yarn run build failed. Aborting injection." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $BuiltJsFile)) {
    Write-Host "Build succeeded, but the output file was not found at $BuiltJsFile." -ForegroundColor Red
    exit 1
}

# Step 2: Read the content of the built JS and the source HTML
Write-Host "Reading built script and source HTML..." -ForegroundColor Green
$scriptContent = Get-Content -Path $BuiltJsFile -Raw
$htmlContent = Get-Content -Path $SourceHtmlFile -Raw

# Step 3: Create the injection tag and replace it in the HTML
$injectionTag = "<script>$scriptContent</script>"
$injectedHtml = $htmlContent.Replace("</body>", "$injectionTag`n</body>")

# Step 4: Write the new, injected content to the output file
Write-Host "Injecting script into $OutputHtmlFile..." -ForegroundColor Green
Set-Content -Path $OutputHtmlFile -Value $injectedHtml -Force

Write-Host "✅ Injection complete! Open ` temp\log.injected.html` in your browser to test." -ForegroundColor Yellow

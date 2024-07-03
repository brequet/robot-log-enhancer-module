param (
    [string]$FilePath,
    [bool]$IsDevMode
)

function Log-Message {
    param (
        [string]$Message,
        [string]$Level = "INFO"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Output "$timestamp [$Level] $Message"
}

# Check if the file path is valid and the file exists
if (-Not (Test-Path -Path $FilePath -PathType Leaf)) {
    Log-Message -Message "The specified file does not exist: $FilePath" -Level "ERROR"
    exit 1
}

try {
    # Determine the script directory
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

    # Build the script source path based on the mode
    if ($IsDevMode) {
        $srcPath = "$scriptDir\dist\robot-log-enhancer.umd.js"
    }
    else {
        $srcPath = "https://cdn.jsdelivr.net/gh/brequet/robot-log-enhancer-module/dist/robot-log-enhancer.umd.js"
    }

    # Prepare the new content to be inserted
    $newContent = @"
<script src='$srcPath'></script>
</body>
"@

    # Read the log content
    $logContent = Get-Content -Path $FilePath -Raw

    # Replace </body> with the new content
    $updatedLogContent = $logContent -replace '</body>', $newContent

    # Write the updated content back to the file
    Set-Content -Path $FilePath -Value $updatedLogContent

    Log-Message -Message "The file has been successfully updated: $FilePath"

}
catch {
    Log-Message -Message "An error occurred: $_" -Level "ERROR"
    exit 1
}

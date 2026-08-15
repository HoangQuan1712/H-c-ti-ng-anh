# FluentActive Server Launcher
# Checks for Node.js server first, then runs with full API and Database support

$port = 3000

# Try launching Node.js server if available
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "Starting FluentActive Node.js Database Server on http://localhost:$port/ ..." -ForegroundColor Cyan
    node server.js
    exit
}

Write-Host "Node.js not detected on PATH, falling back to basic PowerShell HTTP Server..." -ForegroundColor Yellow

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port/" -ForegroundColor Green

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $localPath = Join-Path (Get-Location) $path.TrimStart('/')

    if (Test-Path $localPath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($localPath)
        $contentType = $mimeTypes[$ext]
        if (-not $contentType) { $contentType = "application/octet-stream" }

        $bytes = [System.IO.File]::ReadAllBytes($localPath)
        $response.ContentType = $contentType
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }
    $response.Close()
}

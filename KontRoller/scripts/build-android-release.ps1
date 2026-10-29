param(
    [ValidateRange(1,2100000000)][int]$VersionCode = 109,
    [ValidateNotNullOrEmpty()][string]$VersionName = '1.09'
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$cacheRoot = Join-Path $projectRoot '.g'
$androidUserRoot = Join-Path $projectRoot '.android'
$temporaryRoot = Join-Path $projectRoot 'android\.tmp'
$environmentNames = @('GRADLE_USER_HOME','ANDROID_USER_HOME','ANDROID_PREFS_ROOT','TEMP','TMP','JAVA_TOOL_OPTIONS')
$previousBuildEnvironment = @{}
foreach ($name in $environmentNames) {
    $previousBuildEnvironment[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
}
$locationChanged = $false
try {
    New-Item -ItemType Directory -Force -Path $cacheRoot,$androidUserRoot,$temporaryRoot | Out-Null
    $env:GRADLE_USER_HOME = $cacheRoot
    $env:ANDROID_USER_HOME = $androidUserRoot
    $env:ANDROID_PREFS_ROOT = $projectRoot
    $env:TEMP = $temporaryRoot
    $env:TMP = $temporaryRoot
    $javaTemporaryRoot = $temporaryRoot.Replace('\','/')
    $env:JAVA_TOOL_OPTIONS = "-Djava.io.tmpdir=`"$javaTemporaryRoot`""
    Push-Location (Join-Path $projectRoot 'android')
    $locationChanged = $true
    & .\gradlew.bat :app:bundleRelease :app:assembleRelease "-PKONTROLLER_VERSION_CODE=$VersionCode" "-PKONTROLLER_VERSION_NAME=$VersionName" --console=plain --no-daemon --max-workers=4
    if ($LASTEXITCODE -ne 0) { throw "Android release build failed with exit code $LASTEXITCODE" }
    Write-Output (Join-Path $projectRoot 'android\app\build\outputs\bundle\release\app-release.aab')
} finally {
    if ($locationChanged) { Pop-Location }
    foreach ($name in $environmentNames) {
        [Environment]::SetEnvironmentVariable($name, $previousBuildEnvironment[$name], 'Process')
    }
}

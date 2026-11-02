# Учёт времени: .\scripts\tlog.ps1 start "задача" | stop
param(
    [Parameter(Mandatory)][ValidateSet("start","stop")][string]$Action,
    [string]$Task = ""
)
$ErrorActionPreference = "Stop"
$dir = Join-Path $PSScriptRoot "..\docs\process"
New-Item -ItemType Directory -Force $dir | Out-Null
$log = Join-Path $dir "timelog.csv"
$state = Join-Path $dir ".tlog-active"
if (-not (Test-Path $log)) { "start,end,minutes,task" | Set-Content $log -Encoding utf8 }

if ($Action -eq "start") {
    if (Test-Path $state) { throw "Уже идёт отсчёт: сначала tlog stop" }
    "$((Get-Date).ToString('o'))|$Task" | Set-Content $state -Encoding utf8
    Write-Host "Старт: $Task"
} else {
    if (-not (Test-Path $state)) { throw "Отсчёт не запущен" }
    $s, $t = (Get-Content $state -Raw).Trim().Split("|", 2)
    $start = [datetime]::Parse($s); $end = Get-Date
    $min = [math]::Round(($end - $start).TotalMinutes, 1)
    $t = $t -replace '"', "'"
    "$($start.ToString('s')),$($end.ToString('s')),$min,`"$t`"" | Add-Content $log -Encoding utf8
    Remove-Item $state
    Write-Host "Записано: $min мин. - $t"
}

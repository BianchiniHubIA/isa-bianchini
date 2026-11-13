# Script para registrar o Sentinela Noturno 22:30 no Agendador de Tarefas do Windows (Task Scheduler)
# Garante que o alerta toque e apareca na tela mesmo com o aplicativo fechado!

$TaskNamePre = "SentinelaIsa_AvisoPrevio_2215"
$TaskNameCrit = "SentinelaIsa_AlertaCritico_2230"
$PythonExe = (Get-Command python).Source
$ScriptPath = Join-Path $PSScriptRoot "sentinela_desktop.py"

Write-Host "Registrando tarefas no Windows Task Scheduler..." -ForegroundColor Cyan

# Acao: Executar python sentinela_desktop.py
$ActionPre = New-ScheduledTaskAction -Execute $PythonExe -Argument "`"$ScriptPath`" --trigger pre_alert"
$ActionCrit = New-ScheduledTaskAction -Execute $PythonExe -Argument "`"$ScriptPath`" --trigger critical"

# Gatilhos diarios: 22:15 e 22:30
$TriggerPre = New-ScheduledTaskTrigger -Daily -At "22:15"
$TriggerCrit = New-ScheduledTaskTrigger -Daily -At "22:30"

# Configuracoes de execucao
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# Registrar Aviso Previo 22:15
Unregister-ScheduledTask -TaskName $TaskNamePre -Confirm:$false -ErrorAction SilentlyContinue
Register-ScheduledTask -TaskName $TaskNamePre -Action $ActionPre -Trigger $TriggerPre -Settings $Settings -Description "Aviso previo de 15 minutos para Victor avisar a Isa antes das 22:30" | Out-Null
Write-Host "[OK] Tarefa das 22:15 registrada com sucesso." -ForegroundColor Green

# Registrar Alerta Critico 22:30
Unregister-ScheduledTask -TaskName $TaskNameCrit -Confirm:$false -ErrorAction SilentlyContinue
Register-ScheduledTask -TaskName $TaskNameCrit -Action $ActionCrit -Trigger $TriggerCrit -Settings $Settings -Description "Alerta critico das 22:30 para Victor nunca passar do horario sem avisar a Isa" | Out-Null
Write-Host "[OK] Tarefa das 22:30 registrada com sucesso." -ForegroundColor Green

Write-Host "`nSentinela ativo no Windows! Ele vai disparar mesmo com o navegador ou executavel fechado." -ForegroundColor Yellow

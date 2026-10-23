@echo off
title Sentinela Isa Bianchini - Inicializador Oficial
echo ========================================================
echo   SENTINELA DO AMOR: ISA & VICTOR
echo   Pilar 1: Homenagens Publicas & Stories
echo   Pilar 2: Regra de Ouro das 22:30
echo   Pilar 3: Datas Sagradas (Uniao: 04 de Abril)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Iniciando Backend FastAPI (Porta 8088)...
start "Sentinela Backend API" /min cmd /c "python backend_server.py"

echo [2/3] Iniciando Frontend PWA Vite (Porta 5173)...
start "Sentinela Frontend PWA" /min cmd /c "npm run dev"

echo [3/3] Iniciando Sentinela Desktop em Segundo Plano...
start "Sentinela Desktop Windows" /min cmd /c "python sentinela_desktop.py"

timeout /t 2 >nul

echo.
echo Abrindo o painel no navegador Brave...
start "" "http://localhost:5173/"

echo.
echo Tudo iniciado com sucesso! O painel esta rodando.
pause

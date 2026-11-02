@echo off
title Push FinWise AI to GitHub
echo ====================================================================
echo  FinWise AI - Pushing to GitHub
echo  Target: https://github.com/maddakahansy24/finova-ai.git
echo ====================================================================
echo.
"C:\Users\Hansy\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Your repository has been pushed successfully to GitHub!
    echo Visit: https://github.com/maddakahansy24/finova-ai
) else (
    echo [ERROR] Push failed. If this is a private repo or first time,
    echo make sure you are signed into GitHub.
)
echo.
pause

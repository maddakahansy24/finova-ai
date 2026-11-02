@echo off
title FinWise AI - Dev Server
echo ====================================================================
echo  Starting FinWise AI - Personal AI Financial Assistant...
echo  URL: http://localhost:5173/
echo ====================================================================
echo.
start http://localhost:5173/
npm run dev
pause

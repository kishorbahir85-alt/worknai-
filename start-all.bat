@echo off
echo Starting WorknAi Services...

set "ROOT=%~dp0"

start "WorknAi Backend" /D "%ROOT%Backend" cmd /k "npm run dev"
start "WorknAi Frontend" /D "%ROOT%Frontend" cmd /k "npm run dev"
start "WorknAi Admin" /D "%ROOT%Admin" cmd /k "npm run dev"
start "WorknAi Manager" /D "%ROOT%Manager" cmd /k "npm run dev"

echo All services launched!
echo - Backend:  http://localhost:5001
echo - Frontend: http://localhost:3000
echo - Admin:    http://localhost:5174
echo - Manager:  http://localhost:5175


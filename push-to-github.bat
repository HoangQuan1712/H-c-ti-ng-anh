@echo off
title Day Du Lieu Len GitHub - FluentActive
color 0b
echo ===================================================
echo   DANG KET NOI VA DONG BO DU LIEU LEN GITHUB
echo ===================================================
echo.
cd /d "%~dp0"

echo [1/3] Dang kiem tra va them tat ca file...
git add .
git commit -m "Update project files and latest features" 2>nul

echo.
echo [2/3] Dang day ma nguon len GitHub (Force Sync)...
echo Repository: https://github.com/HoangQuan1712/H-c-ti-ng-anh.git
echo.

git push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    color 0a
    echo ===================================================
    echo   CHUC MUNG! DA DAY TOAN BO DU LIEU LEN GITHUB!
    echo   Hay mo trinh duyet va kiem tra tai:
    echo   https://github.com/HoangQuan1712/H-c-ti-ng-anh
    echo ===================================================
) else (
    color 0c
    echo ===================================================
    echo   CO LOI XAY RA KHI PUSH!
    echo ===================================================
)

echo.
pause

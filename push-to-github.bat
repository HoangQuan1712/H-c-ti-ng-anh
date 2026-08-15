@echo off
title Day Du Lieu Len GitHub - FluentActive
color 0b
echo ===================================================
echo   DANG KET NOI VA DAY MA NGUON LEN GITHUB
echo ===================================================
echo.
cd /d "%~dp0"

echo Dang kiem tra trang thai Git...
git status

echo.
echo Dang day code len repository: https://github.com/HoangQuan1712/H-c-ti-ng-anh.git
echo Neu co cua so trinh duyet hien ra, ban chi can bam "Sign in with your browser"!
echo.

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    color 0a
    echo ===================================================
    echo   CHUC MUNG! DAY DU LIEU LEN GITHUB THANH CONG!
    echo   Hay truy cap: https://github.com/HoangQuan1712/H-c-ti-ng-anh
    echo ===================================================
) else (
    color 0c
    echo ===================================================
    echo   CO LOI XAY RA KHI PUSH!
    echo ===================================================
)

echo.
pause

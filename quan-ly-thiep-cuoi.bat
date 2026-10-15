@echo off
setlocal
cd /d "%~dp0"
title Cong cu quan ly thiep cuoi

if not exist "node_modules" (
  echo Chua thay node_modules. Hay cai Node.js va chay npm install truoc.
  echo.
  echo Nhan phim bat ky de dong cua so.
  pause >nul
  exit /b 1
)

:menu
cls
echo ==========================================
echo       QUAN LY THIEP CUOI - QUOC CUONG
echo ==========================================
echo 1. Tao / doi username va mat khau
echo 2. Cau hinh Supabase de chay local
echo 3. Mo migration SQL trong Notepad
echo 4. Chay website local
echo 5. Mo trang tao link va thong ke
echo 6. Mo huong dan setup
echo 7. Xem trang thai Git
echo 0. Thoat
echo.
set "option="
set /p "option=Nhap so chuc nang roi nhan Enter: "
if "%option%"=="0" goto exit
if "%option%"=="1" goto set_credentials
if "%option%"=="2" goto configure_local
if "%option%"=="3" goto open_sql
if "%option%"=="4" goto run_local
if "%option%"=="5" goto open_pages
if "%option%"=="6" goto open_guide
if "%option%"=="7" goto git_status
set "result=Lua chon khong hop le. Hay nhap mot so tu 0 den 7."
goto finish

:set_credentials
echo.
call npm run admin:set-credentials
if errorlevel 1 (
  set "result=THAT BAI: Khong tao/cap nhat duoc tai khoan. Kiem tra thong bao loi o tren."
) else (
  set "result=THANH CONG: Da tao/cap nhat tai khoan."
)
goto finish

:configure_local
echo.
node scripts\configure-wedding-local.mjs
if errorlevel 1 (
  set "result=THAT BAI: Chua luu duoc cau hinh Supabase. Kiem tra key va thong bao loi o tren."
) else (
  set "result=THANH CONG: Da luu cau hinh Supabase vao .env.local. Hay khoi dong lai server local truoc khi test."
)
goto finish

:open_sql
if not exist "%~dp0public\thiepcuoi\supabase-invitation-codes-migration.sql" (
  set "result=THAT BAI: Khong tim thay file migration SQL."
  goto finish
)
start "" notepad.exe "%~dp0public\thiepcuoi\supabase-invitation-codes-migration.sql"
set "result=DA MO FILE SQL: Hay sao chep noi dung sang Supabase SQL Editor va bam Run. Mo Notepad khong tu chay migration."
goto finish

:run_local
echo Website dang chay trong cua so nay. Nhan Ctrl+C de dung server va quay lai menu.
call npm run dev
set "result=SERVER LOCAL DA DUNG."
goto finish

:open_pages
start "" "http://localhost:3000/thiepcuoi/tao-link.html"
set "creator_result=%errorlevel%"
start "" "http://localhost:3000/thiepcuoi/thong-ke.html"
if not "%creator_result%"=="0" (
  set "result=Khong mo duoc trang. Hay kiem tra trinh duyet mac dinh va server local."
) else (
  set "result=Da yeu cau mo trang tao link va thong ke. Neu trang loi, hay chon muc 4 de chay server local truoc."
)
goto finish

:open_guide
if not exist "%~dp0public\thiepcuoi\INVITATION-CODES-SETUP.md" (
  set "result=THAT BAI: Khong tim thay file huong dan."
  goto finish
)
start "" notepad.exe "%~dp0public\thiepcuoi\INVITATION-CODES-SETUP.md"
set "result=DA MO FILE HUONG DAN trong Notepad."
goto finish

:git_status
echo.
git status --short
if errorlevel 1 (
  set "result=THAT BAI: Khong doc duoc trang thai Git. Hay kiem tra Git va thu muc du an."
  goto finish
)
echo.
echo Kiem tra .env.local da duoc Git bo qua:
git check-ignore .env.local
set "result=Da kiem tra trang thai Git. Khong dua .env.local len Git. File private\admin-credentials.txt chi chua hash tai khoan."
goto finish

:finish
echo.
echo ------------------------------------------
echo %result%
echo ------------------------------------------
echo Nhan phim bat ky de quay lai menu.
pause >nul
goto menu

:exit
endlocal

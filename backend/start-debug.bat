@echo off
cls
echo ================================================================================
echo                        SKATESHOP BACKEND SERVER - DEBUG MODE
echo ================================================================================
echo.
echo 🚨 MASALAH SESSION "Invalid or expired session"?
echo.
echo 💡 SOLUSI CEPAT:
echo    1. Server ini akan start dengan session storage kosong
echo    2. Buka request_debug.rest di VS Code
echo    3. Ikuti Step 1-5 secara berurutan
echo    4. Atau baca file SOLUSI_SESSION_ERROR.md untuk panduan lengkap
echo.
echo 📁 Files untuk debugging:
echo    - request_debug.rest     : Step-by-step fix session error
echo    - SOLUSI_SESSION_ERROR.md : Panduan lengkap troubleshooting
echo    - request.rest          : Main API testing file
echo.
echo ================================================================================
echo   SERVER STARTING...
echo ================================================================================
echo.
echo ⚡ Starting server dengan session debugging...
echo 📊 Session storage akan direset (in-memory)
echo 🔍 Console akan menampilkan log session creation dan validation
echo.
echo 🌐 Server URL: http://localhost:5000
echo 🔧 Debug endpoint: http://localhost:5000/auth/debug/sessions
echo.
echo ⭐ SETELAH SERVER RUNNING:
echo    Buka VS Code → request_debug.rest → Ikuti Step 1-5
echo.
echo 🛑 Tekan Ctrl+C untuk stop server
echo.
echo ================================================================================
echo.

node index.js

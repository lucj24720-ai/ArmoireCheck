@echo off
echo ========================================
echo ArmoireCheck - Verification Installation
echo ========================================
echo.

echo [CHECK] Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Node.js non installe
    echo [INFO] Installer depuis https://nodejs.org/
    exit /b 1
) else (
    node --version
    echo [OK] Node.js installe
)
echo.

echo [CHECK] npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] npm non installe
    exit /b 1
) else (
    npm --version
    echo [OK] npm installe
)
echo.

echo [CHECK] Backend dependencies...
if not exist "backend\node_modules" (
    echo [WARN] Dependencies backend non installees
    echo [RUN] Installation des dependencies...
    cd backend
    call npm install
    cd ..
    echo [OK] Dependencies backend installees
) else (
    echo [OK] Dependencies backend presentes
)
echo.

echo [CHECK] Frontend dependencies...
if not exist "frontend\node_modules" (
    echo [WARN] Dependencies frontend non installees
    echo [RUN] Installation des dependencies...
    cd frontend
    call npm install
    cd ..
    echo [OK] Dependencies frontend installees
) else (
    echo [OK] Dependencies frontend presentes
)
echo.

echo [CHECK] Fichier backend/.env...
if not exist "backend\.env" (
    echo [WARN] Fichier .env manquant
    echo [INFO] Copie de .env.example vers .env
    copy "backend\.env.example" "backend\.env" >nul
    echo [WARN] IMPORTANT: Editer backend\.env avec vos valeurs
    echo [INFO] Notamment DATABASE_URL et JWT_SECRET
) else (
    echo [OK] Fichier .env present
)
echo.

echo [CHECK] Fichier frontend/.env...
if not exist "frontend\.env" (
    echo [WARN] Fichier .env manquant
    echo [INFO] Copie de .env.example vers .env
    copy "frontend\.env.example" "frontend\.env" >nul
    echo [WARN] IMPORTANT: Editer frontend\.env avec vos valeurs
) else (
    echo [OK] Fichier .env present
)
echo.

echo [CHECK] PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] PostgreSQL non installe localement
    echo.
    echo ========================================
    echo SOLUTIONS RECOMMANDEES:
    echo ========================================
    echo.
    echo Option 1 - DOCKER (LE PLUS SIMPLE):
    echo   docker-compose up -d
    echo   Puis ouvrir http://localhost:3000
    echo.
    echo Option 2 - NEON (Cloud gratuit):
    echo   1. Creer compte sur https://neon.tech
    echo   2. Copier la connection string
    echo   3. Editer backend\.env
    echo   4. cd backend ^&^& npm run dev
    echo.
    echo Option 3 - INSTALLER PostgreSQL:
    echo   https://www.postgresql.org/download/windows/
    echo.
) else (
    psql --version
    echo [OK] PostgreSQL installe
)
echo.

echo [CHECK] Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Docker non installe (optionnel)
    echo [INFO] Telecharger: https://www.docker.com/products/docker-desktop
) else (
    docker --version
    echo [OK] Docker installe
)
echo.

echo ========================================
echo ETAT DE L'INSTALLATION
echo ========================================
echo.

if not exist "backend\.env" (
    echo [ACTION REQUISE] Configurer backend\.env
)
if not exist "frontend\.env" (
    echo [ACTION REQUISE] Configurer frontend\.env
)

echo.
echo Pour demarrer l'application:
echo.
echo   cd backend
echo   npm run dev
echo.
echo   (Dans un autre terminal)
echo   cd frontend
echo   npm start
echo.
echo Voir TROUBLESHOOTING.md pour plus d'aide
echo Voir START_HERE.md pour le guide complet
echo.

pause

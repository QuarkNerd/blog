@echo off

REM TODO Change path to the blog builds folder
set blogBuildDir=C:\blah\blogbuild
set repo=%blogBuildDir%\blog
cd %repo%

REM get the time using WMIC - as it provides a format we can work with
set X=
for /f "skip=1 delims=" %%x in ('wmic os get localdatetime') do if not defined X set X=%%x

REM dissect into parts
set DATE.YEAR=%X:~0,4%
set DATE.MONTH=%X:~4,2%
set DATE.DAY=%X:~6,2%
set DATE.HOUR=%X:~8,2%
set DATE.MINUTE=%X:~10,2%
set DATE.SECOND=%X:~12,2%

set timestamp=%DATE.YEAR%.%DATE.MONTH%.%DATE.DAY%.%DATE.HOUR%.%DATE.MINUTE%.%DATE.SECOND%

set logfile="%blogBuildDir%\build_%timestamp%.log"

REM Temporary file for checking fetch results
set tempFetchResult="%blogBuildDir%\tempFetchResult"

REM Check for updates
git fetch>%tempFetchResult% 2>&1

if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Failed to fetch from remote repository>> %logfile%
  rm %tempFetchResult%
  exit 1
)

REM Check for content in fetch result. If file is none-empty, then we have incoming changes
for /F "delims=" %%F in (%tempFetchResult%) do set size=%%~zF
rm %tempFetchResult%

if %size% GTR 0 (
  echo [INFO] %timestamp% - Incoming changes from remote repo>%logfile%
  for /F "delims=" %%o in ('git rev-parse HEAD') do set oldrev=%%o
  for /F "delims=" %%n in ('git rev-parse origin/gh-pages') do set newrev=%%n
  
  git merge origin/gh-pages
  if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to merge incoming changes>>%logfile%
    exit 1 
  )
) else (
  REM No incoming changes - do nothing.
  exit 0
)

echo %newrev%>> %blogBuildDir%\last-received.log

REM Get timestamp for current version and log it
for /F "delims=" %%c in (%blogBuildDir%\current.txt) do echo [INFO] Previous version was %oldrev% on %%c>>%logfile%

echo [INFO] Building for new version %newrev%>> %logfile%

call bundle exec jekyll build --config _config.yml,_live.yml >>%logfile% 2>&1

if %ERRORLEVEL% EQU 0 (
  echo [INFO] Jekyll build ok>> %logfile%

  echo [INFO] Backing up current version to %blogBuildDir%\backups\backup-%timestamp%\>>%logfile%
  
  REM Backup what is currently served from this location
  xcopy /E path\to\live %blogBuildDir%\backups\backup-%timestamp%\
  
  REM Copy new build from \_site\ to location used to serve live site
  REM TODO Change this to point to the correct location for live site
  REM TODO Delete/clean the current live version first ?
  echo [INFO] Copying new build to path\to\live >>%logfile%
  xcopy /E /Y %repo%\_site path\to\live\

  echo %timestamp%>%blogBuildDir%\current.txt

  echo [INFO] Finished: SUCCESS>>%logfile%
) else (
  echo [ERROR] Jekyll build error>> %logfile%
  echo [INFO] Finished: FAILED>> %logfile%
)

exit
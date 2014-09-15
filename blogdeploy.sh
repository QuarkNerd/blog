#!/bin/bash

# Script to poll github for change on gh-pages branch of blogs

cd /opt/blogbuild/blog-repo

timestamp=`date +%FT%H%M`
logfile=/opt/blogbuild/build-$timestamp.log

# Check if branch has moved on
tmpfile=$(mktemp)
/usr/bin/git fetch &> $tmpfile

rc=$?
if [[ $rc -ne 0 ]]; then
    echo "[ERROR] Failed to fetch from remote repository" >> $logfile
    exit $rc
fi

if [[ -s $tmpfile ]]; then
    oldrev=$(/usr/bin/git rev-parse HEAD)
    newrev=$(/usr/bin/git rev-parse origin/gh-pages)
  
    /usr/bin/git merge origin/gh-pages
else
    # No changes to make. 
    exit 0
fi

rm $tmpfile

# Modified from post-receive script

echo "$timestamp $oldrev $newrev" >> /opt/blogbuild/debug.log

# Switch publish to 0 and uncomment block to limit to deploying only if commit
# is on gh-pages branch. Gh-pages is only branch at the moment, so unneeded
publish=1;
# if [[ `git branch --contains $newrev | grep -i 'gh-pages'` ]];
# then
#  # Commit is present on gh-pages branch
#  publish=1;
# fi

function deployToEnv() {
    instancename=$1
    publishhostname=$2
    
    /usr/bin/rsync --rsh='ssh -p2202' -az --delete \
        /opt/blogbuild/blog-repo/_site/ \
        continuum@$publishhostname:/cygdrive/c/inetpub/wwwroot-scottweb-blog/incoming \
        >> $logfile 2>&1 \
    && /usr/bin/ssh -p2202 continuum@$publishhostname " \
            echo \"[INFO] Deploying to $instancename\" \
        && echo \"[INFO] Previous version was \`cat /cygdrive/c/inetpub/wwwroot-scottweb-blog/current.txt\`\" \
        && echo \"[INFO] New version is $timestamp\" \
        && /bin/rsync -az --delete /cygdrive/c/inetpub/wwwroot-scottweb-blog/incoming/ /cygdrive/c/inetpub/wwwroot-scottweb-blog/backups/$timestamp \
        && echo \"[INFO] Copying incoming to backups/$timestamp\" \
        && echo \"[INFO] Syncing incoming to current\" \
        && /bin/rsync -az --delete /cygdrive/c/inetpub/wwwroot-scottweb-blog/incoming/ /cygdrive/c/inetpub/wwwroot-scottweb-blog/current \
        && echo -n \"Current is $timestamp\" > /cygdrive/c/inetpub/wwwroot-scottweb-blog/current.txt" \
        >> $logfile 2>&1
    rcrs=$?
    if [[ $rcrs -eq 0 ]]; then
        echo "[INFO] rsync ok" >> $logfile
        echo "$newrev $instancename" >> /opt/blogbuild/last-received-successful
        buildresult="SUCCESS"
    else
        echo "[ERROR] rsync error for instance $instancename" >> $logfile
        buildresult="ERROR - rsync error"
    fi
    
    echo "[INFO] Finished: $buildresult" >> $logfile
    /bin/mail -s "Website $instancename Blog Build - $buildresult" bloggers@scottlogic.co.uk < $logfile > /dev/null 2>&1
}

echo "$newrev" >> /opt/blogbuild/last-received

if [[ publish -eq 1 ]]; then

    echo "[INFO] $timestamp" > $logfile
    #echo "" >> $logfile
    #/usr/bin/git log -n 1 >> $logfile 2>&1
    echo "" >> $logfile
    echo "[INFO] Building for $newrev" >> $logfile
    echo "" >> $logfile
    # TODO Change path!
    /path/to/bundle exec jekyll build --config _config.yml,_live.yml >> $logfile
    rc=$?
    echo "" >> $logfile

    if [[ $rc -eq 0 ]]; then
        echo "[INFO] Jekyll build ok" >> $logfile
        
        # TODO Eventually we may stop deploying to dev/content
        deployToEnv "dev" "vb-app-c.scottlogic.co.uk";
        deployToEnv "content" "vb-app-b.visiblox.com";
        deployToEnv "live" "vb-app-a.visiblox.com";
        
    else
        echo "[ERROR] jekyll build error" >> $logfile
        buildresult="ERROR - jekyll error"
        
        echo "[INFO] Finished: $buildresult" >> $logfile
        /bin/mail -s "Website Blog Build - $buildresult" bloggers@scottlogic.co.uk < $logfile > /dev/null 2>&1
    fi

fi

exit
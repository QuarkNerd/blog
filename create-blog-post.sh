#!/bin/sh

# A script to create a blog post template
# Creates a template post in <author>/_posts/YY-mm-dd-<title>.html
# Created by Sam Hogarth

set -e

usage="Usage: $(basename "$0") <author> <title>

outputs: Creates a template post in <author>/_posts/YY-mm-dd-<title>.html"

isValidFileName ()
{
  #echo "$1" | egrep -q '^[[:alnum:]]+$'
  [ test -f "$1" ] && return 0 || return 1
}

isExistingFile()
{
  [ -f "$1" ] && return 0 || return 1
}

goToDir()
{
  if [ ! -d $1 ]
   then
    mkdir $1
  fi
  cd $1
}

error()
{
  echo "ERROR: $1"
  echo "$usage"
  exit
}

# Validate user input
if [ -z "$1" ]
 then
   error 'No author supplied'
fi

if [ -z "$2" ]
 then
  error 'No title supplied'
fi

# Set variables
author=$1
date=$(date -I)
separator="-"
title=${2// /$separator}
format=".html"
filename=$date$separator$title$format

# Go to target directory
goToDir $author
goToDir "_posts"

if isValidFileName "$filename"
 then
  error "File $filename is invalid"
fi

if isExistingFile "$filename"
 then
  error "File $filename already exists"
fi

# Create templated blog post
touch $filename

echo "---" >> $filename
echo "author: $author" >> $filename
echo "title: $title" >> $filename
echo "layout: default_post">> $filename
echo "---" >> $filename

echo "Created $author/_posts/$filename"

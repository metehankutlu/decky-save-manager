#! usr/bin/bash

dir="/home/deck/homebrew/plugins/decky-save-manager"

if [[ ! -d $dir ]]; then
    mkdir $dir
else
    echo "directory exists"
fi

if [ "$(ls -A $dir/*)" ]; then
    rm -r $dir/*
    echo "deleted the contents of the directory"
else
    echo "directory is already empty"
fi

cp -r dist/ $dir/dist/
echo "copied the dist folder"
cp main.py $dir/main.py
echo "copied the main.py file"
cp game_list.py $dir/game_list.py
echo "copied the game_list.py file"
cp plugin.json $dir/plugin.json
echo "copied the plugin.json file"
cp package.json $dir/package.json
echo "copied the package.json file"
cp README.md $dir/README.md
echo "copied the README.md file"

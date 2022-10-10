#! usr/bin/bash

dir="/home/deck/homebrew/plugins/decky-save-manager"

if ssh deck "[ -d $dir ] && rm -r $dir"; then
    echo "removed the old version"
fi

if ssh deck "mkdir $dir"; then
    echo "created the plugin folder"
fi

if scp -r dist deck:$dir/dist; then
    echo "copied the dist folder"
fi

if scp main.py deck:$dir/main.py; then
    echo "copied the main.py file"
fi

if scp game_list.py deck:$dir/game_list.py; then
    echo "copied the game_list.py file"
fi

if scp plugin.json deck:$dir/plugin.json; then
    echo "copied the plugin.json file"
fi

if scp package.json deck:$dir/package.json; then
    echo "copied the package.json file"
fi

if ssh deck "chmod -R 700 $dir"; then
    echo "permissions are set for the directory"
fi
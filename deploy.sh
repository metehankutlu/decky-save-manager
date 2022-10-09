#! usr/bin/bash

dir="/home/deck/homebrew/plugins/decky-save-manager"

ssh deck 'rm -r $dir'

ssh deck 'mkdir $dir'
echo 'created the plugin folder'

scp -r dist deck:$dir/dist
echo "copied the dist folder"
scp main.py deck:$dir/main.py
echo "copied the main.py file"
scp game_list.py deck:$dir/game_list.py
echo "copied the game_list.py file"
scp plugin.json deck:$dir/plugin.json
echo "copied the plugin.json file"
scp package.json deck:$dir/package.json
echo "copied the package.json file"
scp README.md deck:$dir/README.md
echo "copied the README.md file"

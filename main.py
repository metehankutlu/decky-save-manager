import logging
import os
from pathlib import Path
import shutil

log_format = '[Decky Save Manager] %(asctime)s %(levelname)s %(message)s'
logging.basicConfig(filename='/tmp/decky-save-manager.log',
                    format=log_format,
                    filemode='w+',
                    force=True)
logger = logging.getLogger()
logger.setLevel(logging.NOTSET)

ROOT_FOLDER = 'decky-save-manager'


class Plugin:
    async def create_savestate(self,
                               game_id: str,
                               profile_id: str,
                               savestate_id: str,
                               save_path: str):

        folder_path = os.path.join(
            ROOT_FOLDER, game_id, profile_id, savestate_id)
        os.makedirs(folder_path)

        _, tail = os.path.split(save_path)

        dst_file = os.path.join(folder_path, tail)

        shutil.copyfile(save_path, dst_file)

    async def load_savestate(self,
                             game_id: str,
                             profile_id: str,
                             savestate_id: str,
                             save_path: str):

        folder_path = os.path.join(
            ROOT_FOLDER, game_id, profile_id, savestate_id)

        _, tail = os.path.split(save_path)

        src_file = os.path.join(folder_path, tail)

        shutil.copyfile(src_file, save_path)

    async def delete_game(self, game_id: str):
        folder_path = os.path.join(ROOT_FOLDER, game_id)

        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)

    async def delete_profile(self,
                             game_id: str,
                             profile_id: str):
        folder_path = os.path.join(
            ROOT_FOLDER, game_id, profile_id)

        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)

    async def delete_savestate(self,
                               game_id: str,
                               profile_id: str,
                               savestate_id: str):
        folder_path = os.path.join(
            ROOT_FOLDER, game_id, profile_id, savestate_id)

        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)

    async def filepicker_new(self, path, include_files=True):
        path = Path(path).resolve()

        files = []

        for file in path.iterdir():
            is_dir = file.is_dir()
            is_hidden = file.name.startswith('.')
            if file.exists() and (is_dir or include_files):
                files.append({
                    "isdir": is_dir,
                    "ishidden": is_hidden,
                    "name": file.name,
                    "realpath": str(file.resolve()),
                    "size": file.stat().st_size,
                    "modified": file.stat().st_mtime,
                    "created": file.stat().st_ctime,
                })

        return {
            "realpath": str(path),
            "files": files
        }

    async def _main(self):
        if not os.path.exists(ROOT_FOLDER):
            os.makedirs(ROOT_FOLDER)

import logging
import os
import shutil
import uuid
from pathlib import Path

# Initialize decky-loader settings manager
from settings import SettingsManager  # type: ignore

# Setup environment variables
deckyHomeDir = os.environ["DECKY_HOME"]
settingsDir = os.environ["DECKY_PLUGIN_SETTINGS_DIR"]
loggingDir = os.environ["DECKY_PLUGIN_LOG_DIR"]

log_format = '[Decky Save Manager] %(asctime)s %(levelname)s %(message)s'
logging.basicConfig(filename=os.path.join(loggingDir, 'backend.log'),
                    format=log_format,
                    filemode='w+',
                    force=True)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

settingsPath = os.path.join(deckyHomeDir, 'settings', 'save-manager.json')

logger.info('Settings path: {}'.format(settingsPath))
settings = SettingsManager(name="save-manager", settings_directory=settingsDir)
settings.read()

ROOT_FOLDER = 'decky-save-manager'


def save_setting(collection_name: str, value: dict):
    collection = settings.getSetting(collection_name, {})
    collection[value["id"]] = value
    settings.setSetting(collection_name, collection)
    settings.commit()


def delete_setting(collection_name: str, id: str):
    collection = settings.getSetting(collection_name, {})
    if id in collection.keys():
        del collection[id]
        settings.setSetting(collection_name, collection)
        settings.commit()


class Plugin:
    async def get_list(self, collection_name: str, condition: dict = None):
        collection = settings.getSetting(collection_name, {})

        if condition is not None:
            collection = [c for c in collection
                          if c[condition["key"]] == condition["value"]]

        return collection

    async def upsert_game(self, game: dict):
        if "id" not in game.keys():
            game["id"] = uuid.uuid4()

        folder_path = os.path.join(
            ROOT_FOLDER,
            game["id"],
        )
        os.makedirs(folder_path)

        save_setting("games", game)

    async def upsert_profile(self, profile: dict):
        if "id" not in profile.keys():
            profile["id"] = uuid.uuid4()

        folder_path = os.path.join(
            ROOT_FOLDER,
            profile["game_id"],
            profile["id"]
        )
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        save_setting("profiles", profile)

    async def upsert_savestate(self, savestate: dict):
        if "id" not in savestate.keys():
            savestate["id"] = uuid.uuid4()

        folder_path = os.path.join(
            ROOT_FOLDER,
            savestate["game_id"],
            savestate["profile_id"],
            savestate["id"]
        )
        os.makedirs(folder_path)

        _, tail = os.path.split(savestate["path"])

        dst_file = os.path.join(folder_path, tail)

        shutil.copyfile(savestate["path"], dst_file)

        save_setting("savestates", savestate)

    async def load_savestate(self, savestate_id: str):
        savestates = settings.getSetting("savestates", {})
        savestate = savestates[savestate_id]

        folder_path = os.path.join(
            ROOT_FOLDER,
            savestate["game_id"],
            savestate["profile_id"],
            savestate_id
        )

        _, tail = os.path.split(savestate["path"])

        src_file = os.path.join(folder_path, tail)

        shutil.copyfile(src_file, savestate["path"])

    async def delete_game(self, game_id: str):
        folder_path = os.path.join(ROOT_FOLDER, game_id)

        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)

        delete_setting("games", game_id)

    async def delete_profile(self,
                             game_id: str,
                             profile_id: str):
        folder_path = os.path.join(
            ROOT_FOLDER, game_id, profile_id)

        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)

        delete_setting("profiles", profile_id)

    async def delete_savestate(self,
                               game_id: str,
                               profile_id: str,
                               savestate_id: str):
        folder_path = os.path.join(
            ROOT_FOLDER, game_id, profile_id, savestate_id)

        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)

        delete_setting("savestates", savestate_id)

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

    async def settings_read(self):
        logger.info('Reading settings')
        return settings.read()

    async def settings_commit(self):
        logger.info('Saving settings')
        return settings.commit()

    async def settings_getSetting(self, key: str, defaults):
        logger.info('Get {}'.format(key))
        return settings.getSetting(key, defaults)

    async def settings_setSetting(self, key: str, value):
        logger.info('Set {}: {}'.format(key, value))
        return settings.setSetting(key, value)

    async def _main(self):
        if not os.path.exists(ROOT_FOLDER):
            os.makedirs(ROOT_FOLDER)

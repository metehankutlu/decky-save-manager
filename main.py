import logging
import os
import json
import shutil
from uuid import uuid4

from game_list import games

logging.basicConfig(filename='/tmp/template.log',
                    format='[Template] %(asctime)s %(levelname)s %(message)s',
                    filemode='w+',
                    force=True)
logger=logging.getLogger()
logger.setLevel(logging.INFO) # can be changed to logging.DEBUG for debugging issues

ROOT_FOLDER = '~/.save-manager'
DB_PATH = f'{ROOT_FOLDER}/db.json'

def read_db():
    with open(DB_PATH, 'r') as db_file:
        return json.load(db_file)

def write_db(db):
    with open(DB_PATH, 'w') as db_file:
        json.dump(db, db_file)

class Plugin:
    async def get_data(self):
        return {"123": {"name": "asd"}}
            
    async def check_save_location(self, app_id: str):
        game = read_db()[app_id]
        path = os.path.join(game['save_location'], game['save_name'])
        if os.path.isfile(path) and os.access(path, os.R_OK):
            return {"result": 'true'}
        else:
            return {"result": 'false'}

    async def create_profile(self, app_id: str, name: str, save_location: str = None):
        db = read_db()

        if save_location is not None:
            db[app_id]['save_location'] = save_location

        profile = {
            'id': str(uuid4()),
            'name': name,
            'savestates': []
        }

        db[app_id]['profiles'][profile['id']] = profile

        folder_path = os.path.join(ROOT_FOLDER, app_id, profile['id'])
        os.makedirs(folder_path)

        write_db(db)

        return {'success': 'true'}

    async def delete_profile(self, app_id: str, profile_id: str):
        db = read_db()

        del db[app_id]['profiles'][profile_id]

        folder_path = os.path.join(ROOT_FOLDER, app_id, profile_id)

        shutil.rmtree(folder_path)

        write_db(db)

        return {'success': 'true'}

    
    async def rename_profile(self, app_id: str, profile_id: str, name: str):
        db = read_db()

        db[app_id]['profiles'][profile_id]['name'] = name

        write_db(db)

        return {'success': 'true'}

    async def import_savestate(self, app_id: str, profile_id: str, name: str):
        db = read_db()

        game = db[app_id]

        savestate = {
            'id': str(uuid4()),
            'name': name
        }

        db[app_id]['profiles'][profile_id]['savestates'][savestate['id']] = savestate
        
        folder_path = os.path.join(ROOT_FOLDER, app_id, profile_id, savestate['id'])
        os.makedirs(folder_path)

        src_file = os.path.join(game['save_location'], game['save_name'])
        dst_file = os.path.join(folder_path, game['save_name'])
        shutil.copyfile(src_file, dst_file)

        write_db(db)

        return {'success': 'true'}

    async def load_savestate(self, app_id: str, profile_id: str, savestate_id: str):
        db = read_db()

        game = db[app_id]
        savestate = db[app_id]['profiles'][profile_id]['savestates'][savestate_id]

        folder_path = os.path.join(ROOT_FOLDER, app_id, profile_id, savestate['id'])

        src_file = os.path.join(folder_path, game['save_name'])
        dst_file = os.path.join(game['save_location'], game['save_name'])
        shutil.copyfile(src_file, dst_file)

        return {'success': 'true'}

    async def delete_savestate(self, app_id: str, profile_id: str, savestate_id: str):
        db = read_db()

        del db[app_id]['profiles'][profile_id]['savestates'][savestate_id]

        write_db(db)

        return {'success': 'true'}

    
    async def rename_savestate(self, app_id: str, profile_id: str, savestate_id: str, name: str):
        db = read_db()

        db[app_id]['profiles'][profile_id]['savestates'][savestate_id]['name'] = name

        write_db(db)

        return {'success': 'true'}

    async def _main(self):
        if not os.path.exists(ROOT_FOLDER):
            os.makedirs(ROOT_FOLDER)

        if os.path.isfile(DB_PATH) and os.access(DB_PATH, os.R_OK):
            logger.info('File exists and is readable')
        else:
            logger.info('Either file is missing or is not readable, creating file...')
            write_db(games)
        
        for game_id in games.keys():
            path = os.path.join(ROOT_FOLDER, game_id)
            if not os.path.exists(path):
                os.makedirs(path)

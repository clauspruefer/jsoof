import os
import time
import json

from datetime import datetime

import dbpool.pool


DBName = 'rvb'
DBUser = 'postgres'
DBHost = 'appserver.lan.cb.kw.webcodex.de'
DBPass = 'dummy'

config = {
    'db': {
        'host': DBHost,
        'name': DBName,
        'user': DBUser,
        'pass': DBPass,
        'ssl': 'disable',
        'connect_timeout': 30,
        'connection_retry_sleep': 5,
        'query_timeout': 10,
        'session_tmp_buffer': 128
    },
    'groups': {
        'rvb': {
            'connection_count': 3,
            'autocommit': True,
        }
    }
}

config_ac_disabled = {
    'db': {
        'host': DBHost,
        'name': DBName,
        'user': DBUser,
        'pass': DBPass,
        'ssl': 'disable',
        'connect_timeout': 30,
        'connection_retry_sleep': 5,
        'query_timeout': 10,
        'session_tmp_buffer': 128
    },
    'groups': {
        'rvb': {
            'connection_count': 3,
            'autocommit': False,
        }
    }
}


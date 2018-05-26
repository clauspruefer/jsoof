# modules import
import sys
import json

import DB
import DBMapping
import dbpool.pool

import POSTData

dbpool.pool.Connection.init(DB.config)


def application(environ, start_response):

    # start response
    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        service_json = json.loads(POSTData.Environment.getPOSTData(environ))
        data_req = service_json['RequestData']
        data_srv = service_json['ServiceData']

        #try:
        sql = DBMapping.mapping[data_srv['ServiceID']]['sql']
        index = IndexGenerator()

        # iterate on results
        with dbpool.pool.Handler('rvb') as db:
            tmpResult = {}
            for tmpRecord in db.query(sql):
                tmpDict = {
                    "display":  tmpRecord[0],
                    "value":    tmpRecord[1],
                }
                tmpResult[next(index)] = tmpDict

        #except Exception as e:
        #    tmpResult['error'] = True
        #    tmpResult['exception'] = type(e).__name__

        # output result iterator
        yield bytes(json.dumps(tmpResult), 'utf-8')


def IndexGenerator():
    counter = -1
    while True:
        counter += 1
        yield str(counter)

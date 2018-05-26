# modules import
import sys
import json

import DB
import DBMapping
import dbpool.pool

import POSTData

dbpool.pool.Connection.init(DB.config_ac_disabled)


def application(environ, start_response):

    # start response
    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        result = {}

        service_json = json.loads(POSTData.Environment.getPOSTData(environ))
        data_req = service_json['RequestData']

        src_ids = []
        for key in data_req:
            src_ids.append(data_req[key]['DBPrimaryKeyID'])

        ids = tuple(src_ids)

        sql_insert = "  INSERT \
                        INTO \
                        shipment \
                        ( \
                            sender, \
                            comment \
                        ) \
                        VALUES \
                        ( \
                            'RVB', \
                            'Auto generated Comment' \
                        ) \
                        RETURNING id"

        sql_update = "  UPDATE \
                        packaging \
                        SET \
                            shipment_id = %s, \
                            status = 20 \
                        WHERE \
                        id IN %s"

        try:
            with dbpool.pool.Handler('rvb') as db:
                c = db.query(sql_insert)
                rec = c.fetchone()
                db.query(sql_update, (rec['id'], ids,))
                result['id'] = rec['id']
            
        except Exception as e:
            result['error'] = True
            result['exception_id'] = type(e).__name__
            result['exception'] = "{0}".format(e)

        # output result iterator
        yield bytes(json.dumps(result), 'utf-8')


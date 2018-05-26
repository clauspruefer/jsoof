# modules import
import sys
import json

import DB
import DBMapping
import POSTData

import dbpool.pool

dbpool.pool.Connection.init(DB.config)


def application(environ, start_response):

    # start response
    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        tmp_result = {}

        service_json = json.loads(POSTData.Environment.getPOSTData(environ))

        try:
            data_req = service_json['RequestData']
            data_srv = service_json['ServiceData']
            config = DBMapping.mapping[data_srv['BackendServiceID']]
            sql_params = {} 

            for param in config['params']:
                try:
                    param_prepend = config['modify'][param]['prepend']
                    param_append = config['modify'][param]['append']
                except:
                    param_prepend = ''
                    param_append = ''
                sql_params[param] = "{}{}{}".format(param_prepend, data_req[param], param_append)

                if isinstance(data_req[param], str) and len(sql_params[param]) == 0:
                    sql_params[param] = None
                if isinstance(data_req[param], str) and sql_params[param] == '<NULL>':
                    sql_params[param] = None

            # iterate on results
            with dbpool.pool.Handler('rvb') as db:
                c = db.query(config['sql'], sql_params)
                if c.description is not None:
                    for row_index in range (0, c.rowcount):
                        rec = c.fetchone()
                        tmp_record = {}
                        for key in rec.keys():
                            tmp_record[key] = rec[key]
                        tmp_result[row_index] = tmp_record
                yield bytes(json.dumps(tmp_result), 'utf-8')

        except Exception as e:
            tmp_result['error'] = True
            tmp_result['exception_id'] = type(e).__name__
            tmp_result['exception'] = "{0}".format(e)

            # output result iterator
            yield bytes(json.dumps(tmp_result), 'utf-8')


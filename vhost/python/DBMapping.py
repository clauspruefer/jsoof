mapping = {
    'contact_new': {
        'sql': " INSERT \
                 INTO \
                 receiver \
                 ( \
                     name, \
                     street, \
                     zipcode, \
                     country, \
                     mail_address, \
                     phone \
                 ) \
                     VALUES \
                 ( \
                    %(ContactNewName)s, \
                    %(ContactNewStreet)s, \
                    %(ContactNewZipcode)s, \
                    %(ContactNewCountry)s, \
                    %(ContactNewMailAddress)s, \
                    %(ContactNewPhone)s \
                 ) \
                 RETURNING id",
        'params': [
            'ContactNewName',
            'ContactNewStreet',
            'ContactNewZipcode',
            'ContactNewCountry',
            'ContactNewMailAddress',
            'ContactNewPhone'
        ]
    },
    'contact_update': {
        'sql': " UPDATE \
                 receiver \
                 SET \
                     name = %(ContactUpdateName)s, \
                     street = %(ContactUpdateStreet)s, \
                     zipcode = %(ContactUpdateZipcode)s, \
                     country = %(ContactUpdateCountry)s, \
                     mail_address = %(ContactUpdateMailAddress)s, \
                     phone = %(ContactUpdatePhone)s \
                 WHERE \
                     id = %(DBPrimaryKeyValue)s \
                     RETURNING id",
        'params': [
            'ContactUpdateName',
            'ContactUpdateStreet',
            'ContactUpdateZipcode',
            'ContactUpdateCountry',
            'ContactUpdateMailAddress',
            'ContactUpdatePhone',
            'DBPrimaryKeyValue'
        ]
    },
    'contact_edit': {
        'sql': " SELECT \
                    id, \
                    name, \
                    street, \
                    zipcode, \
                    country, \
                    mail_address, \
                    phone \
                 FROM \
                    receiver \
                 WHERE \
                    id = %(DBPrimaryKeyValue)s",
        'params': [
            'DBPrimaryKeyValue'
        ]
    },
    'contact_delete': {
        'sql': " DELETE \
                 FROM \
                 receiver \
                 WHERE \
                    id = %(DBPrimaryKeyValue)s",
        'params': [
            'DBPrimaryKeyValue',
        ]
    },
    'contact_search': {
        'sql': " SELECT \
                  id, \
                  name, \
                  street, \
                  zipcode, \
                  country, \
                  mail_address, \
                  phone \
                 FROM receiver \
                 WHERE \
                   name LIKE %(ContactSearchName)s AND \
                   CASE WHEN %(ContactSearchDateFrom)s IS NOT NULL AND %(ContactSearchDateTo)s IS NOT NULL THEN \
                    created BETWEEN %(ContactSearchDateFrom)s AND %(ContactSearchDateTo)s \
                   ELSE \
                    1 = 1 \
                   END \
                 ORDER BY id DESC",
        'params': [
            'ContactSearchName',
            'ContactSearchDateFrom',
            'ContactSearchDateTo'
        ],
        'modify': {
            'ContactSearchName': {
                'prepend': '%',
                'append': '%'
            }
        }
    },
    'article_new': {
        'sql': " INSERT \
                 INTO \
                 packaging \
                 ( \
                     receiver_id, \
                     packaging_type, \
                     packaging_subtype, \
                     packaging_content, \
                     packaging_mark, \
                     quantity, \
                     stamping, \
                     remark_1, \
                     remark_2, \
                     remark_3, \
                     remark_4 \
                 ) \
                     VALUES \
                 ( \
                    %(ArticleNewReceiver)s, \
                    %(ArticleNewPackagingType)s, \
                    %(ArticleNewPackagingSubType)s, \
                    %(ArticleNewPackagingContent)s, \
                    %(ArticleNewPackagingMark)s, \
                    %(ArticleNewQuantity)s, \
                    %(ArticleNewStamping)s, \
                    %(ArticleNewRemark1)s, \
                    %(ArticleNewRemark2)s, \
                    %(ArticleNewRemark3)s, \
                    %(ArticleNewRemark4)s \
                 ) \
                 RETURNING id",
        'params': [
            'ArticleNewReceiver',
            'ArticleNewPackagingType',
            'ArticleNewPackagingSubType',
            'ArticleNewPackagingContent',
            'ArticleNewPackagingMark',
            'ArticleNewQuantity',
            'ArticleNewStamping',
            'ArticleNewRemark1',
            'ArticleNewRemark2',
            'ArticleNewRemark3',
            'ArticleNewRemark4'
        ]
    },
    'article_update': {
        'sql': " UPDATE \
                 packaging \
                 SET \
                     receiver_id = %(ArticleUpdateReceiver)s, \
                     packaging_type = %(ArticleUpdatePackagingType)s, \
                     packaging_subtype = %(ArticleUpdatePackagingSubType)s, \
                     packaging_content = %(ArticleUpdatePackagingContent)s, \
                     packaging_mark = %(ArticleUpdatePackagingMark)s, \
                     quantity = %(ArticleUpdateQuantity)s, \
                     stamping = %(ArticleUpdateStamping)s, \
                     remark_1 = %(ArticleUpdateRemark1)s, \
                     remark_2 = %(ArticleUpdateRemark2)s, \
                     remark_3 = %(ArticleUpdateRemark3)s, \
                     remark_4 = %(ArticleUpdateRemark4)s \
                 WHERE id = %(DBPrimaryKeyValue)s \
                 RETURNING id \
                 ",
        'params': [
            'ArticleUpdateReceiver',
            'ArticleUpdatePackagingType',
            'ArticleUpdatePackagingSubType',
            'ArticleUpdatePackagingContent',
            'ArticleUpdatePackagingMark',
            'ArticleUpdateQuantity',
            'ArticleUpdateStamping',
            'ArticleUpdateRemark1',
            'ArticleUpdateRemark2',
            'ArticleUpdateRemark3',
            'ArticleUpdateRemark4',
            'DBPrimaryKeyValue'
        ]
    },
    'article_search': {
        'sql': " SELECT \
                  id_status AS id, \
                  to_char(created, 'DD.MM.YYYY HH24:MI:SS') AS created_f, \
                  to_char(modified, 'DD.MM.YYYY HH24:MI:SS') AS modified_f, \
                  receiver_name AS receiver, \
                  quantity, \
                  packaging_content, \
                  status_textual AS status \
                 FROM \
                  packaging_status \
                 WHERE \
                  CASE WHEN %(ArticleSearchReceiver)s IS NOT NULL THEN \
                   receiver_id = %(ArticleSearchReceiver)s \
                  ELSE \
                   1 = 1 \
                  END \
                   AND \
                  CASE WHEN %(ArticleSearchDateFrom)s IS NOT NULL AND %(ArticleSearchDateTo)s IS NOT NULL THEN \
                   created BETWEEN %(ArticleSearchDateFrom)s AND %(ArticleSearchDateTo)s \
                  ELSE \
                   1 = 1 \
                  END \
                 ORDER BY created DESC",
        'params': [
            'ArticleSearchReceiver',
            'ArticleSearchDateFrom',
            'ArticleSearchDateTo'
        ]
    },
    'article_edit': {
        'sql': " SELECT \
                    id, \
                    receiver_id, \
                    packaging_type, \
                    packaging_subtype, \
                    packaging_content, \
                    quantity, \
                    stamping, \
                    remark_1, \
                    remark_2, \
                    remark_3, \
                    remark_4 \
                 FROM \
                    packaging \
                 WHERE \
                    id = %(DBPrimaryKeyValue)s",
        'params': [
            'DBPrimaryKeyValue'
        ]
    },
    'article_selected': {
        'sql': " SELECT \
                    id, \
                    to_char(created, 'DD.MM.YYYY HH24:MI:SS') AS created_f, \
                    to_char(modified, 'DD.MM.YYYY HH24:MI:SS') AS modified_f, \
                    receiver_name AS receiver, \
                    packaging_type, \
                    packaging_subtype, \
                    packaging_content, \
                    packaging_mark, \
                    quantity, \
                    stamping, \
                    remark_1, \
                    remark_2, \
                    remark_3, \
                    remark_4 \
                 FROM \
                    packaging_receiver \
                 WHERE \
                    status = 10 \
                 ORDER BY created DESC",
        'params': []
    },
    'article_delete': {
        'sql': " DELETE \
                 FROM \
                 packaging \
                 WHERE \
                    id = %(DBPrimaryKeyValue)s",
        'params': [
            'DBPrimaryKeyValue',
        ]
    },
    'shipment_assign_source': {
        'sql': " SELECT \
                  id, \
                  to_char(created, 'DD.MM.YYYY HH24:MI:SS') AS created_f, \
                  to_char(modified, 'DD.MM.YYYY HH24:MI:SS') AS modified_f, \
                  quantity, \
                  packaging_content, \
                  packaging_type, \
                  concat(receiver_name, ' - ', receiver_mail_address) AS receiver \
                 FROM \
                 packaging_receiver \
                 WHERE \
                   shipment_id is NULL \
                   AND \
                   status = 10 \
                 ORDER BY \
                 created DESC",
        'params': []
    },
    'shipment_assign_confirm': {
        'sql': " SELECT \
                  id, \
                  to_char(created, 'DD.MM.YYYY HH24:MI:SS') AS created_f, \
                  to_char(modified, 'DD.MM.YYYY HH24:MI:SS') AS modified_f, \
                  quantity, \
                  packaging_content, \
                  packaging_type, \
                  concat(receiver_name, ' - ', receiver_mail_address) AS receiver \
                 FROM \
                 packaging_receiver \
                 WHERE \
                   shipment_id = %(DBPrimaryKeyValue)s \
                 ORDER BY \
                 created DESC",
        'params': [
            'DBPrimaryKeyValue'
        ]
    },
    'shipment_history_receiver': {
        'sql': " SELECT \
                  id, \
                  shipment_id, \
                  to_char(created, 'DD.MM.YYYY HH24:MI:SS') AS created_f, \
                  to_char(modified, 'DD.MM.YYYY HH24:MI:SS') AS modified_f, \
                  quantity, \
                  packaging_content, \
                  packaging_type, \
                  concat(receiver_name, ' - ', receiver_mail_address) AS receiver, \
                  packaging_mark \
                 FROM \
                  packaging_shipment \
                 WHERE \
                  CASE WHEN %(ShipmentHistoryReceiverReceiver)s IS NOT NULL THEN \
                   receiver_id = %(ShipmentHistoryReceiverReceiver)s \
                  ELSE \
                   1 = 1 \
                  END \
                 ORDER BY \
                  shipment_id DESC, \
                  created DESC",
        'params': [
            'ShipmentHistoryReceiverReceiver'
        ]
    },
    'shipment_history_shipment': {
        'sql': " SELECT \
                  id, \
                  shipment_id, \
                  to_char(created, 'DD.MM.YYYY HH24:MI:SS') AS created_f, \
                  to_char(modified, 'DD.MM.YYYY HH24:MI:SS') AS modified_f, \
                  quantity, \
                  packaging_content, \
                  packaging_type, \
                  concat(receiver_name, ' - ', receiver_mail_address) AS receiver, \
                  packaging_mark \
                 FROM \
                 packaging_shipment \
                 WHERE \
                  shipment_id = %(ShipmentHistoryShipmentID)s \
                 ORDER BY \
                 shipment_id DESC, \
                 created DESC",
        'params': [
            'ShipmentHistoryShipmentID'
        ]
    },
    'shipment_history_phone': {
        'sql': " SELECT \
                  id, \
                  shipment_id, \
                  to_char(created, 'DD.MM.YYYY HH24:MI:SS') AS created_f, \
                  to_char(modified, 'DD.MM.YYYY HH24:MI:SS') AS modified_f, \
                  quantity, \
                  packaging_content, \
                  packaging_type, \
                  concat(receiver_name, ' - ', receiver_mail_address) AS receiver, \
                  packaging_mark \
                 FROM \
                 packaging_shipment \
                 WHERE \
                  receiver_phone LIKE %(ShipmentHistoryReceiverPhoneNr)s \
                 ORDER BY \
                 shipment_id DESC, \
                 created DESC",
        'params': [
            'ShipmentHistoryReceiverPhoneNr'
        ],
        'modify': {
            'ShipmentHistoryReceiverPhoneNr': {
                'prepend': '%',
                'append': '%'
            }
        }
    },
    'shipment_detail': {
        'sql': " SELECT \
                  id, \
                  comment \
                 FROM \
                 shipment \
                 WHERE \
                   id = %(SourceObjectSelectedColumnValue)s",
        'params': [
            'SourceObjectSelectedColumnValue'
        ]
    },
    'shipment_detail_list': {
        'sql': " SELECT \
                  id, \
                  to_char(created, 'DD.MM.YYYY HH24:MI:SS') AS created, \
                  to_char(modified, 'DD.MM.YYYY HH24:MI:SS') AS modified, \
                  quantity, \
                  packaging_content, \
                  packaging_type, \
                  concat(receiver_name, ' - ', receiver_mail_address) AS receiver, \
                  packaging_mark \
                 FROM \
                 packaging_shipment \
                 WHERE \
                   shipment_id = %(SourceObjectSelectedColumnValue)s \
                 ORDER BY \
                 created \
                 ASC",
        'params': [
            'SourceObjectSelectedColumnValue'
        ]
    },
    'dynpd_article_new_receiver': {
        'sql': " SELECT \
                 concat(name, ' - ', mail_address) as display, id as value  \
                 FROM \
                 receiver \
                 ORDER BY name ASC"
    },
}

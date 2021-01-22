const sqlite3 = require('sqlite3').verbose()

exports.get = function (db_source, table, ret, filter = null, fvalue = null) {
    let db = new sqlite3.Database(db_source, (err) => {
        if (err) throw err;
        let sql = `SELECT * FROM ${table}`
        if (filter != null) {
            sql = `SELECT * FROM ${table} WHERE ${filter}=${fvalue}`
        }
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) throw err;
            final_data = {
                "message": "success",
                "data": rows
            }
            ret.json(final_data)
        });

    });
};
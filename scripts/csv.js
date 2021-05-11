const stringify = require('csv-stringify');

function toCSV(data, callback){
    let rows = [];
    let stream = stringify({delimiter: ',', columns:['id', 'date', 'usage', 'balance', 'desc']});
    stream.on("readable", () => {
        let row;
        while (row = stream.read()){
            rows.push(row);
        }
    });
    stream.on("error", (err) => {
        console.error(err.message);
    });
    stream.on("finish", () => {
        let out = "id, date, usage, balance, desc\n";
        out += rows.join('');
        callback(out);
    });
    for (let i of data){
        stream.write(i);
    }
    stream.end();
}

exports.toCSV = toCSV;
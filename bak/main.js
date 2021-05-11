const stringify = require('csv-stringify')
const assert = require('assert')
const data = []
const stringifier = stringify({
    delimiter: ',',
    columns: ['name', 'age']
})
stringifier.on('readable', function(){
    let row;
    while(row = stringifier.read()){
        data.push(row)
    }
})
stringifier.on('error', function(err){
    console.error(err.message)
})
stringifier.on('finish', function(){
    console.log(String(data))
})
stringifier.write({name: 'ssss', age: 10});
stringifier.write({name: 'ssss', age: 10});
// stringifier.write([ 'someone','x','1022','1022','','/home/someone','/bin/bash' ])
// stringifier.write([ 'someone','x','1022','1022','','/home/someone','/bin/bash' ])
stringifier.end()
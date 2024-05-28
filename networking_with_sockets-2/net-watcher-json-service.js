'use strict'
const { timeStamp } = require('console');
const fs = require('fs');
const net = require('net');
const filename = process.argv[2];

if(!filename){
    throw Error('Error: No file name specified.');
}

net.createServer(connection => {
    //Reporting
    console.log('Subcriber connected.');
    connection.write(JSON.stringify({type:'watching',file: filename}) + '\n');

    //Watcher setup
    const watcher = fs.watch(filename,()=> connection.write(JSON.stringify({
        type: 'changed', timeStamp: Date.now()
    }) + '\n'));

    //cleanup
    connection.on('close',()=> {
        console.log('subscriber disconnected');
        watcher.close();
    })
}).listen(60300, () => console.log('listening for subscribers...'));

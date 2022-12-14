const sqlite3 = require('sqlite3').verbose();
const brewDB = new sqlite3.Database('brewDB');
const grainDB = new sqlite3.Database('grainDB');

//ensure that all commands run sequentially
brewDB.serialize(() => {
    //create each table if they do no exist yet
    brewDB.run('CREATE TABLE IF NOT EXISTS batch (batchID INT, name TEXT, nameGrainBill TEXT, startDate TEXT, status INT)'); // status is a boolean
    brewDB.run('CREATE TABLE IF NOT EXISTS mash (batchID INT, mashInExp REAL, mashInAct REAL, spargeInExp REAL, spargeInAct REAL, date TEXT, notes TEXT)');
    brewDB.run('CREATE TABLE IF NOT EXISTS kettle (batchID INT, wortCol REAL, waterAdded REAL, preBoilGrav REAL, postBoilGrav REAL, preBoilVol REAL, postBoilVol REAL, date TEXT, notes TEXT)');
    brewDB.run('CREATE TABLE IF NOT EXISTS fermentor (batchID INT, dataID INT, plato REAL, ph REAL, temp REAL, date TEXT, notes TEXT)');
    brewDB.run('CREATE TABLE IF NOT EXISTS centrifuge (batchID INT, turbidity REAL, date TEXT, notes TEXT)');
    brewDB.run('CREATE TABLE IF NOT EXISTS brite (batchID INT,  volumeIn REAL, carbonation REAL, date TEXT, notes TEXT)');
    brewDB.run('CREATE TABLE IF NOT EXISTS output (batchID INT, halfBarrel INT, sixthBarrel INT, cases INT, notes TEXT)');
});

//create a top level grain db to store each table name
grainDB.serialize(() => {
    grainDB.run('CREATE TABLE IF NOT EXISTS metadata (grainName TEXT)');
});

module.exports = {brewDB: brewDB,grainDB: grainDB};
const sqlite3 = require('sqlite3').verbose();
const brewDB = new sqlite3.Database('brewDB');
const grainDB = new sqlite3.Database('grainDB');



brewDB.serialize(() => {
    brewDB.all(`SELECT * FROM batch`, function (err, rows){
        console.log("Batches Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });
    
    brewDB.all(`SELECT * FROM mash`, function (err, rows){
        console.log("Mash Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });

    brewDB.all(`SELECT * FROM kettle`, function (err, rows){
        console.log("Kettle Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });

    brewDB.all(`SELECT * FROM fermentor`, function (err, rows){
        console.log("Fermentor Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });

    brewDB.all(`SELECT * FROM centrifuge`, function (err, rows){
        console.log("Centrifuge Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });

    brewDB.all(`SELECT * FROM brite`, function (err, rows){
        console.log("Brite Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });

    brewDB.all(`SELECT * FROM output`, function (err, rows){
        console.log("Output Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });
});

//print grainBill infor
grainDB.serialize(() => {
    grainDB.all(`SELECT grainName FROM metadata`, 
        function(err, rows){
            if(!err){
                let grainNames = rows.map(row => row['grainName']);
                console.log('Metadata:', grainNames);
                grainDB.serialize(() => {
                    grainNames.map(nameGrain => {
                        grainDB.all(`SELECT * FROM ${nameGrain}`, 
                            function (err, rows) {
                                if (!err){
                                    console.log('Grain Table:', nameGrain);
                                    rows.map(row => console.log(row));
                                }
                            }
                        );
                    });
                });
            } else console.log(err);
        }
    );
});






    
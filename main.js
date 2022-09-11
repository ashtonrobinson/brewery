// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const { brewDB, grainDB } = require('./db.js');
const path = require('path');
const { kMaxLength } = require('buffer');

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'main/preload.js'),
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname,'main/index.html'));
  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // functions to create windows
  ipcMain.on('createBatchWindow', handleCreateBatchWindow);
  ipcMain.on('createBatchWindowExisting', handleCreateBatchWindowFromExisting)
  ipcMain.on('createViewWin', handleCreateViewWindow);
  ipcMain.on('createMashWin', handleCreateMashWindow);
  ipcMain.on('createKettleWin', handleCreateKettleWindow);
  ipcMain.on('createFermentorWin', handleCreateFermentorWindow);
  ipcMain.on('createCentrifugeWin', handleCreateCentrifugeWindow);
  ipcMain.on('createBriteWin', handleCreateBriteWindow);
  ipcMain.on('createOutputWin', handleCreateOutputWindow);
  ipcMain.on('createGrainWin', handleCreateGrainWin);
  ipcMain.on('createFermentorDataWin', handleCreateFermentorDataWin);

  //close modal windows
  ipcMain.on('closeEntryWin', handleCloseEntryWin);

  //set data
  ipcMain.on('setMashData', handleSetMashData);
  ipcMain.on('setKettleData', handleSetKettleData);
  ipcMain.on('changeStatus', handleChangeStatus);
  ipcMain.on('createBatchEntry', handleCreateNewBatch);
  ipcMain.on('createBatchExistingGrain', handleCreateNewBatch);
  ipcMain.on('addFermentorData', handleAddFermentorData);
  ipcMain.on('updateFermentorData', handleUpdateFermentorData);
  ipcMain.on('updateCentrifugeData', handleUpdateCentrifugeData);
  ipcMain.on('setBriteData', handleSetBriteData);
  ipcMain.on('updateOutputData', handleUpdateOutputData);

  //get data
  ipcMain.handle('mashData', handleGetMashData);
  ipcMain.handle('kettleData', handleGetKettleData);
  ipcMain.handle('fermentorData', handleGetFermentorData);
  ipcMain.handle('batchData', handleBatchDataAll);
  ipcMain.handle('getCentrifugeData', handleGetCentrifugeData);
  ipcMain.handle('getBriteData', handleGetBriteData);
  ipcMain.handle('getGrainData', handleGrainData);
  ipcMain.handle('getGrainBillName', handleGetGrainBillName);
  ipcMain.handle('getNameFromID', handleGetNameFromId);
  ipcMain.handle('getOutputData', handleGetOutputData);
  ipcMain.handle('getGrainBillNames', handleGetGrainBills);

  //remove data
  ipcMain.on('remove', handleRemove);
  
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// close the database on quitting
app.on('will-quit', () => {
  brewDB.close();
  grainDB.close();
});

// HELPER METHODS TO REMOVE DATA
function handleRemove(event, batchID) {
  brewDB.run(`DELETE FROM batch WHERE batchID=${batchID}`, function(err) {if (err) console.log(err)});
  brewDB.run(`DELETE FROM mash WHERE batchID=${batchID}`, function(err) {if (err) console.log(err)});
  brewDB.run(`DELETE FROM kettle WHERE batchID=${batchID}`, function(err) {if (err) console.log(err)});
  brewDB.run(`DELETE FROM fermentor WHERE batchID=${batchID}`, function(err) {if (err) onsole.log(err)});
  brewDB.run(`DELETE FROM centrifuge WHERE batchID=${batchID}`, function(err) {if (err) console.log(err)});
  brewDB.run(`DELETE FROM brite WHERE batchID=${batchID}`, function(err) {if (err) onsole.log(err)});
  brewDB.run(`DELETE FROM output WHERE batchID=${batchID}`, function(err) {if (err) console.log(err)});
}

//HELPER METHODS TO GET DATA
async function handleGetGrainBills(event){
  let grain = await getGrainBills();
  return grain;
}

function handleGetOutputData(event, batchID) {
  return new Promise((resolve, reject) => {
    brewDB.get(`SELECT * FROM output WHERE batchID=${batchID}`, 
      function(err, row){
        if(!err) resolve(row)
        else reject(err);
      }
    );
  });
}

function handleGetBriteData(event, batchID) {
  return new Promise((resolve, reject) => {
    brewDB.get(`SELECT * FROM brite WHERE batchID=${batchID}`,
      function(err, row){
        if(!err) resolve(row)
        else reject(err);
      }
    );
  });
}

function handleGetFermentorData(event, batchID) {
  return new Promise((resolve, reject) => {
    brewDB.all(`SELECT * FROM fermentor WHERE batchID=${batchID} ORDER BY dataID`,
      function(err, rows){
        if(!err) resolve(rows)
        else reject(err);
      }
    )
  });
}

function handleGetNameFromId(event, batchID){
  return new Promise((resolve, reject) => {
    brewDB.get(`SELECT name FROM batch WHERE batchID=${batchID}`,
      function (err, row){
        if(!err) resolve(row['name']);
        else reject(err);
      }
    )
  });
}

function handleGetKettleData(event, batchID){
  return new Promise((resolve, reject) => {
    brewDB.get(`SELECT * FROM kettle WHERE batchID=${batchID}`,
      function (err, row){
        if (!err) resolve(row)
        else reject(err);
      }
    );
  });
}

function handleGetMashData(event, batchID){
  return new Promise((resolve, reject) => {
    brewDB.get(`SELECT * FROM mash WHERE batchID=${batchID}`,
      function(err, row){
        if (!err) resolve(row)
        else reject(err);
      }
    );
  });
}
// retrieve info about all batches
function handleBatchDataAll() {
  return new Promise((resolve,reject) => {
    brewDB.all('SELECT * FROM batch', 
      function(err, rows){
        if (!err){
          resolve(rows);
        } else {
          reject(err);
        }
      }
    );
  });
}

function handleGrainData(event, batchID){
  return new Promise((resolve, reject) => {
    brewDB.get(`SELECT nameGrainBill FROM batch WHERE batchID=${batchID}`,
      function (err, row){
        let grainBill = row['nameGrainBill'];
        if (!err){
          grainDB.all(`SELECT * FROM ${grainBill}`, function (err, rows){
            if(!err){
              resolve(rows);
            } else {
              reject(err);
            }
          });
        }
    });
  });
}

function handleGetGrainBillName(event, batchID){
  return new Promise((resolve, reject) => {
    brewDB.get(`SELECT nameGrainBill FROM batch WHERE batchID=${batchID}`,
      function (err, row){
        if(!err){
          let grainBill = row['nameGrainBill'];
          resolve(grainBill);
        } else reject(err); 
    });
  });
}

function handleGetCentrifugeData(event, batchID){
  return new Promise((resolve, reject) => {
    brewDB.get(`SELECT * FROM centrifuge WHERE batchID=${batchID}`,
      function (err, row){ 
        if(!err) resolve(row)
        else reject(row);
      });
  });
}


//HELPER METHODS TO UPDATE DATA
function handleUpdateOutputData(event, batchID, data){
  let notes = data.notes ? `"${data.notes}"` : null;
  let sixth = data.sixthBbl ? data.sixthBbl : null;
  let half = data.halfBbl ? data.halfBbl : null;
  let cases = data.cases ? data.cases : null;

  brewDB.run(`UPDATE output SET halfBarrel=${half}, sixthBarrel=${sixth}, cases=${cases}, notes=${notes}`);
}

function handleSetBriteData(event, batchID, data) {
  let date = data.date;
  let carbonation = data.carbonation ? data.carbonation : null;
  let volumeIn = data.volumeIn ? data.volumeIn : null;
  let notes = data.notes ? `"${data.notes}"` : null;

  brewDB.run(`UPDATE brite SET volumeIn=${volumeIn}, carbonation=${carbonation}, date="${date}", notes=${notes}`);
}

function handleUpdateCentrifugeData(event, batchID, data){
  let date = data.date;
  let turbidity = data.turbidity ? data.turbidity : null;
  let notes = data.notes ? `"${data.notes}"` : null;

  brewDB.run(`UPDATE centrifuge SET turbidity=${turbidity}, date="${date}", notes=${notes} WHERE batchID=${batchID}`);
}

function handleUpdateFermentorData(event, batchID, data){
  let plato = data.plato ? data.plato : null;
  let ph = data.ph ? data.ph : null;
  let temp = data.temp ? data.temp : null;
  let notes = data.notes ? `"${data.notes}"` : null;
  let date = data.date ? data.date : null;

  // this is required for entry manipulation 
  let dataID = data.dataID;

  brewDB.run(`UPDATE fermentor SET plato=${plato}, ph=${ph}, temp=${temp}, notes=${notes}, date="${date}" WHERE batchID=${batchID} AND dataID=${dataID}`,
    function (err){ console.log(err) } 
  );

}

function handleAddFermentorData(event, data, batchID){
  brewDB.get(`SELECT MAX(dataID) FROM fermentor WHERE batchID=${batchID}`,
    function (err, row){
      if(!err){
        console.log(err);
        console.log(row);
        let newID;
        if (row['MAX(dataID)'] != 0 || row['MAX(dataID)'] == null) newID = 0;
        else newID = row['MAX(dataID)'] + 1;

        let plato = data.plato ? data.plato : null;
        let ph = data.ph ? data.ph : null;
        let temp = data.temp ? data.temp : null;
        let notes = data.notes ? `"${data.notes}"` : null;
        const date = (new Date()).toLocaleDateString();

        brewDB.run(`INSERT INTO fermentor VALUES (${batchID}, ${newID}, ${plato}, ${ph}, ${temp}, "${date}", ${notes})`);
      } 
    }
  );


  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
 
  const mainWin = win.getParentWindow();
  mainWin.reload();

  win.close();
}

function handleSetMashData(event, batchID, data){
  let date = data.date ? data.date : null;
  let mashEx = data.mashExpIn ? data.mashExpIn : null;
  let mashAct = data.mashActIn ? data.mashActIn : null;
  let spargeExp = data.spargeExpIn ? data.spargeExpIn : null;
  let spargeAct = data.spargeActIn ? data.spargeActIn : null;
  let notes = data.notes ? data.notes : null;

  brewDB.run(`UPDATE mash SET mashInExp=${mashEx}, mashInAct=${mashAct}, spargeInExp=${spargeExp},\
    spargeInAct=${spargeAct}, notes="${notes}", date="${date}" WHERE batchID=${batchID}`);
}

function handleSetKettleData(event, batchID, data){
  let date = data.date ? data.date : null;
  let wortCol = data.wortCol ? data.wortCol : null;
  let preBoilGrav = data.preBoilGrav ? data.preBoilGrav : null;
  let postBoilGrav = data.postBoilGrav ? data.postBoilGrav : null;
  let preBoilVol = data.preBoilVol ? data.preBoilVol : null;
  let postBoilVol = data.postBoilVol ? data.postBoilVol : null;
  let waterAdded = data.waterAdded ? data.waterAdded : null;
  let notes = data.notes ? `"${data.notes}"` : null;

  brewDB.run(`UPDATE kettle SET wortCol=${wortCol}, waterAdded=${waterAdded}, preBoilGrav=${preBoilGrav}, postBoilGrav=${postBoilGrav},\
    preBoilVol=${preBoilVol}, postBoilVol=${postBoilVol}, notes=${notes},  date="${date}" WHERE batchID=${batchID}`);
}


function handleChangeStatus(event, batchID){
  brewDB.get(`SELECT status FROM batch WHERE batchID=${batchID}`, 
    function (err, row){
      const stat = row['status'];
      const newStatus = stat == 0 ? 1 : 0;
      if(!err){
        brewDB.run(`UPDATE batch SET status=${newStatus} WHERE batchID=${batchID}`);
      }
    }
  );
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.reload();
}

async function getNextBatchID() {
  return new Promise((resolve, reject) => {
    brewDB.get('SELECT MAX(batchID) FROM batch;', 
    function (err, row) {
      let batchID;
      if (!err) {
        if (row['MAX(batchID)']) {batchID = row['MAX(batchID)']+1}
        else {batchID = 1}

        resolve(batchID);
      } else reject(err);
    });
  });
}

//add data entries to the database, entires is list 
// of (grainType,lbGrain) in form (string,float)
async function handleCreateNewBatch(event, name, grainBill, entries) {
  //find the largest batch ID and add one to it
  const batchID = await getNextBatchID();
  const date = (new Date()).toLocaleDateString();

  if(entries) {
    let data = await getGrainBills();
    if (data){
      let grainNames = data.map(d => d['grainName']);
      if (grainNames.includes(grainBill)){
        // check if copy has been made alredy
        let numCopies = grainNames.filter(n => n.startsWith(grainBill));
        if (numCopies.length > 1){
          let largestCopy = numCopies[numCopies.length-1];
          let num = Number(largestCopy.substring(largestCopy.length-1)) + 1;
          grainBill = grainBill.concat(num.toString());
        } else {
          grainBill = grainBill.concat('1');
        }
      }
    }
    addGrainBill(entries, grainBill);
  }

  brewDB.serialize(() => {
    brewDB.run(`INSERT INTO batch VALUES (${batchID}, "${name}", "${grainBill}", "${date}", FALSE);`);
    brewDB.run(`INSERT INTO mash (batchID, date) VALUES (${batchID}, "${date}")`);
    brewDB.run(`INSERT INTO kettle (batchID, date) VALUES (${batchID}, "${date}")`);
    brewDB.run(`INSERT INTO centrifuge (batchID) VALUES (${batchID})`);
    brewDB.run(`INSERT INTO brite (batchID) VALUES (${batchID})`);
    brewDB.run(`INSERT INTO output (batchID) VALUES (${batchID})`);
  });
  
  const webContents = event.sender;
  const createWin = BrowserWindow.fromWebContents(webContents);
  
  // get parent window and update existing batches
  const mainWin = createWin.getParentWindow();
  mainWin.reload();

  //finally close the window
  createWin.close();
}

async function getGrainBills(){
  return new Promise((resolve, reject) => {
    grainDB.all(`SELECT grainName FROM metadata`, 
      function (err, rows){
        if(!err) resolve(rows)
        else reject(err);
      }
    )
  });
}

function addGrainBill(entries, grainBill){
  grainDB.run(`INSERT INTO metadata (grainName) VALUES ("${grainBill}")`);
  let grainQueue = [];
  // enter the grain entries
  entries.map(entry => {
    let grainType = entry[0];
    let lbGrain = entry[1];

    grainQueue.push(`INSERT INTO ${grainBill} (grainType, grainLb) VALUES ("${grainType}", ${lbGrain});`)
  });

  // TODO: problem if table exists and the details of the grain bill is different
  grainDB.run(`CREATE TABLE ${grainBill} (grainType TEXT, grainLb REAL);`, 
    function (err){
      if(!err){
        grainQueue.map(sql => {
          grainDB.run(sql);
        });
      } else {
        console.log(err);
      }
    }
  );
}

//HELPER METHODS TO CREATE NEW WINDOWS
function handleCreateFermentorDataWin(event, batchID){
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const entryWin = new BrowserWindow({
    parent: parent,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, 'brewProcess/fermentor/preloadDataEntry.js'),
      additionalArguments: [`${batchID}`]
    }
  });

  entryWin.loadFile(path.join(__dirname, 'brewProcess/fermentor/dataEntry.html'));
  //entryWin.webContents.openDevTools();
}

function handleCreateGrainWin(event, batchID){
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const viewWin = new BrowserWindow({
    width: 1000,
    height: 800,
    parent: parent,
    webPreferences: {
      preload: path.join(__dirname, 'brewProcess/grain/preloadGrain.js'),
      additionalArguments: [`${batchID}`],
    }
  });

  viewWin.loadFile(path.join(__dirname, 'brewProcess/grain/grain.html'));
  viewWin.webContents.openDevTools();
}

function handleCreateMashWindow(event, batchID){
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const viewWin = new BrowserWindow({
    width: 1000,
    height: 800,
    parent: parent,
    webPreferences: {
      preload: path.join(__dirname, 'brewProcess/mash/preloadMash.js'),
      additionalArguments: [`${batchID}`],
    }
  });

  viewWin.loadFile(path.join(__dirname, 'brewProcess/mash/mash.html'));
  //viewWin.webContents.openDevTools();
}

function handleCreateKettleWindow(event, batchID){
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const viewWin = new BrowserWindow({
    width: 1000,
    height: 800,
    parent: parent,
    webPreferences: {
      preload: path.join(__dirname, 'brewProcess/kettle/preloadKettle.js'),
      additionalArguments: [`${batchID}`],
    }
  });

  viewWin.loadFile(path.join(__dirname, 'brewProcess/kettle/kettle.html'));
  //viewWin.webContents.openDevTools();
}

function handleCreateFermentorWindow(event, batchID){
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const viewWin = new BrowserWindow({
    width: 1000,
    height: 800,
    parent: parent,
    webPreferences: {
      preload: path.join(__dirname, 'brewProcess/fermentor/preloadFermentor.js'),
      additionalArguments: [`${batchID}`],
    }
  });

  viewWin.loadFile(path.join(__dirname, 'brewProcess/fermentor/fermentor.html'));
  viewWin.webContents.openDevTools();
}

function handleCreateCentrifugeWindow(event, batchID){
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const viewWin = new BrowserWindow({
    width: 1000,
    height: 800,
    parent: parent,
    webPreferences: {
      preload: path.join(__dirname, 'brewProcess/centrifuge/preloadCentrifuge.js'),
      additionalArguments: [`${batchID}`],
    }
  });

  viewWin.loadFile(path.join(__dirname, 'brewProcess/centrifuge/centrifuge.html'));
  viewWin.webContents.openDevTools();
}

function handleCreateBriteWindow(event, batchID){
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const viewWin = new BrowserWindow({
    width: 1000,
    height: 800,
    parent: parent,
    webPreferences: {
      preload: path.join(__dirname, 'brewProcess/brite/preloadBrite.js'),
      additionalArguments: [`${batchID}`],
    }
  });

  viewWin.loadFile(path.join(__dirname, 'brewProcess/brite/brite.html'));
  viewWin.webContents.openDevTools();
}

function handleCreateOutputWindow(event, batchID){
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const viewWin = new BrowserWindow({
    width: 1000,
    height: 800,
    parent: parent,
    webPreferences: {
      preload: path.join(__dirname, 'brewProcess/output/preloadOutput.js'),
      additionalArguments: [`${batchID}`],
    }
  });

  viewWin.loadFile(path.join(__dirname, 'brewProcess/output/output.html'));
  viewWin.webContents.openDevTools();
}

// id is the batchID number
function handleCreateViewWindow(event, batchID) {
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const viewWin = new BrowserWindow({
    width: 1000,
    height: 800,
    parent: parent,
    webPreferences: {
      preload: path.join(__dirname, 'details/preloadDetails.js'),
      additionalArguments: [`${batchID}`],
    }
  });

  viewWin.loadFile(path.join(__dirname, 'details/details.html'));
  //viewWin.webContents.openDevTools();
}

function handleCreateBatchWindow(event) {
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const batchWindow = new BrowserWindow({
    parent: parent,
    webPreferences: {
      preload: path.join(__dirname, 'create/preloadBatch.js'),
    }
  });

  batchWindow.loadFile(path.join(__dirname,'create/createBatch.html'));
  //batchWindow.webContents.openDevTools();
}

function handleCreateBatchWindowFromExisting(event) {
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const batchWindow = new BrowserWindow({
    parent: parent,
    webPreferences: {
      preload: path.join(__dirname, 'create/existingGrain/preloadCreateFromExisting.js')
    }
  });

  batchWindow.loadFile(path.join(__dirname, 'create/existingGrain/createFromExisting.html'));
  batchWindow.webContents.openDevTools();
}

//functions to close modal windows
function handleCloseEntryWin(event){
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.close();
}




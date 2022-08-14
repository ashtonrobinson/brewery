// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const { brewDB, grainDB } = require('./db.js');
const path = require('path');

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
  // create the window for new batch entry
  ipcMain.on('createBatchWindow', handleCreateBatchWindow);
  // create the database entry for new batch
  ipcMain.on('createBatchEntry', handleCreateNewBatch);
  // retrieve the data and return it to the UI
  ipcMain.handle('batchData', handleBatchDataAll);
  //open the details page for certain batch
  ipcMain.on('createViewWin', handleCreateViewWindow);
  //get grain bill data for specific grain bill 
  ipcMain.handle('getGrainData', handleGrainData);
  ipcMain.on('changeStatus', handleChangeStatus);

  // functions to create windows to view and manipulate data 
  ipcMain.on('createMashWin', handleCreateMashWindow);
  ipcMain.on('createKettleWin', handleCreateKettleWindow);
  ipcMain.on('createFermentorWin', handleCreateFermentorWindow);
  ipcMain.on('createCentrifugeWin', handleCreateCentrifugeWindow);
  ipcMain.on('createBriteWin', handleCreateBriteWindow);
  ipcMain.on('createOutputWin', handleCreateOutputWindow);
  ipcMain.on('createGrainWin', handleCreateGrainWin);

  ipcMain.on('setMashData', handleSetMashData);
  ipcMain.on('setKettleData', handleSetKettleData);

  //get mash data
  ipcMain.handle('mashData', handleGetMashData);
  ipcMain.handle('kettleData', handleGetKettleData);

  ipcMain.handle('getGrainBillName', handleGetGrainBillName);
  ipcMain.handle('getNameFromID', handleGetNameFromId);

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

//HELPER METHODS TO GET DATA
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


//HELPER METHODS TO UPDATE DATA
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
  console.log(data);
  let date = data.date ? data.date : null;
  let wortCol = data.wortCol ? data.wortCol : null;
  let preBoilGrav = data.preBoilGrav ? data.preBoilGrav : null;
  let postBoilGrav = data.postBoilGrav ? data.postBoilGrav : null;
  let preBoilVol = data.preBoilVol ? data.preBoilVol : null;
  let postBoilVol = data.postBoilVol ? data.postBoilVol : null;
  let waterAdded = data.waterAdded ? data.waterAdded : null;
  let notes = data.notes ? data.notes : null;

  console.log(`UPDATE kettle SET wortCol=${wortCol}, waterAdded=${waterAdded}, preBoilGrav=${preBoilGrav}, postBoilGrav=${postBoilGrav},\
  preBoilVol=${preBoilVol}, postBoilVol=${postBoilVol}, notes="${notes}", date="${date}" WHERE batchID=${batchID}`);
  
  brewDB.run(`UPDATE kettle SET wortCol=${wortCol}, waterAdded=${waterAdded}, preBoilGrav=${preBoilGrav}, postBoilGrav=${postBoilGrav},\
    preBoilVol=${preBoilVol}, postBoilVol=${postBoilVol}, notes="${notes}", date="${date}" WHERE batchID=${batchID}`,
    function (err) {console.log(err)});
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

//add data entries to the database, entires is list 
// of (grainType,lbGrain) in form (string,float)
function handleCreateNewBatch(event, name, grainBill, entries) {
  //find the largest batch ID and add one to it
  brewDB.get('SELECT MAX(batchID) FROM batch;', 
    function (err, row) {
      let batchID;
      if (!err) {
        if (row['MAX(batchID)']) {batchID = row['MAX(batchID)']+1}
        else {batchID = 1}

        const date = (new Date()).toLocaleDateString();
        // query to add the next entry
        
        brewDB.run(`INSERT INTO batch VALUES (${batchID}, "${name}", "${grainBill}", "${date}", FALSE);`);
        brewDB.run(`INSERT INTO mash (batchID, date) VALUES (${batchID}, "${date}")`);
        brewDB.run(`INSERT INTO kettle (batchID, date) VALUES (${batchID}, "${date}")`);
      } else {
        console.log(err);
      }
    }
  );

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
  
  const webContents = event.sender;
  const createWin = BrowserWindow.fromWebContents(webContents);
  
  // get parent window and update existing batches
  const mainWin = createWin.getParentWindow();
  mainWin.reload();

  //finally close the window
  createWin.close();
}


//HELPER METHODS TO CREATE NEW WINDOWS
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
  viewWin.webContents.openDevTools();
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
  viewWin.webContents.openDevTools();
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



// create child window to input grain data
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


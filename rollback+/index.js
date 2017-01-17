/*
* Author: DeathTech (https://github.com/DeathTech154/)
* Version: 0.0.1
*/
module.exports = (config) => {
   const constants = config.common.constants,
   storage = config.common.storage,
   cli = config.cli,
   engine = config.engine,
   backend = config.backend;
   // Configurable section -!!- Please don't modify anything else unless you are willing to face db curruption.
   let enableAutoBackup = 1 // Set to 0 to only take manual backups.
   let enableAutoStart = 1 // Auto start game after a rollback? 1= Yes 0= No
   
   // Time definitions for frequency.
   let second = 1
   let minute = 60
   let hour = 3600
   let day = 86400

   let backup_type = "time"; // Options: "tick" or "time" !NOTE! Tick based does not work yet.
   let backup_frequency = 600; // Options: If type is "tick" this means every 5 ticks. Else frequency is in seconds.

   let blocktimer = 10000; // Manages how long the system will wait before resuming normal function (warning low value may cause incomplete or corrupt db's)
   let TBRBA = 5000; // Time between rollback Actions -> Extend time to ensure operations complete in sequence.
   var CurRecTick = 0
   // Thanks to the above preconfigured statements you can mix & match.
   
   // End of config section.
   
   backup_frequency = backup_frequency * 1000 // Convert sec to ms
   if(cli) {
      cli.on('cliSandbox', function(sandbox) {
         //sandbox.test = function() {console.log('Current game tick is:', sandbox.Game.time);}
         var fs = require('fs');

         // Setup Chronjob backup -> Needs decider logic for tick or time based.
         function rbAutoBackup() {
            if (backup_type == "tick") {}// Not ready Don't use
            else {
               // Use time based
               var date = Date();
               var testdate = date.split(" ");
               var timestamp = testdate[4].split(":");
               var organisedDate =  testdate[3] + "-" + testdate[1] + "-" + testdate[2] + "-" + timestamp[0] + "-" + timestamp[1] + "-" + timestamp[2];
               rbBackup(organisedDate);
               setTimeout(function () {rbAutoBackup()},backup_frequency);
            }
         }
         
         function rollBack(name) {// Game time set to 1292334
            sandbox.system.pauseSimulation();
            // Start the great chain of hope. setTimeout(function () {},1000);
            setTimeout(function () {loadeddb = fs.readFileSync(__dirname + '/backups/'+name+'/db.json');fs.writeFileSync(__dirname + '/../../node_modules/@screeps/storage/db.original.json', loadeddb);
            setTimeout(function () {sandbox.system.ResetAllData();sandbox.print("database loaded");
            setTimeout(function () {loadeddb = fs.readFileSync(__dirname + '/backups/db.original.json');fs.writeFileSync(__dirname + '/../../node_modules/@screeps/storage/db.original.json', loadeddb);if (enableAutoStart==1){sandbox.system.resumeSimulation()}
            },TBRBA);
            },TBRBA);
            },TBRBA);// Sorry about the hell on this one. Its just easier.
         }
         
         // Manual Backup -> Will be called at chronjob interval -> Cleanup for tick or dateTime use please
         function rbBackup(name) {
            sandbox.system.pauseSimulation();
            curtick = storage.env.get(storage.env.keys.GAMETIME)
            cblocktimer = blocktimer
            if (blocktimer) {
               if (!fs.existsSync(__dirname + '/backups/'+name)){
                   fs.mkdirSync(__dirname + '/backups/'+name);
               }
               loadeddb = fs.readFileSync(__dirname + '/../../db.json');
               while (cblocktimer > 0){cblocktimer--}
               cblocktimer = blocktimer
               newfile = fs.openSync(__dirname + '/backups/'+name+'/db.json', 'w');
               fs.closeSync(newfile);
               fs.writeFileSync(__dirname + '/backups/'+name+'/db.json', loadeddb);
               sandbox.system.resumeSimulation();
               //setTimeout(function () {rbAutoBackup()},backup_frequency);
            }
         }
         sandbox.rollback = function(){sandbox.print("Databack Backup Mod");}
         sandbox.rollback.backup = rbBackup
         sandbox.rollback.startauto = rbAutoBackup
         sandbox.rollback.restore = rollBack
         //sandbox.getTick = getTick
         if (enableAutoBackup == 1) {
            setTimeout(function () {rbAutoBackup()},backup_frequency);
         }
      });
   }
};
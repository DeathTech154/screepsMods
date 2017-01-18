/*
* Author: DeathTech (https://github.com/DeathTech154/)
* Version: 0.0.2
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
   let backup_frequency = 60; // Options: If type is "tick" this means every 5 ticks. Else frequency is in seconds.
   let backup_format = "%u-%Y-%M-%D-%h-%m-%s";
   /* Options for formatting: 
      %D = day   %m = minute
      %M = month %s = second
      %Y = year  %b = unique_backup_number*
      %h = hour  %t = time since Jan 1 1970
      %u = unix timestamp (%t in seconds)
      example: ServerA-%Y-%M-%D-%h-%m-%s-%t -> ServerA-2017-18-3-21-58-26-1484776706179
      * = Not yet available
   */
   let blocktimer = 10000; // Manages how long the system will wait before resuming normal function (warning low value may cause incomplete or corrupt db's)
   let TBRBA = 5000; // Time between rollback Actions -> Extend time to ensure operations complete in sequence.
   var CurRecTick = 0
   // Thanks to the above preconfigured statements you can mix & match.
   
   // End of config section.
   
   backup_frequency = backup_frequency * 1000 // Convert sec to ms
   if(cli) {
      cli.on('cliSandbox', function(sandbox) {
         var fs = require('fs');

         function GetOutputFormat(dateObj,format){
            let output = format
            output = output.replace("%Y", dateObj.getFullYear()); 
            output = output.replace("%M", dateObj.getMonth()); 
            output = output.replace("%D", dateObj.getDate()); 
            output = output.replace("%h", dateObj.getHours()); 
            output = output.replace("%m", dateObj.getMinutes()); 
            output = output.replace("%s", dateObj.getSeconds()); 
            output = output.replace("%u", Math.floor(dateObj.getTime()/1000)); 
            output = output.replace("%t", dateObj.getTime()); 
            return output
         }
         // Setup Chronjob backup -> Needs decider logic for tick or time based.
         function rbAutoBackup() {
            if (backup_type == "tick") {}// Not ready Don't use
            else {
               // Use time based
               let date = new Date()
               organisedData = GetOutputFormat(date,backup_format)
               rbBackup(organisedData);
               setTimeout(function () {rbAutoBackup()},backup_frequency);
            }
         }
         
         function rollBack(name) {
            sandbox.system.pauseSimulation();
            // Start the great chain of hope.
            setTimeout(function () {loadeddb = fs.readFileSync(__dirname + '/backups/'+name+'/db.json');fs.writeFileSync(__dirname + '/../../node_modules/@screeps/storage/db.original.json', loadeddb);
            setTimeout(function () {sandbox.system.resetAllData();sandbox.print("database loaded");
            setTimeout(function () {loadeddb = fs.readFileSync(__dirname + '/backups/db.original.json');fs.writeFileSync(__dirname + '/../../node_modules/@screeps/storage/db.original.json', loadeddb);if (enableAutoStart==1){sandbox.system.resumeSimulation()}
            },TBRBA);
            },TBRBA);
            },TBRBA);// Sorry about the hell on this one. Its just easier.
         }
         
         // Manual Backup
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
            }
         }
         sandbox.rollback = function(){sandbox.print("Databack Backup Mod");}
         sandbox.rollback.backup = rbBackup
         sandbox.rollback.startauto = rbAutoBackup
         sandbox.rollback.restore = rollBack
         sandbox.rollback.format = GetOutputFormat
         if (enableAutoBackup == 1) {
            setTimeout(function () {rbAutoBackup()},backup_frequency);
         }
      });
   }
};
# screepsmods rollback+
###### Current version: 0.0.1
### Information

This mod is a fast shortcut mod releasing new functions that do the same old same old.
They are intended to reduce "accidents" and reduce the ammount of struggling with (){}.
By automatically building the same commands.
As well as provide a vast array of commands to do the "private server common tasks".
And just regular common tasks.

### Installation
Place in the server in a "mods" directory. It requires to be iside atleast 1 folder below server level atm.

### Configuration
The mod has a configurable section in index.js
The configurable components are as follows:

- enableAutoBackup = 1    // Set to 0 to only take manual backups.
- enableAutoStart = 1     // Auto start game after a rollback? 1= Yes 0= No
- backup_type = "time";   // Options: "tick" or "time" !NOTE! Tick based does not work yet.
- backup_frequency = 600; // Options: If type is "tick" this means every 5 ticks. Else frequency is in seconds. 600 -> every 10 minutes.
- TBRBA = 5000;           // Time between rollback Actions, this is usefull if you have large databases for rollback to ensure the whole thing is loaded.

### Commands
- backup("FolderName")    // Initiates a manual backup
- startauto()             // Initiates the automatic backup protocol if not defined before in config
- restore("FolderName")   // Initiates a rollback to the given folder.

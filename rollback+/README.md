# screepsmods rollback+
###### Current version: 0.0.1
### Information

A mod for the private server of the game "Screeps" that add automated backup functionallity.
As well as a function to reset to a previous backup automatically.

### Installation
Place in the server in a "mods" directory. It requires to be iside atleast 1 folder below server level atm.

NPM:
-npm i screepsmods-rollback

Or just download the git.

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

### Caveats

- After using rollback the db is cached thus using the command again will result in the same db being restored to.
This occurs regardless of deleteing the file or targeting a different one.
For the time being only one rollback target can be chosen to change the target the server may have to be reset.
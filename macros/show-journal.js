//Please make sure to set this script macro name to "show-journal"
const entry = game.journal.get(args[0])
const mode = args[1]

if (entry) { 
    entry.show(mode, true)
} else {
    ui.notifications.notify(`Couldn't find journal id ${args[0]}`)
}
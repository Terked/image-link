//Make sure to set this macro name to "show-journal" and type to "script"
const entryId = args[0]
const entry = game.journal.get(args[0])
const mode = args[1]

if (entry) {
    entry.show(mode, true).then(() => checkForPopup())
} else {
    ui.notifications.notify(`Couldn't find journal with id ${entryId}`)
}

function checkForPopup() {
    const popup = document.getElementById(`journal-${entryId}`)
    if (!popup) {
        delay(50).then(() => checkForPopup())
    } else {
        popup.style.zIndex = 1
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
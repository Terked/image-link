function main() {
    const imageJournals = game.journal.entries.filter(journal => !!journal.data.img)
    let imageJournalOptions = ""
    for (let journal of imageJournals) {
        imageJournalOptions += `<option value=${journal.id}>${journal.data.name}</option>`
    }

    const textJournals = game.journal.entries.filter(journal => journal.data.image == null)
    let textJournalOptions = ""
    for (let journal of textJournals) {
        textJournalOptions += `<option value=${journal.id}>${journal.data.name}</option>`
    }

    const template = `  
  <p>    
    Journal entry 
    <select id="journalDropdown">
        ${imageJournalOptions}
    </select>
    <select id="journalTypeDropdown">
       <option value="image">Image</option>
       <option value="text">Text</option>
    </select>
  </p>
  <p>
    <textarea id="codeTextArea" rows="5" cols="20"></textarea>
  </p>
  `;
    new Dialog({
        title: "Journal link generator",
        buttons: {},
        content: template,
        render: () => bindEvents(),
    }).render(true);
}

function bindEvents() {
    const journalDropdown = document.getElementById("journalDropdown")
    const journalTypeDropdown = document.getElementById("journalTypeDropdown")

    journalDropdown.addEventListener("change", updateValues)
    journalTypeDropdown.addEventListener("change", replaceJournalDropdowns)
}

function replaceJournalDropdowns() {
    const journalDropdown = document.getElementById("journalDropdown")
    const journalTypeDropdown = document.getElementById("journalTypeDropdown")

    if (journalTypeDropdown.value == "image") {
        const length = journalDropdown.options.length
        const imageJournals = game.journal.entries.filter(journal => !!journal.data.img)
        for (let journal of imageJournals) {
            const option = document.createElement("option")
            option.value = journal.id
            option.text = journal.data.name
            journalDropdown.add(option)
        }
        for (let i = 0; i < length; i++) {
            journalDropdown.remove(0)
        }
    } else {
        const length = journalDropdown.options.length
        const textJournals = game.journal.entries.filter(journal => journal.data.image == null)
        for (let journal of textJournals) {
            const option = document.createElement("option")
            option.value = journal.id
            option.text = journal.data.name
            journalDropdown.add(option)
        }
        for (let i = 0; i < length; i++) {
            journalDropdown.remove(0)
        }
    }
    updateValues()
}

function updateValues() {
    const journalDropdown = document.getElementById("journalDropdown")
    const journalTypeDropdown = document.getElementById("journalTypeDropdown")
    const codeTextArea = document.getElementById("codeTextArea")

    const selectedDropdownText = journalDropdown.options[journalDropdown.selectedIndex].text
    const selectedDropdownId = journalDropdown.options[journalDropdown.selectedIndex].value
    const generatedCode = `<a class="journal_link" data-journalid="${selectedDropdownId}" data-journaltype="${journalTypeDropdown.value}">${selectedDropdownText}</a>`

    codeTextArea.value = generatedCode

    copyCodeToClipBoard(codeTextArea)
    clearSelection()
    journalDropdown.focus()
}

function copyCodeToClipBoard(textArea) {
    textArea.select()
    document.execCommand("copy")
    ui.notifications.notify(`Code copied to clipboard`)

}

function clearSelection() {
    window.getSelection()?.removeAllRanges()
    document.selection?.empty()
}

main()
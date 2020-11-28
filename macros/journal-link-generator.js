function main() {
    const dialogContent = `  
  <p>    
    Journal entry 
    <select id="journalDropdown">
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
        content: dialogContent,
        render: () => bindEvents(),
    }).render(true);
}

function bindEvents() {
    const journalDropdown = document.getElementById("journalDropdown")
    const journalTypeDropdown = document.getElementById("journalTypeDropdown")

    journalDropdown.addEventListener("change", updateValues)
    journalTypeDropdown.addEventListener("change", updateJournalDropdownOptions)

    updateJournalDropdownOptions()
}

function updateJournalDropdownOptions() {
    const journalDropdown = document.getElementById("journalDropdown")
    const journalType = document.getElementById("journalTypeDropdown").value
    const prevOptionsLength = journalDropdown.options.length
    
    const journals = game.journal.entries.filter(journal => {
        return journalType == "image" ? !!journal.data.img : journal.data.img == undefined
    }).sort(compareJournalOptions)

    for (let journal of journals) {
        const option = document.createElement("option")
        option.value = journal.id
        option.text = journal.data.name
        journalDropdown.add(option)
    }

    for (let i = 0; i < prevOptionsLength; i++) {
        journalDropdown.remove(0)
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

function compareJournalOptions(journalA, journalB) {
    if (journalA.data.name < journalB.data.name) {
        return -1
    }
    if (journalA.data.name > journalB.data.name) {
        return 1
    }
    return 0
}

main()
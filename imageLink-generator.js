function main() {
    const journals = game.journal.entries.filter(journal => !!journal.data.img)
    let journalOptions = ""
    for (let journal of journals) {
        journalOptions += `<option value=${journal.id}>${journal.data.name}</option>`
    }

    const template = `  
  <p>    
    Journal entry <select id="journalDropdown">
    ${journalOptions}</select>
  </p>
  <p>
    <textarea id="codeTextArea" rows="5" cols="33"></textarea>
  </p>
  `;
    new Dialog({
        title: "Generate image journal links",
        buttons: {},
        content: template,
        render: () => bindEvents(),
    }).render(true);
}

function bindEvents() {
    const journalDropdown = document.getElementById("journalDropdown")
    journalDropdown.addEventListener("change", onDropdownChange)
}

function onDropdownChange() {
    const journalDropdown = document.getElementById("journalDropdown")
    const codeTextArea = document.getElementById("codeTextArea")

    const selectedDropdownText = journalDropdown.options[journalDropdown.selectedIndex].text
    const selectedDropdownId = journalDropdown.options[journalDropdown.selectedIndex].value
    const generatedCode = `<a class="journal_link" data-journalid="${selectedDropdownId}" data-journaltype="${"image"}">${selectedDropdownText}</a>`

    codeTextArea.value = generatedCode

    copyCodeToClipBoard(codeTextArea)
    clearSelection()
    journalDropdown.focus()
}

function copyCodeToClipBoard(textArea) {
    textArea.select()
    document.execCommand("copy")
    ui.notifications.notify(`Code copiedd to clipboard`)
    
}

function clearSelection() {
    window.getSelection()?.removeAllRanges()
    document.selection?.empty()
}

main()
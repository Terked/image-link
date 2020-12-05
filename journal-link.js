class JournalLink extends FormApplication {
    constructor(object, options) {
        options.title = `Journal link generator - ${object.data.name}`
        super(object, options)
        this.entity.apps[this.appid] = this
    }

    static get defaultOptions() {
        const options = super.defaultOptions
        options.template = "modules/journal-link/formTemplate.html"
        options.width = '400'
        options.height = '200'
        options.classes = ['journal-link', 'sheet']
        options.resizable = false
        options.editable = true
        return options
    }

    getData() {
        const data = super.getData()
        data.owner = game.user.id
        data.isGM = game.user.isGM
        return data
    }

    get entity() { return this.object }

    activateListeners(html) {
        super.activateListeners(html)

        //We remove the editor in the new popup and use the textarea from the formTemplate instead.
        html.find('.editor-content').remove()
        html.find('.editor').remove()

        html.find('.copyJournalCodeButton').click(ev => this._pasteLinkIntoJournal(html))
        html.find('.copyCodeButton').click(ev => this.copyToClipboard(html))
        html.find('.journalDropdown').change(ev => this.updateValues(html))
        html.find('.journalTypeDropdown').change(ev => this.updateJournalDropdownOptions(html))
        this.updateJournalDropdownOptions(html)
    }

    updateJournalDropdownOptions(html) {
        const journalDropdown = html.find(".journalDropdown")
        const journalDropdownHTML = journalDropdown.get(0)
        const journalType = html.find(".journalTypeDropdown").val()
        const prevOptionsLength = journalDropdownHTML.options.length

        const journals = game.journal.entries.filter(journal => {
            return journalType == "image" ? !!journal.data.img : journal.data.img == undefined
        }).sort(this.compareJournalOptions)

        for (let journal of journals) {
            const option = document.createElement("option")
            option.value = journal.id
            option.text = journal.data.name
            journalDropdownHTML.add(option)
        }

        for (let i = 0; i < prevOptionsLength; i++) {
            journalDropdownHTML.remove(0)
        }

        this.updateValues(html)
    }

    updateValues(html) {
        const journalDropdown = html.find(".journalDropdown")
        const journalDropdownHTML = journalDropdown.get(0)
        const journalType = html.find(".journalTypeDropdown").val()
        const codeTextArea = html.find(".codeTextArea")

        const selectedDropdownText = journalDropdownHTML.options[journalDropdownHTML.selectedIndex].text
        const selectedDropdownId = journalDropdownHTML.options[journalDropdownHTML.selectedIndex].value

        const buttonHTML = `<a class="journal_link" data-journalid="${selectedDropdownId}" data-journaltype="${journalType}">${selectedDropdownText}</a>`
        codeTextArea.val(buttonHTML)
        this.buttonHTML = buttonHTML
    }

    /**
     * Used for sorting journals by name.
     * 
     * @param {Journal} journalA 
     * @param {Journal} journalB 
     */
    compareJournalOptions(journalA, journalB) {
        if (journalA.data.name < journalB.data.name) {
            return -1
        }
        if (journalA.data.name > journalB.data.name) {
            return 1
        }
        return 0
    }

    copyToClipboard(html) {
        html.find(".codeTextArea").select()
        document.execCommand("copy")
        ui.notifications.notify(`Code copied to clipboard.`)
        window.getSelection()?.removeAllRanges()
        document.selection?.empty()
    }

    async _updateObject(event, formData) {
    }

    async _pasteLinkIntoJournal(html) {
        const descPath = "content"
        const selection = getSelectionText()
        const description = getProperty(this.entity, 'data.' + descPath)

        if (!selection) {
            ui.notifications.warn(`Select text in your journal first. Note that pasting links while editing a journal is not supported.`)
        } else {
            if (description.indexOf(selection) > -1) {
                if (!this.hasDuplicates(selection, description)) {
                    const newDesc = description.replace(selection, this.buttonHTML)
                    const obj = {}
                    obj[descPath] = newDesc
                    await this.entity.update(obj)
                } else {
                    ui.notifications.warn(`Please choose a unique word selection. "${selection}" occurs more than once in this journal.`)
                }
            } else {
                ui.notifications.warn(`Couldn't find "${selection}" in the opened journal.`)
            }
        }
    }

    hasDuplicates(word, sentence) {
        var pattern = new RegExp('\\b' + word + '\\b', 'ig');
        var count = (sentence.match(pattern) || []).length;
        if (count > 1) {
            return true
        } else {
            return false
        }
    }
}


function showLinkGeneratorButton(app, html, data) {
    if (game.user.isGM) {
        const linkButton = $(`<a class="open-journal-link"><i class="fas fa-link"></i></a>`)

        linkButton.click(ev => {
            let linkApp = null
            for (let key in app.entity.apps) {
                let obj = app.entity.apps[key]
                if (obj instanceof JournalLink) {
                    linkApp = obj
                    break;
                }
            }
            if (!linkApp) {
                linkApp = new JournalLink(app.entity, { submitOnClose: true, closeOnSubmit: false, submitOnUnfocus: true })
            } else {
                linkApp.bringToTop()
            }
            linkApp.render(true)
        })

        html.closest('.app').find('.open-journal-link').remove()
        linkButton.insertAfter(html.closest('.app').find('.window-title'))
    }
}

/**
 * Displays link buttons in the opened journal.
 */
function showLinkButtons(html) {
    html.find('.journal_link').click(ev => {
        if (game.user.isGM) {
            showJournal(ev.currentTarget.dataset.journalid, ev.currentTarget.dataset.journaltype)
        } else {
            ui.notifications.warn(`Only GMs can use this button.`)
        }
    })
}

/**
 * Displays the target journal for all players. 
 * For DM players, the shown journal is placed behind other windows to prevent the currently active journal to be obfuscated.
 * 
 * @param {string} journalId Unique journal id
 * @param {"image" | "text"} mode Mode to show for this journal
 */
function showJournal(journalId, mode) {
    const entry = game.journal.get(journalId)
    if (entry) {
        entry.show(mode, true).then(() => checkForPopup(journalId))
    } else {
        ui.notifications.notify(`Couldn't find journal with id ${journalId}`)
    }
}

/**
 * Workaround for hiding the shown journal behind all other windows for the DM player. 
 * @param {string} journalId 
 */
function checkForPopup(journalId) {
    const popup = document.getElementById(`journal-${journalId}`)
    if (!popup) {
        delay(50).then(() => checkForPopup(journalId))
    } else {
        popup.style.zIndex = 1
    }
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

Hooks.on("renderJournalSheet", (app, html, data) => {
    showLinkGeneratorButton(app, html, data)
    showLinkButtons(html)
})
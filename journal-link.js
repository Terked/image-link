class JournalLink extends FormApplication {
    constructor(object, options) {
        super(object, options)
        this.entity.apps[this.appid] = this
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/journal-link/formTemplate.html"
        options.width = '400'
        options.height = '200'
        options.classes = ['journal-link', 'sheet']
        options.title = `Journal link`
        options.resizable = false
        options.editable = true
        return options
    }

    getData() {
        const data = super.getData()
        data.notes = this.entity.getFlag('journal-link', 'link')
        data.flags = this.entity.data.flags
        data.owner = game.user.id
        data.isGM = game.user.isGM
        return data
    }

    get entity() { return this.object }

    activateListeners(html) {
        super.activateListeners(html)

        html.find('.editor-content').remove()
        html.find('.editor').remove()

        html.find('.copyJournalCodeButton').click(ev => this.copyLinkToJournal(html))
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
        const generatedCode = `<a class="journal_link" data-journalid="${selectedDropdownId}" data-journaltype="${journalType}">${selectedDropdownText}</a>`
        codeTextArea.val(generatedCode)
        this.generatedCode = generatedCode
    }

    compareJournalOptions(journalA, journalB) {
        if (journalA.data.name < journalB.data.name) {
            return -1
        }
        if (journalA.data.name > journalB.data.name) {
            return 1
        }
        return 0
    }

    copyToClipboard(html){
        const codeTextArea = html.find(".codeTextArea")
        codeTextArea.select()
        document.execCommand("copy")
        ui.notifications.notify(`Code copied to clipboard.`)
        window.getSelection()?.removeAllRanges()
        document.selection?.empty()
    }

    async copyLinkToJournal(html) {
        if (game.dnd5e) {
            const descPath = "content"
            const selection = this.getSelectionText()
            const description = getProperty(this.entity, 'data.' + descPath)
            
            if (!selection){
                ui.notifications.warn(`Select text in your journal first. Also note that pasting links while editing a journal is not supported.`)
            } else {
                if (description.indexOf(selection) > -1) {
                    if (!this.hasDuplicates(selection, description)){
                        const newDesc = description.replace(selection, this.generatedCode)
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
    }
    
    hasDuplicates(word, sentence) {
        var pattern = new RegExp('\\b' + word + '\\b', 'ig');
        var count = (sentence.match(pattern) || []).length;
        if (count > 1) return true
        if (count == 1) return false
      }  

    getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }
}

function showLinkGeneratorButton(app, html, data) {
    if (game.user.isGM) {
        const title = "Journal link generator"
        const headerButton = $(`<a class="open-journal-link" title="${title}"><i class="fas fa-link"></i></a>`)

        headerButton.click(ev => {
            let linkApp = null
            for (let key in app.entity.apps) {
                let obj = app.entity.apps[key]
                if (obj instanceof JournalLink) {
                    linkApp = obj
                    break;
                }
            }
            if (!linkApp) linkApp = new JournalLink(app.entity, { submitOnClose: true, closeOnSubmit: false, submitOnUnfocus: true })
            linkApp.render(true)
        })

        html.closest('.app').find('.open-journal-link').remove()
        const titleElement = html.closest('.app').find('.window-title')
        headerButton.insertAfter(titleElement)
    }
}

function showLinkButtons(html) {
    html.find('.journal_link').click(ev => {
        const element = ev.currentTarget
        const chatContent = `{{macro "show-journal" "` + element.dataset.journalid + `" "` + element.dataset.journaltype + `"}}`
        ChatMessage.create({ content: chatContent })
    })
}

Hooks.on("renderJournalSheet", (app, html, data) => {
    showLinkGeneratorButton(app, html, data)
    showLinkButtons(html)
})

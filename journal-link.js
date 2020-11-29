// Link example
// <a class="journal_link" data-journalid="JOURNAL ID" data-journaltype="image">Journal name</a>

Hooks.on("renderItemSheet", (app, html, options) => {
    searchJournalLinks(html)
});

Hooks.on("renderJournalSheet", (app, html, options) => {
    searchJournalLinks(html)
});

function searchJournalLinks (html){
    html.find('.journal_link').click((ev) => {
                    const element = ev.currentTarget;        
                    const chatContent = `{{macro "show-journal" "` + element.dataset.journalid + `" "` +  element.dataset.journaltype + `"}}`;
	    			ChatMessage.create({content : chatContent});
            })
}
// LINK EXAMPLE
// <a class="sound_link" data-playlist="Music" data-sound="Song">My Song From the Music Playlist</a>

Hooks.on("renderItemSheet", (app, html, options) => {
    searchJournalLinks(html);
});

Hooks.on("renderJournalSheet", (app, html, options) => {
    searchJournalLinks(html);
});

function searchJournalLinks (html){
    html.find('.journal_link').click((ev) => {
                    const element = ev.currentTarget;        
                    const chatContent = `{{macro "toggle-journal" "` + element.dataset.journalid + `" "` +  element.dataset.journaltype + `"}}`;
	    			ChatMessage.create({content : chatContent});
            });
}
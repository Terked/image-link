/* Journal link builder v1.0 - variation from mestre-digital
Source: https://raw.githubusercontent.com/brunocalado/mestre-digital/master/Foundry%20VTT/Macros/Ferramentas/Sound%20Link%20Builder.js
*/

main();

function main() {
    let journals = game.journal.entries.filter(journal => !!journal.data.img);
    let journalOptions = "";
    for (let journal of journals) {
        journalOptions += `<option value=${journal.id}>${journal.data.name}</option>`
    }

    let template = `  
  <p>    
    Journal: <select id="journalID">${journalOptions}</select>
  </p>
  <p>
    Link name: <input id="linkName" type="text" style="width: 250px" value=''>
  </p>
  <br />
  `;
    new Dialog({
        title: "Journal link builder v1.0",
        content: template,
        buttons: {
            ok: {
                label: "Generate",
                callback: async (html) => {
                    generateCode(html)
                },
            },
        },
    }).render(true);
}

async function generateCode(html) {
    const journalID = html.find("#journalID")[0].value;
    const linkname = html.find("#linkName")[0].value;
    const template = `<a class="journal_link" data-journalid="${journalID}" data-journaltype="${"image"}">${linkname}</a>`;

    const form = `
    <label>Copy this to the journal source code</label>
    <textarea id="moduleTextArea" rows="5" cols="33">${template}</textarea>
  `;

    const dialog = new Dialog({
        title: "module.json",
        content: form,
        buttons: {
            use: {
                label: "Copy"
            }
        }
    }).render(true)

    const copyText = document.getElementById("moduleTextArea"); /* Get the text field */
    copyText.select(); /* Select the text field */
    document.execCommand("copy"); /* Copy the text inside the text field */
    ui.notifications.notify(`Saved ${template} to clipboard`); /* Alert the copied text */

    dialog.close()
}
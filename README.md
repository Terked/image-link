_Code derived from [sound-link](https://github.com/superseva/sound-link) made by [superseva](https://github.com/superseva/)_

# Journal Link
Adds the ability to create buttons in your journals to show other text or image journals to all players with one click.

The link needs to be added in the HTML part of the text editor.

**Image journal example**

```<a class="journal_link" data-journalid="JOURNAL ID" data-journaltype="image">Journal name</a>```

**Text journal example**

```<a class="journal_link" data-journalid="JOURNAL ID" data-journaltype="text">Journal name</a>```

## Macros to use with this module
### show-journal macro
The macro below will be called by this module.
See [show-journal macro](macros/show-journal.js)

### journal-link-generator macro
The macro below generates a link to an image or text journal based on your selection.
See [journal-link-generator macro ](macros/journal-link-generator.js)

## Dependencies & requirements
- This module requires **The Furnace** module installed with **Advanced Macros *enabled***.
- You need to create a `show-journal` macro in your game.

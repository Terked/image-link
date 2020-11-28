_Derived from [sound-link](https://github.com/superseva/sound-link) made by HappySteve_

# Journal Link
Adds the ability to create journal buttons in your journals and items text areas that will show a journal.

The link needs to be added in the HTML part of the text editor, looking like this:
```<a class="journal_link" data-journalid="JOURNAL ID" data-journaltype="IMAGE OR TEXT">Journal name</a>```

# Dependencies
This module requires **The Furnace** module installed with **Advanced Macros *ON***.
You also need to create a `show-journal` macro in your game since this will be used in the journal link.

# Macros to use with this module
## show-journal macro
Create a new script macro called `show-journal` and paste the code below.
```
const entry = game.journal.get(args[0])
const showMode = args[1]

if (entry){
   entry.show(mode, true)
} else {
   ui.notifications.notify(`Couldn't find journal id ${args[0]}`)
}
```

## Image link generation macro
The macro below generates a link to an image journal based on your selection.
```
//see imageLink-generator.js
```


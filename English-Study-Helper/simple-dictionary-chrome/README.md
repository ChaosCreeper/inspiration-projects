# Simple Side Panel English Dictionary
## Intro
- just a simple dictionary searching the definition and something else from wiktionary
  - but implement with chrome side panel
  > not totally support searching phrase, but it may work.
### How to use
1. Download simple-dictionary-chrome document then load it with this [guide](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
2. just input word in the top then ENTER and you could see the definition if there has a related data in following data source.
   - or click to select the word in current page by your mouse and right click and click the **Define** in the list of window.
### Data Source
- Word definition api from Wiktionary, see [here](https://en.wiktionary.org/api/rest_v1/)
- Word Pronounce from Free Dictionary api, see [here](https://dictionaryapi.dev/)
- Oxford 5000 and 3000 vocabularies list and wikipedia basic word list for tag
## Todo
- [] add some local data source for solve slow api request
- [] add setting page for manage word tag and something else
- [] support function of auto making anki card
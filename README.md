____***Torn Announcment Forum To Discord***____


__**About**__

This script is for use in [Google Apps Script/GAS](https://script.google.com/home) and is writen in javascript
This script will post to a Discord Channel via Webhook the Torn Announcment Forums latest posts
This script uses 1 call per hour then an extra call per new thread detected
This script requires a minimal access key
This script is free to use (donations accepted of course :P)
Any questions feel free to contact me in game via Mail (bilbosaggings [2323763]) or on Discord via Direct Message (billybourbon)
By Bilbosaggings [2323763]

____***Instructions***____


__**How To Set Up Project**__

- To use this script head to and make a new project
- Then clear the editor of its contents
- Then paste the code found in this repo in the code.gs file into the editor

__**How To Set Your API Key**__

Theres two methods for setting your API key currently. method 1 is the prefered method however both work

__Method 1__
- Head to line 138 and between the Quotation Marks (`""`) insert your API key
- Line 138 should then look like this  ```js function setApiKey(apiKey = "YOUR_API_KEY"){```
- Go to the code editors toolbar and in the dropdown box choose `setApiKey`
- Then hit `Run`
- Then go back to line 138 and remove your API key from between the Quotation Marks (`""`)

__Method 2__
- head to line 3 in the script and between the Quotation Marks (`""`) insert your API key


__**How To Get The Webhook URL**__

This requires you to have a server where you have the permissions to create a webhook

- Head to discord and go to the channel youd like to get the alerts in
- Go to channel settings/Edit Channel
- Go to `Integrations`
- Choose Webhooks and then hit `New Webhook`
- Then click the newly made webhook and click `Copy Webhook URL`
- Paste this within the GAS code editor on line 4 between the Quotation Marks (`""`)


__**How To Setup The Trigger**__

The Trigger is setup to run the script every hour to check for new posts. this frequency can be changed easily after setting up the trigger by going to the triggers tab of the code editor and editing the trigger assigned to the function `getPatchNotes`

- Go to the GAS code editor and in the toolbars dropdown box select `setupTrigger`
- Hit Run


__**How To Delete The Trigger**__
- Go to the GAS code editor and in the toolbars dropdown box select `deleteTrigger`
- Hit Run


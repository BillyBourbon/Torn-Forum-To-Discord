// Setup

function setupTrigger(){

  deleteTrigger()

  let trigger = ScriptApp.newTrigger(functionToRun).timeBased().everyHours(1).create()

  PropertiesService.getScriptProperties().setProperty(`triggerId${functionToRun}`,trigger.getUniqueId())
}

// Deactivation

function deleteTrigger(){

  let triggerId = PropertiesService.getScriptProperties().getProperty(`triggerId${functionToRun}`)
  
  let triggers = ScriptApp.getProjectTriggers()
  
  if(typeof(triggers) != "object")return

  triggers.forEach(trigger=>{if(trigger.getUniqueId() == triggerId) ScriptApp.deleteTrigger(trigger)})

  PropertiesService.getScriptProperties().deleteProperty(`triggerId${functionToRun}`)
}

// Main

function getPatchNotes(){
  let catergoryId = 1
  let threads = getThreadsByCatergory(catergoryId,5)
  let filteredThreads = findNewThreads(threads)
  
  if(filteredThreads.length == 0) return

  let oldThreadIds = PropertiesService.getScriptProperties().getProperty(`oldThreadIds`).split(',')
  
  filteredThreads.forEach(thread=>{
    let { id } = thread
    let { title, content, author} = getThreadDetails(id)
    let embeds = buildEmbedsThread(title, content, author)
    
    try{
      sendEmbedsToDiscord(embeds,channelWebhookUrl)
      oldThreadIds.push(id.toString())
    } 
    catch(e){
      console.log(e)
    }

    Utilities.sleep(5000)
  })
  
  PropertiesService.getScriptProperties().setProperty(`oldThreadIds`,oldThreadIds.join(','))
}

function getThreadsByCatergory(catergoryId = 1, limit = 1){
  let {threads} = tornApiCallV2("forum", ["threads"], catergoryId, apiKey, {limit:limit,sort:"DESC"})
  
  return threads
}

function findNewThreads(threads){
  let props = PropertiesService.getScriptProperties()

  let { oldThreadIds } = props.getProperties()
  if(!oldThreadIds){
    oldThreadIds = []
    props.setProperty("oldThreadIds",oldThreadIds.join(","))
  } else {
    oldThreadIds = oldThreadIds.split(",")
    }
  let filteredThreads = threads.filter(thread=>!oldThreadIds.includes(thread.id.toString()))
  
  return filteredThreads
}

function getThreadDetails(threadId){
  let {thread} = tornApiCallV2("forum",["thread"], threadId, apiKey)
  return thread
}

function buildEmbedsThread(title, content, author, color = 663399){
  let {id, username, karma } = author || {"id":0,"username":"Unknown","karma":0}
  let embeds = []

  let chars = content.split("")
  let counter = 0
  while(chars.length > 0){
    counter ++
    let contentSmall = chars.slice(0,2048-4)
    let words = contentSmall.join('').split(' ')
    let subContent = words.slice(0,words.length-1).join(' ')

    if(contentSmall.length < 2044) subContent = words.join(' ')    

    chars.splice(0,subContent.length)

    embeds.push({
      "title" : `${title} (Part ${counter})`,
      "color" : color,
      "description" : `>>> ${subContent}`,
      "footer":{
        "text" : `${username} [${id}] | Karma: ${karma}`
      }
    })
  }

  return embeds
}

// Helpers - Discord

function sendEmbedsToDiscord(embeds, webhookUrl){
  let payload = {
    "username" : "Torn Forum Thread Alert",
    "embeds" : embeds
  }
  let params={
    method:"POST",
    contentType:"application/json",
    muteHttpExceptions:true,
    payload:JSON.stringify(payload),
  }
  let res = UrlFetchApp.fetch(webhookUrl,params)
  console.log(res.getContentText())
}

// Helpers - Api

// Set Api Key Into Props
function setApiKey(apiKey = ""){
  let isValid = false

  // 
  // Find Then Import Key Verifier Here
  // 
  if(apiKey.length == 16) {
    PropertiesService.getUserProperties().setProperty(`apiKey`, apiKey)
    isValid = true
  }
  
  return isValid
}

// Delete Api Key
function deleteApiKey(){
  PropertiesService.getUserProperties().deleteProperty("apiKey")
  if(PropertiesService.getUserProperties().getProperty("apiKey")) return false
  else return true
}

function tornApiCallV2(section="user", selections=[], id, apiKey, options = {} ){
  const baseUrl = "https://api.torn.com/v2"

  if(!verifyApiKey(apiKey).isValid) return console.error({ error:"Invalid API Key" })
  let url = `${baseUrl}/${section}/`
  if(id) url=`${url}${id}/`
  url=`${url}${selections.join(",")}?`

  if(options.to) url=`${url}&to=${options.to}`
  if(options.from) url=`${url}&from=${options.from}`
  if(options.sort) url=`${url}&sort=${options.sort}`
  if(options.limit) url=`${url}&limit=${options.limit}`
  
  let res = UrlFetchApp.fetch(`${url}&key=${apiKey}`)

  if(res.getResponseCode() != 200) {
    console.log(res.getResponseCode())
    console.log(res.getContentText())
    return console.error({error:`Bad Call: ${url}`})
  }
  let data = JSON.parse(res.getContentText())

  return data
}

function verifyApiKey(apiKey, permsToTest={}){
  let keyInfo = {
    isValid: false
  }

  if(!apiKey || apiKey.length != 16) return keyInfo



  keyInfo.isValid = true
  return keyInfo

}

// Helpers - Properties

function forceClearProperties_(){
  PropertiesService.getScriptProperties().deleteAllProperties()
  PropertiesService.getUserProperties().deleteAllProperties()
}

function viewProps(){
  let p = PropertiesService.getScriptProperties()
  p = p.getProperties()
  Object.entries(p).forEach(([x,y])=>console.log(`${x} : ${y}`))
  p = PropertiesService.getUserProperties()
  p = p.getProperties()
  Object.entries(p).forEach(([x,y])=>console.log(`${x} : ${y}`))
}

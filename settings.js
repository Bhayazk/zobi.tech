//-------------------[ BOT SETTINGS ]------------------// 

// @project_name : 𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉  
// @author : 𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉
// @telegram : http://t.me/official_kango
// @github : Bhayazk
// @whatsapp : +923318555417

//----------------------[ 𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉  ]----------------------//

const fs = require('fs')
const { color } = require('./lib/color')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname+'/.env' })


//--------------------[ SESSION ID ]----------------------//

global.SESSION_ID = process.env.SESSION_ID || '' 
//Enter your 𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉  session id here; must start with KANGO~

//--------------------[ BOT NAME ]----------------------//

global.botname = process.env.BOT_NAME || '𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉 ' 

//-----------------[ OWNER NUMBER ]------------------//

global.ownernumber = process.env.OWNER_NUMBER || '923318555417' 

//--------------------[ SUDO ]--------------------------//

global.sudo = process.env.SUDO ? process.env.SUDO.split(',') : ['923318555417', '923300318170'];
// Type additional allowed users here
//NB: They'll be able to use every functions of the bot without restrictions.

//-----------------[ OWNER NAME ]------------------//

global.ownername = process.env.OWNER_NAME || '𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉' 

//------------[ STICKER PACKNAME ]-----------------//

global.packname = process.env.STICKER_PACK_NAME || "𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉 " 

//--------------[ STICKER AUTHOR NAME ]------------//

global.author = process.env.STICKER_AUTHOR_NAME || "𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉" 

//----------------[ GITHUB DATABASE ]-----------------//

global.dbToken = process.env.GITHUB_TOKEN || "";


//-----------------[ CONTEXT LINK ]--------------------//

global.plink = process.env.PLINK || "https://youtube.com/@official_manuel"

//------------------[ WATERMARK ]--------------------//

global.wm = process.env.GL_WM || "> ©𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉 "

//---------------------[ REPLIES ]-----------------------//

global.mess = { 
  done: '*Done*', 
  success: '©𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉 ', 
  owner: `*You don't have permission to use this command!*`, 
  group: '*This feature becomes available when you use it in a group!*', 
  admin: '*You’ll unlock this feature with me as an admin!*', 
  notadmin: '*This feature will work once you become an admin. A way of ensuring order!*' 
}

//--------------------[ WATCHER ]-----------------------//

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(color(`Updated '${__filename}'`, 'red'))
  delete require.cache[file]
  require(file)
})

//----------------------[ 𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉  ]----------------------//
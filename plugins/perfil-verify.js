import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let pp = await conn.profilePictureUrl(who, 'image').catch((_) => global.xImagen2 )
let user = global.db.data.users[m.sender]
let name2 = conn.getName(m.sender)

if (user.registered) return conn.sendMessage(m.chat, { text: `📍  Ya estas registrado en la base de datos.` }, { quoted: m });
if (!Reg.test(text)) return conn.sendMessage(m.chat, { text: `• Por ejemplo:\n*#${command}* Alan.18` }, { quoted: m });

let hora = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });

let fechaObj = new Date();
let fecha = fechaObj.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' });
let dia = fechaObj.toLocaleDateString('es-PE', { weekday: 'long', timeZone: 'America/Lima' });

let [_, name, splitter, age] = text.match(Reg)
if (!name) return conn.sendMessage(m.chat, { text: `📍  Nombre faltante.` }, { quoted: m })
if (!age) return conn.sendMessage(m.chat, { text: `📍  Edad faltante.` }, { quoted: m })
if (name.length >= 100) return conn.sendMessage(m.chat, { text: `📍  Nombre demasiado largo.` }, { quoted: m })
age = parseInt(age)
user.name = `${name}`
user.age = age
user.regTime = + new Date
user.registered = true

let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)


let regbot = `─╰✎ *Registro exitoso.*


⊸⋆ *Nombre:* ${name} ( @${name2} )
⊸⋆ *Nro:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
⊸⋆ *Edad:* ${age} años.

✅  Tu registro fue realizado hoy *${dia}* de *${fecha}* a horas *${hora}hs*.`

await m.react?.('✅')

conn.sendMessage(m.chat, { text: regbot, contextInfo: { externalAdReply: { title: wm, body: textoInfo, thumbnailUrl: pp, sourceUrl: null, mediaType: 1, showAdAttribution: true, renderLargerThumbnail: true }}} , { quoted: m })
};

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'] 

export default handler
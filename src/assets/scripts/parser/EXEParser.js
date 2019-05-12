/*
Класс занимается разбором информации EXE файлов
 */

import Bytes from './Bytes'
import BlockReader from './BlockReader'
import DataDictionary from './DataDictionary'
import Reader from './FileReader'

export default class EXEParser {

  // Возвращает true, если переданный массив байт может являться исполняемым файлом
  static isExe(bytes) {
    let reader = new Reader().setFile(bytes);
    if (bytes.length < 512) return false;
    if (Bytes.arrayToString(reader.readArray(2)) !== "MZ") return false;
    return true;
  }

  // Извлекает главную информацию из NT заголовка в дружественном виде
  static makeGeneral(ntHeader) {
    let data = [];

    let time = ntHeader.find(block => block.name === "TimeDataStamp").num;
    data.push({name: "Creation time", value: new Date(time * 1000)});

    let machine = ntHeader.find(block => block.name === "Machine").num;
    data.push({name: "Architecture", value: DataDictionary.DecodeMachine(machine)});

    let magic = ntHeader.find(block => block.name === "Magic").num;
    data.push({name: "Type", value: DataDictionary.DecodeMagic(magic)});

    let maj = ntHeader.find(block => block.name === "MajorOperatingSystemVersion").num;
    let min = ntHeader.find(block => block.name === "MinorOperatingSystemVersion").num;
    data.push({name: "Minimal OS", value: DataDictionary.DecodeOSVersion(maj, min)});

    let subsystem = ntHeader.find(block => block.name === "Subsystem").num;
    data.push({name: "Subsystem", value: DataDictionary.DecodeSubsystem(subsystem)});

    let char = ntHeader.find(block => block.name === "Characteristics").num;
    data.push({name: "Characteristics", value: DataDictionary.DecodeChars(char).join(', ')});

    let dllchar = ntHeader.find(block => block.name === "DllCharacteristics").num;
    data.push({name: "DLL characteristics", value: DataDictionary.DecodeDllChars(dllchar).join(', ')});

    return data;
  }

  // Возвращает строку с дружественным и понятным общим описанием ПО
  static makeMagicDesc(ntHeader) {
    let chars = DataDictionary.DecodeChars(ntHeader.find(block => block.name === "Characteristics").num);
    let magic = DataDictionary.DecodeMagic(ntHeader.find(block => block.name === "Magic").num);
    let maj = ntHeader.find(block => block.name === "MajorOperatingSystemVersion").num;
    let min = ntHeader.find(block => block.name === "MinorOperatingSystemVersion").num;
    let arch = DataDictionary.DecodeMachine(ntHeader.find(block => block.name === "Machine").num);
    let subs = DataDictionary.DecodeSubsystem(ntHeader.find(block => block.name === "Subsystem").num);

    let isDll = chars.includes('DLL');
    let is64 = magic === 'PE64';
    let os = DataDictionary.DecodeOSVersion(maj, min);
    let isGui = subs === 'WindowsGui';

    let magicText = `This is ${!isDll ? (isGui ? 'graphical' : 'console') : ''} ${is64 ? '64' : '32'} bit ${isDll ? 'library' : 'application'} for ${os} on ${arch} architecture. `;

    // Реакции на необычные или редкие штуки в заголовках
    if (subs === "Xbox") magicText += 'Xbox app? Wow! ';
    if (!['AMD64', 'I386', 'ARM'].includes(arch)) magicText += `${arch}? Where did you get this file? `;
    if (maj <= 3) magicText += `${os}? It alive? `;
    if (!(subs.toUpperCase().indexOf('BOOT') === -1 && subs.toUpperCase().indexOf('EFI') === -1)) magicText += `This is a Windows own file, I guess. `;
    if (chars.find(char => char.toUpperCase().indexOf('STRIPPED') !== -1)) magicText += `This is stripped file, uff... `;

    return magicText;
  }

  // Читает доступную информацию о текущем файле
  static readInfo(bytes) {
    let dosHeader = null;
    let ntHeader = null;
    let general = null;
    let magicDesc = null;

    // Читаем DOS и NT заголовки
    dosHeader = BlockReader.readDOSHeader(bytes, 0);
    if (dosHeader != null) {

      let lfanew = Bytes.arrayToNumber(dosHeader.find(h => h.name === 'e_lfanew').raw);
      ntHeader = BlockReader.readNTHeader(bytes, lfanew);

      // Формируем общую информацию
      if (ntHeader != null)
        general = EXEParser.makeGeneral(ntHeader);

      // Формируем строку с "магическим" описанием
      if (general != null)
        magicDesc = EXEParser.makeMagicDesc(ntHeader);
    }

    return {
      general,
      dos: dosHeader,
      nt: ntHeader,
      magic: magicDesc,
    };
  }

}

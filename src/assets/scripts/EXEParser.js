/*
Класс занимается разбором информации EXE файлов
 */

import Bytes from './Bytes'
import FileReader from './FileReader'

const Byte = 1;
const Word = 2;
const DWord = 4;
const QWord = 8;
const YWord = 16;

export default class EXEParser {
  constructor() {
    this.reader = new FileReader();
  }

  // Устанавливает рабочий файл
  setFile(bytes) {
    this.reader.setFile(bytes);
  }

  // Возвращает true, если переданный массив байт может являться исполняемым файлом
  isExe() {
    if (this.reader.bytes.length < 512) return false;
    if (Bytes.arrayToString(this.reader.readArray(2)) !== "MZ") return false;
    this.reader.pointer = 0;
    return true;
  }

// {
//   shift: '0x0000003C',
//   name: 'e_lfanew',
//   data: '0x00000080',
//   type: 'DWord',
//   value: '128',
//   desc: 'File address of new exe header',
// }

  // Читает следующий блок и пакует его в описательную форму
  readBlock(count, name, desc) {
    let shift = this.reader.pointer;
    let block = this.reader.readArray(count);
    let types = {
      1: "Byte",
      2: "Word",
      4: "DWord",
      8: "QWord",
      16: "YWord",
    };
    let rawNumber = (block.length in types ? Bytes.arrayToNumber(block) : 0);
    return {
      raw: block,
      rawNumber,
      shift: "0x" + Bytes.numberToHex(shift, 4),
      name,
      data: "0x" + Bytes.arrayToHex(block) + (rawNumber ? " / " + rawNumber : ''),
      type: types[block.length] || "Data",
      value: Bytes.arrayToString(block),
      desc,
    };
  };

  // Читает информацию из DOS заголовка и сбрасывает указатель
  readDOSHeader() {
    let data = [];
    this.reader.pointer = 0;
    data.push(this.readBlock(Word, "e_magic", "Magic number (MZ)"));
    data.push(this.readBlock(Word, "e_cblp", "Bytes on last page of file"));
    data.push(this.readBlock(Word, "e_cp", "Pages in file"));
    data.push(this.readBlock(Word, "e_crlc", "Relocations"));
    data.push(this.readBlock(Word, "e_cparhdr", "Size of header in paragraphs"));
    data.push(this.readBlock(Word, "e_minalloc", "Minimum extra paragraphs needed"));
    data.push(this.readBlock(Word, "e_maxalloc", "Maximum extra paragraphs needed"));
    data.push(this.readBlock(Word, "e_ss", "Initial (relative) SS value"));
    data.push(this.readBlock(Word, "e_sp", "Initial SP value"));
    data.push(this.readBlock(Word, "e_csum", "Checksum"));
    data.push(this.readBlock(Word, "e_ip", "Initial IP value"));
    data.push(this.readBlock(Word, "e_cs", "Initial CS value"));
    data.push(this.readBlock(Word, "e_lfarlc", "File address of relocation table"));
    data.push(this.readBlock(Word, "e_ovno", "Overlay number"));
    data.push(this.readBlock(Word * 4, "e_res", "Reserved"));
    data.push(this.readBlock(Word, "e_oemid", "OEM identifier"));
    data.push(this.readBlock(Word, "e_oeminfo", "OEM information; e_oemid specific"));
    data.push(this.readBlock(Word * 10, "e_res2", "Reserved"));
    data.push(this.readBlock(Word, "e_lfanew", "File address of new exe header"));
    this.reader.pointer = 0;
    return data;
  }

  // Читает информацию из NT заголовка и сбрасывает указатель
  readNTHeader(dosHeader) {
    let data = [];
    this.reader.pointer = dosHeader.find(block => block.name === "e_lfanew").rawNumber;
    data.push(this.readBlock(DWord, "Signature", "PE\\0\\0"));
    // COFF
    data.push(this.readBlock(Word, "Machine", "Architecture type of the computer"));
    data.push(this.readBlock(Word, "NumberOfSections", "Size of the section table"));
    data.push(this.readBlock(DWord, "TimeDataStamp", "Date and time the image was created"));
    data.push(this.readBlock(DWord, "PointerToSymbolTable", "Offset of the symbol table, or zero if no COFF symbol table exists"));
    data.push(this.readBlock(DWord, "NumberOfSymbols", "Number of symbols in the symbol table"));
    data.push(this.readBlock(Word, "SizeOfOptionalHeader", "NtOptional32Header"));
    data.push(this.readBlock(Word, "Characteristics", "ExecutableImage, 32BitMachine"));
    // Optional header
    // Т.к. размер заголовка в любом случае не менее 512 байт, читаем всё. Хотя эти данные могут быть нулевыми
    data.push(this.readBlock(Word, "Magic", "PE32 - State of the image file"));
    data.push(this.readBlock(Byte, "MajorLinkerVersion", ""));
    data.push(this.readBlock(Byte, "MinorLinkerVersion", ""));
    data.push(this.readBlock(DWord, "SizeOfCode", "Size of the code section"));
    data.push(this.readBlock(DWord, "SizeOfInitializedData", "Size of the initialized data section"));
    data.push(this.readBlock(DWord, "SizeOfUninitializedData", "Size of the uninitialized data section"));
    data.push(this.readBlock(DWord, "AddressOfEntryPoint", "Pointer to the entry point function, relative to the image base address, or zero if no entry point is present"));
    data.push(this.readBlock(DWord, "BaseOfCode", "Pointer to the beginning of the code section, relative to the image base"));
    data.push(this.readBlock(DWord, "BaseOfData", "Pointer to the beginning of the data section, relative to the image base"));
    data.push(this.readBlock(DWord, "ImageBase", "Preferred address of the first byte of the image when it is loaded in memory"));
    data.push(this.readBlock(DWord, "SectionAlignment", "Alignment of the section loaded in memory"));
    data.push(this.readBlock(DWord, "FileAlignment", "Alignment of the raw data of sections in the image file"));
    data.push(this.readBlock(Word, "MajorOperatingSystemVersion", "Major version number of the required operating system"));
    data.push(this.readBlock(Word, "MinorOperatingSystemVersion", "Minor version number of the required operating system"));
    data.push(this.readBlock(Word, "MajorImageVersion", ""));
    data.push(this.readBlock(Word, "MinorImageVersion", ""));
    data.push(this.readBlock(Word, "MajorSubsystemVersion", ""));
    data.push(this.readBlock(Word, "MinorSubsystemVersion", ""));
    data.push(this.readBlock(DWord, "Win32VersionValue", "Reserved"));
    data.push(this.readBlock(DWord, "SizeOfImage", "Size of the image including all headers"));
    data.push(this.readBlock(DWord, "SizeOfHeaders", ""));
    data.push(this.readBlock(DWord, "CheckSum", "Image file checksum"));
    data.push(this.readBlock(Word, "Subsystem", "WindowsCui - Subsystem required to run this image"));
    data.push(this.readBlock(Word, "DllCharacteristics", "DynamicBase, NxCompat, TerminalServerAware - DLL characteristics of the image"));
    data.push(this.readBlock(DWord, "SizeOfStackReserve", "Number of bytes to reserve for the stack"));
    data.push(this.readBlock(DWord, "SizeOfStackCommit", "Number of bytes to commit for the stack"));
    data.push(this.readBlock(DWord, "SizeOfHeapReserve", "Number of bytes to reserve for the local heap"));
    data.push(this.readBlock(DWord, "SizeOfHeapCommit", "Number of bytes to commit for the local heap"));
    data.push(this.readBlock(DWord, "LoaderFlags", "Obsolete"));
    data.push(this.readBlock(DWord, "NumberOfRvaAndSizes", "Number of directory entries in the remainder of the optional header"));
    // TODO: Data directories
    this.reader.pointer = 0;
    return data;
  }

  // Извлекает главную информацию из NT заголовка в дружественном виде
  readGeneralInfo(ntHeader) {
    let data = [];

    let machine = ntHeader.find(block => block.name === "Machine").rawNumber;
    let machines = {
      0x0000: "Unknown",
      0x014C: "I386",
      0x014D: "I486",
      0x014E: "PENTIUM",
      0x0160: "R3000_BE",
      0x0162: "R3000",
      0x0166: "R4000",
      0x0168: "R10000",
      0x0169: "WCEMIPSV2",
      0x0184: "ALPHA",
      0x01A2: "SH3",
      0x01A3: "SH3DSP",
      0x01A6: "SH4",
      0x01A8: "SH5",
      0x01C0: "ARM",
      0x01C2: "THUMB",
      0x01D3: "AM33",
      0x01F0: "POWERPC",
      0x01F1: "POWERPCFP",
      0x0200: "IA64",
      0x0266: "MIPS16",
      0x0284: "ALPHA64",
      0x0366: "MIPSFPU",
      0x0466: "MIPSFPU16",
      0x0520: "TRICORE",
      0x0CEF: "CEF",
      0x0EBC: "EBC",
      0x8664: "AMD64",
      0x9104: "M32R",
      0xC0EE: "CEE",
      0x01C4: "ARMNT",
    };
    data.push({name: "Architecture", value: machines[machine]});

    let magic = ntHeader.find(block => block.name === "Magic").rawNumber;
    let magics = {
      0x010B: "PE32",
      0x020B: "PE64",
      0x0107: "ROM",
    };
    data.push({name: "Type", value: magics[magic]});

    let majorOSVersion = ntHeader.find(block => block.name === "MajorOperatingSystemVersion").rawNumber;
    let minorOSVersion = ntHeader.find(block => block.name === "MinorOperatingSystemVersion").rawNumber;
    data.push({name: "Minimal OS version", value: majorOSVersion + "." + minorOSVersion});

    let subsystem = ntHeader.find(block => block.name === "Subsystem").rawNumber;
    let subsystems = {
      0x0000: "Unknown",
      0x0001: "Native",
      0x0002: "WindowsGui",
      0x0003: "WindowsCui",
      0x0005: "Os2Cui",
      0x0007: "PosixCui",
      0x0008: "NativeWindows",
      0x0009: "WindowsCeGui",
      0x000A: "EfiApplication",
      0x000B: "EfiBootServiceDriver",
      0x000C: "EfiRuntimeDriver",
      0x000D: "EfiRom",
      0x000E: "Xbox",
      0x0010: "WindowsBootApplication",
    };
    data.push({name: "Subsystem", value: subsystems[subsystem]});

    let char = ntHeader.find(block => block.name === "Characteristics").rawNumber;
    let chars = {
      0x0001: "RelocsStripped",
      0x0002: "ExecutableImage",
      0x0004: "LineNumsStripped",
      0x0008: "LocalSymsStripped",
      0x0010: "AggressiveWSTrim",
      0x0020: "LargeAddressAware",
      0x0040: "Reserved",
      0x0080: "BytesReversedLo",
      0x0100: "32BitMachine",
      0x0200: "DebugStripped",
      0x0400: "RemovableRunFromSwap",
      0x0800: "NetRunFromSwap",
      0x1000: "System",
      0x2000: "DLL",
      0x4000: "UpSystemOnly",
      0x8000: "BytesReversedHi",
    };
    let charsList = [];
    for (let code in chars)
      if ((char & +code) === +code) charsList.push(chars[code]);
    data.push({name: "Characteristics", value: charsList.join(", ")});

    let dllchar = ntHeader.find(block => block.name === "DllCharacteristics").rawNumber;
    let dllchars = {
      0x0020: "HighEntropyVa",
      0x0040: "DynamicBase",
      0x0080: "ForceIntegrity",
      0x0100: "NxCompat",
      0x0200: "NoIsolation",
      0x0400: "NoSeh",
      0x0800: "NoBind",
      0x1000: "Appcontainer",
      0x2000: "WdmDriver",
      0x4000: "GuardCf",
      0x8000: "TerminalServerAware",
    };
    let dllcharsList = [];
    for (let code in dllchars)
      if ((dllchar & +code) === +code) dllcharsList.push(dllchars[code]);
    data.push({name: "DLL characteristics", value: dllcharsList.join(", ")});

    return data;
  }
}

/*
Класс позволяет перевести байтовую информацию к её текстовым аналогам
 */

export default class DataDictionary {
    // Декодирует архитектуру
    static DecodeMachine(id) {
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
        return machines[id] || "Unknown";
    }

    // Декодирует тип образа
    static DecodeMagic(id) {
        let magics = {
            0x010B: "PE32",
            0x020B: "PE64",
            0x0107: "ROM",
        };
        return magics[id] || "Unknown";
    }

    // Декодирует версию ОС принимая мажорную и минорную версию
    static DecodeOSVersion(maj, min = 0) {
        let version = maj + "." + min;
        let versions = {
            "1.1": "Windows 1.0",
            "1.2": "Windows 1.02",
            "1.3": "Windows 1.03",
            "1.4": "Windows 1.04",
            "2.3": "Windows 2.03",
            "2.10": "Windows 2.10",
            "2.11": "Windows 2.11",
            "3.0": "Windows 3.0",
            "3.10": "Windows 3.1",
            "3.11": "Windows 3.11",
            "3.2": "Windows 3.2",
            "3.50": "Windows 3.5",
            "3.51": "Windows 3.51",
            "4.0": "Windows 95",
            "4.10": "Windows 98",
            "5.0": "Windows 2000",
            "4.90": "Windows ME",
            "5.1": "Windows XP",
            "5.2": "Windows XP Professional x64 Edition",
            "6.0": "Windows Vista",
            "6.1": "Windows 7",
            "6.2": "Windows 8",
            "6.3": "Windows 8.1",
            "10.0": "Windows 10",
        };
        return versions[version] || "Unknown";
    }

    // Декодирует подсистему выполнения
    static DecodeSubsystem(id) {
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
        return subsystems[id] || "Unknown";
    }

    // Декодирует набор характеристик
    static DecodeChars(id) {
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
            if ((id & +code) === +code) charsList.push(chars[code]);
        return charsList;
    }

    // Декодирует набор характеристик библиотеки
    static DecodeDllChars(id) {
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
            if ((id & +code) === +code) dllcharsList.push(dllchars[code]);
        return dllcharsList;
    }
}
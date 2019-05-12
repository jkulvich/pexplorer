/*
Класс занимается чтением блоков байтовой информации, таких как DOS, NT заголовки и директории данных
 */

import FileReader from './FileReader'

const Byte = 1;
const Word = 2;
const DWord = 4;
const QWord = 8;
const YWord = 16;

export default class BlockReader {
    // Читает информацию из DOS заголовка и сбрасывает указатель
    static readDOSHeader(bytes, offset = 0) {
        let reader = new FileReader().setFile(bytes);
        let data = [];
        reader.pointer = offset;

        try {
            data.push(reader.readBlock(Word, "e_magic", "Magic number (MZ)"));
            data.push(reader.readBlock(Word, "e_cblp", "Bytes on last page of file"));
            data.push(reader.readBlock(Word, "e_cp", "Pages in file"));
            data.push(reader.readBlock(Word, "e_crlc", "Relocations"));
            data.push(reader.readBlock(Word, "e_cparhdr", "Size of header in paragraphs"));
            data.push(reader.readBlock(Word, "e_minalloc", "Minimum extra paragraphs needed"));
            data.push(reader.readBlock(Word, "e_maxalloc", "Maximum extra paragraphs needed"));
            data.push(reader.readBlock(Word, "e_ss", "Initial (relative) SS value"));
            data.push(reader.readBlock(Word, "e_sp", "Initial SP value"));
            data.push(reader.readBlock(Word, "e_csum", "Checksum"));
            data.push(reader.readBlock(Word, "e_ip", "Initial IP value"));
            data.push(reader.readBlock(Word, "e_cs", "Initial CS value"));
            data.push(reader.readBlock(Word, "e_lfarlc", "File address of relocation table"));
            data.push(reader.readBlock(Word, "e_ovno", "Overlay number"));
            data.push(reader.readBlock(Word * 4, "e_res", "Reserved"));
            data.push(reader.readBlock(Word, "e_oemid", "OEM identifier"));
            data.push(reader.readBlock(Word, "e_oeminfo", "OEM information; e_oemid specific"));
            data.push(reader.readBlock(Word * 10, "e_res2", "Reserved"));
            data.push(reader.readBlock(Word, "e_lfanew", "File address of new exe header")); // Смещение NT заголовка
        } catch(e) {
            console.error(e);
            return null;
        }

        return data;
    }

    // Читает информацию из NT заголовка и сбрасывает указатель
    static readNTHeader(bytes, offset = 512) {
        // Получить смещение для NT можно следующим образом
        // dosHeader.find(block => block.name === "e_lfanew").rawNumber
        let reader = new FileReader().setFile(bytes);
        let data = [];
        reader.pointer = offset;

        data.push(reader.readBlock(DWord, "Signature", "PE\\0\\0"));
        // COFF
        data.push(reader.readBlock(Word, "Machine", "Architecture type of the computer"));
        data.push(reader.readBlock(Word, "NumberOfSections", "Size of the section table"));
        data.push(reader.readBlock(DWord, "TimeDataStamp", "Date and time the image was created"));
        data.push(reader.readBlock(DWord, "PointerToSymbolTable", "Offset of the symbol table, or zero if no COFF symbol table exists"));
        data.push(reader.readBlock(DWord, "NumberOfSymbols", "Number of symbols in the symbol table"));
        data.push(reader.readBlock(Word, "SizeOfOptionalHeader", "NtOptional32Header"));
        data.push(reader.readBlock(Word, "Characteristics", "ExecutableImage, 32BitMachine"));
        // Optional header
        // Т.к. размер заголовка в любом случае не менее 512 байт, читаем всё. Хотя эти данные могут быть нулевыми
        data.push(reader.readBlock(Word, "Magic", "PE32 - State of the image file"));
        data.push(reader.readBlock(Byte, "MajorLinkerVersion", ""));
        data.push(reader.readBlock(Byte, "MinorLinkerVersion", ""));
        data.push(reader.readBlock(DWord, "SizeOfCode", "Size of the code section"));
        data.push(reader.readBlock(DWord, "SizeOfInitializedData", "Size of the initialized data section"));
        data.push(reader.readBlock(DWord, "SizeOfUninitializedData", "Size of the uninitialized data section"));
        data.push(reader.readBlock(DWord, "AddressOfEntryPoint", "Pointer to the entry point function, relative to the image base address, or zero if no entry point is present"));
        data.push(reader.readBlock(DWord, "BaseOfCode", "Pointer to the beginning of the code section, relative to the image base"));
        data.push(reader.readBlock(DWord, "BaseOfData", "Pointer to the beginning of the data section, relative to the image base"));
        data.push(reader.readBlock(DWord, "ImageBase", "Preferred address of the first byte of the image when it is loaded in memory"));
        data.push(reader.readBlock(DWord, "SectionAlignment", "Alignment of the section loaded in memory"));
        data.push(reader.readBlock(DWord, "FileAlignment", "Alignment of the raw data of sections in the image file"));
        data.push(reader.readBlock(Word, "MajorOperatingSystemVersion", "Major version number of the required operating system"));
        data.push(reader.readBlock(Word, "MinorOperatingSystemVersion", "Minor version number of the required operating system"));
        data.push(reader.readBlock(Word, "MajorImageVersion", ""));
        data.push(reader.readBlock(Word, "MinorImageVersion", ""));
        data.push(reader.readBlock(Word, "MajorSubsystemVersion", ""));
        data.push(reader.readBlock(Word, "MinorSubsystemVersion", ""));
        data.push(reader.readBlock(DWord, "Win32VersionValue", "Reserved"));
        data.push(reader.readBlock(DWord, "SizeOfImage", "Size of the image including all headers"));
        data.push(reader.readBlock(DWord, "SizeOfHeaders", ""));
        data.push(reader.readBlock(DWord, "CheckSum", "Image file checksum"));
        data.push(reader.readBlock(Word, "Subsystem", "WindowsCui - Subsystem required to run this image"));
        data.push(reader.readBlock(Word, "DllCharacteristics", "DynamicBase, NxCompat, TerminalServerAware - DLL characteristics of the image"));
        data.push(reader.readBlock(DWord, "SizeOfStackReserve", "Number of bytes to reserve for the stack"));
        data.push(reader.readBlock(DWord, "SizeOfStackCommit", "Number of bytes to commit for the stack"));
        data.push(reader.readBlock(DWord, "SizeOfHeapReserve", "Number of bytes to reserve for the local heap"));
        data.push(reader.readBlock(DWord, "SizeOfHeapCommit", "Number of bytes to commit for the local heap"));
        data.push(reader.readBlock(DWord, "LoaderFlags", "Obsolete"));
        data.push(reader.readBlock(DWord, "NumberOfRvaAndSizes", "Number of directory entries in the remainder of the optional header"));

        return data;
    }
}
/*
Содержит методы чтения файла на уровне байт
 */

import Bytes from './Bytes'

const Byte = 1;
const Word = 2;
const DWord = 4;
const QWord = 8;
const YWord = 16;

export default class FileReader {
    constructor() {
        // Байты рабочего файла
        this.bytes = new Uint8Array(0);
        // Указатель на текущую позицию
        this.pointer = 0;
    }

    // Устанавливает байты рабочего файла
    setFile(bytes) {
        this.bytes = bytes;
        this.pointer = 0;
        return this;
    }

    // Возвращает true если указатель находится в конце файла
    isEOF() {
        return this.pointer >= this.bytes.length - 1;
    }

    // Читает следующий байт или выбрасывает исключение, если конец файла
    readNext() {
        if (!this.isEOF())
            return this.bytes[this.pointer++];
        else
            throw "EOF";
    }

    // Возвращает логическое значение, говорящее, возможно ли прочитать следующее количество байт прежде чем файл закончиться
    canRead(count) {
        return this.pointer + count <= this.bytes.length;
    }

    // Читает несколько байт и возвращает их, выбрасывает исключение если достигнут конец файла
    readArray(count) {
        if (this.canRead(count))
            return new Array(count).fill(0).map(() => this.readNext());
        else
            throw "EOF";
    }

    // Читает следующий блок и пакует его в описательную форму
    readBlock(count, name = "", desc = "") {
        let offset = this.pointer;
        let block = this.readArray(count);
        let types = {
            1: "Byte",
            2: "Word",
            4: "DWord",
            8: "QWord",
            16: "YWord",
        };
        return {
            name,
            desc,
            raw: block,
            offset: offset,
            type: types[block.length] || "Data",
            num: Bytes.arrayToNumber(block),
            text: Bytes.arrayToString(block),
            hex: Bytes.arrayToHex(block),
        };
    };
}

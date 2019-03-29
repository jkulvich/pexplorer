/*
Содержит методы чтения файла на уровне байт
 */

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
}

import {DB} from "../models/db/db.types";
import {useState} from "react";

export enum SaveFileType {
  Current = 'CURRENT',
  New = 'NEW'
}

export function useFile() {
  const [fileHandler, setFileHandler] = useState<FileSystemFileHandle | null>(null);

  async function load() {
    const filePickerOptions: OpenFilePickerOptions = {
      types: [{
        description: 'Файл dbm',
        accept: {'application/dbm': ['.dbm']}
      }],
      multiple: false,
      excludeAcceptAllOption: true
    };

    let fileHandlers: FileSystemFileHandle[] = [];

    try {
      fileHandlers = await window.showOpenFilePicker(filePickerOptions);
    } catch (error) {
      console.error(error);
    }

    if (!fileHandlers.length) {
      return;
    }

    const [handler] = fileHandlers;
    const file = await handler.getFile();

    let parsedDb: DB | null = null;

    try {
      parsedDb = JSON.parse(await file.text())
    } catch ({message}) {
      console.error(`Ошибка парсинга файла базы данных: ${message}`);
    }

    if (!parsedDb) {
      return;
    }

    setFileHandler(handler);

    return parsedDb;
  }

  async function getSaveFileHandler() {
    const saveFileOptions: SaveFilePickerOptions = {
      types: [{
        description: 'Файл dbm',
        accept: {'application/dbm': ['.dbm']}
      }],
      excludeAcceptAllOption: true,
    }

    let saveHandle: FileSystemFileHandle | null = null;

    try {
      saveHandle = await window.showSaveFilePicker(saveFileOptions);
    } catch (error) {
      console.error(error);
    }

    return saveHandle;
  }

  async function save(db: DB, type: SaveFileType): Promise<boolean> {
    if (!db) {
      console.error('Не указана бд для сохранения');
      return false;
    }

    if (!Object.values(SaveFileType).includes(type)) {
      console.error(`Тип ${type} не поддерживается`);
      return false;
    }

    let serializedDb: string = '';

    try {
      serializedDb = JSON.stringify(db);
    } catch (e) {
      console.error(e);
      return false;
    }

    let handler: FileSystemFileHandle | null = fileHandler;

    if (
      (type === SaveFileType.Current && !handler)
      || type === SaveFileType.New
    ) handler = await getSaveFileHandler();

    if (!handler) {
      return false;
    }

    const writableStream = await handler.createWritable();
    await writableStream.write(serializedDb);
    await writableStream.close();

    setFileHandler(handler);

    return true;
  }

  return {
    fileHandler,
    load,
    save
  }
}
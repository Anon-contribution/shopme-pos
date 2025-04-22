import 'reflect-metadata';
import { Capacitor } from '@capacitor/core';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';
import AppDataSource, { connection, DBName } from '../database/data-sources/AppDataSource';

customElements.define('jeep-sqlite', JeepSqlite);

try {
  if (Capacitor.getPlatform() != 'web') {
    await AppDataSource.initialize();
    if (AppDataSource.isInitialized) {
      await AppDataSource.runMigrations();
    }
  } else {
    console.log('init web platform');

    const jeepEl = document.createElement('jeep-sqlite');
    jeepEl.setAttribute('wasm', '/assets/sql-wasm.wasm');
    jeepEl.setAttribute('autoSave', 'true');
    document.body.appendChild(jeepEl);
    await customElements.whenDefined('jeep-sqlite');
    await connection.initWebStore();
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    await connection.saveToStore(DBName);
  }
} catch (error) {
  console.log(error);
}

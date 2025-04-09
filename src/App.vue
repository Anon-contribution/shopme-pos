<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';
// import InitializeAppService from '../src/database/services/initializeAppService';

// Define services as unique

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db: SQLiteDBConnection | null = null;

export default defineComponent({
  name: 'App',

  setup() {
    customElements.define('jeep-sqlite', JeepSqlite);
    const platform = Capacitor.getPlatform();

    const initDB = async () => {
      const dbName = 'shopmeDB';

      try {
        if (platform == 'web') {
          const jeepEl = document.createElement('jeep-sqlite');
          jeepEl.setAttribute('wasm', '/assets/sql-wasm.wasm');
          document.body.appendChild(jeepEl);
          await customElements.whenDefined('jeep-sqlite');
          await CapacitorSQLite.initWebStore();
        }
        // ✅ Créer la connexion
        db = await sqlite.createConnection(dbName, false, 'no-encryption', 0, false);
        console.log(db);
        // ✅ Ouvrir la DB
        await db.open();
        await sqlite.saveToStore(dbName);
      } catch (error) {
        console.error('DB Initialization error:', error);
      }
    };

    onMounted(async () => {
      await initDB();
    });
    return {};
  },
});
</script>

import { type ISQLiteService } from './sqliteService';
//  import { IStorageService } from '../services/storageService';

export interface IInitializeAppService {
  initializeApp(): Promise<boolean>;
}

class InitializeAppService implements IInitializeAppService {
  appInit = false;
  sqliteServ!: ISQLiteService;
  //  storageServ!: IStorageService;
  platform!: string;

  constructor(sqliteService: ISQLiteService /*, storageService: IStorageService */) {
    this.sqliteServ = sqliteService;
    //  this.storageServ = storageService;
    this.platform = this.sqliteServ.getPlatform();
  }
  async initializeApp(): Promise<boolean> {
    if (!this.appInit) {
      try {
        if (this.platform === 'web') {
          console.log('init web store');
          await this.sqliteServ.initWebStore();
        }
        // Initialize the myuserdb database
        //  await this.storageServ.initializeDatabase();
        const database = await this.sqliteServ?.openDatabase('mydb', 0, true);
        console.log(database);
        if (this.platform === 'web') {
          console.log('saveToStore "mydb"');
          await this.sqliteServ.saveToStore('mydb');
        }
        this.appInit = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const msg = error.message ? error.message : error;
        throw new Error(`initializeAppError.initializeApp: ${msg}`);
      }
    }
    return this.appInit;
  }
}
export default InitializeAppService;

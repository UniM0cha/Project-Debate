declare namespace NodeJS {
  export interface ProcessEnv {
    MYSQL_DB_HOST?: string;
    MYSQL_DB_PORT?: string;
    MYSQL_DB_USER?: string;
    MYSQL_DB_PASS?: string;
    MYSQL_DB_NAME?: string;
    PORT?: string;
  }
}

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Definir os dados padrão 
const defaultData = {
  users: [],
  products: [],
  orders: []
};

// Configurar o adaptador
const adapter = new JSONFile('db.json');

// Passar os 'defaultData' no construtor
const db = new Low(adapter, defaultData);

// Criar uma função para inicializar o DB
export const initDatabase = async () => {
  // db.read() vai ler o db.json ou usar o defaultData
  // se o arquivo não existir.
  await db.read();
};

// Exporta a instância do db para usar nas suas rotas
export default db;
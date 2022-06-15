require("dotenv").config();
const mongoose = require("mongoose");
const { getSecret } = require("./keyvault");

async function putKeyVaultSecretInEnvVar() {

    const secretName = process.env.KEY_VAULT_SECRET_NAME_DATABASE_URL;
    const keyVaultName = process.env.KEY_VAULT_NAME;

    console.log(secretName);
    console.log(keyVaultName);

    if (!secretName || !keyVaultName) throw Error("getSecret: Required params missing");

    connectionString = await getSecret(secretName, keyVaultName);
    process.env.AZURE_COSMOS_CONNECTIONSTRING = connectionString;

}

async function getConnectionInfo() {
  if (!process.env.AZURE_COSMOS_CONNECTIONSTRING) {

    await putKeyVaultSecretInEnvVar();

    // still don't have a database url?
    if(!process.env.AZURE_COSMOS_CONNECTIONSTRING){
      throw new Error("No value in AZURE_COSMOS_CONNECTIONSTRING in env var");
    }
  }

  // To override the database name, set the DATABASE_NAME environment variable in the .env file
  const DATABASE_NAME = process.env.DATABASE_NAME || "azure-todo-app";

  return {
    DATABASE_URL: process.env.AZURE_COSMOS_CONNECTIONSTRING,
    DATABASE_NAME: DATABASE_NAME
  }
}


module.exports = {
  getConnectionInfo
}

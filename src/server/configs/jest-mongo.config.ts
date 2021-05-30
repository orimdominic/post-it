module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: "jest",
    },
    binary: {
      version: "4.0.2",
      skipMD5: true,
    },
    autoStart: false,
  },
};

// import mongoose from "mongoose"; // eslint-disable-line
// mongoose.set("useCreateIndex", true);
// mongoose.Promise = global.Promise;

// async function removeAllCollections() {
//   const collections = Object.keys(mongoose.connection.collections);
//   for (const collectionName of collections) {
//     const collection = mongoose.connection.collections[collectionName];
//     await collection.deleteMany({});
//   }
// }

// async function dropAllCollections() {
//   const collections = Object.keys(mongoose.connection.collections);
//   for (const collectionName of collections) {
//     const collection = mongoose.connection.collections[collectionName];
//     try {
//       await collection.drop();
//     } catch (error) {
//       // Sometimes this error happens, but you can safely ignore it
//       if (error.message === "ns not found") return;
//       // This error occurs when you use it.todo. You can
//       // safely ignore this error too
//       if (error.message.includes("a background operation is currently running"))
//         return;
//       console.log(error.message);
//     }
//   }
// }

// export const setupDB = function (databaseName: string): void {
//   // Connect to Mongoose
//   let conn: typeof mongoose;
//   beforeAll(async () => {
//     const url = `mongodb://127.0.0.1/${databaseName}`;
//     conn = await mongoose.connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   });

//   // Cleans up database between each test
//   afterEach(async () => {
//     await removeAllCollections();
//   });

//   // Disconnect Mongoose
//   afterAll(async () => {
//     await dropAllCollections();
//     await conn.connection.db.dropDatabase();
//     await mongoose.connection.close();
//   });
// };

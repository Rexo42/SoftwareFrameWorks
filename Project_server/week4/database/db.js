import {MongoClient} from 'mongodb';
import { ObjectId } from "mongodb";
import {User} from './classes/User.js';
import { Group } from './classes/Group.js';
import dotenv from 'dotenv';
dotenv.config();

//const uri = 'mongodb://localhost:27017';
const uri = process.env.uri;
const client = new MongoClient(uri);
let db = null;

async function mongoConnect()
{
  if (!db)
  {
    try
    {
      await client.connect();
      db = client.db('softwareFrameworks');
      console.log('Connected to DB Successfully');
      setup();
    }
    catch (error)
    {
      console.error("failed to connect to database: ", error);
      throw error;
    }
  }
  return db;
}

async function setup()
{
    // await db.collection('Users').deleteMany({});
    await db.collection('Groups').deleteMany({}); // clear user db on start if needed
    const collectionNames = ["Users", "Groups"];
    try
    {
        for (let i = 0; i < collectionNames.length; i++)
        {
            const collections = await db.listCollections({name: collectionNames[i]}).toArray();
            if (collections.length === 0)
            {
            await db.createCollection(collectionNames[i]);
            console.log("created collection successfully");
            }
            else
            {
            console.log("collection with name already exists");
            }
            const target = await db.collection(collectionNames[i]);
            const count = await target.countDocuments();
            if (count == 0 && collectionNames[i] == "Users")
            {
                let newUser = new User("test1", "test1@example.com", "1234", "SuperAdmin");
                await target.insertOne(newUser);
                console.log("successfully added user: ",newUser.username, " to the database");
            }
            else if (count == 0 && collectionNames[i] == "Groups")
            {
                let newGroup = new Group("publicGroup", {_id: new ObjectId("68d0d83153414afa520a4a25"), username: "test1", role: "GroupAdmin"});
                await target.insertOne(newGroup);
                console.log("successfully created group: ",newGroup.groupName, " to the database");
            }
            else
            {
                console.log("users already exist within database");
            }

        }

        console.log("database setup successfully complete...");
        return db;
    }
    catch(error)
    {
        console.error("failed to setup database: ", error);
        throw(error);
    }
}

export default mongoConnect;
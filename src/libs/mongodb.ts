import { MongoClient } from "mongodb";

// declare global {
//     var _mongoClient: Promise<MongoClient> | MongoClient | undefined;
// }

let client: MongoClient | undefined

export async function mongoConnect(){
    try{
        if (process.env.NODE_ENV === "development"){
            if (!client)
                client = await MongoClient.connect(process.env.MONGO_URI!)
            return client
        }
        else{
            const client = await MongoClient.connect(process.env.MONGO_URI!)
            return client
        }
    }
    catch(error){
        console.log("error in establishing connection with mongodb: ", error)
    }
}
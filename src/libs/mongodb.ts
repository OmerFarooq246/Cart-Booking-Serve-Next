import { MongoClient } from "mongodb";

declare global {
    var _mongoClient: MongoClient | undefined
}

export async function mongoConnect(){
    try{
        if (process.env.NODE_ENV === "development"){
            if (!global._mongoClient)
                global._mongoClient = await MongoClient.connect(process.env.MONGO_URI!)
            return global._mongoClient
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
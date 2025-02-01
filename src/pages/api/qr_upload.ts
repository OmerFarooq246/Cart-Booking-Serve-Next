import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST"){
        try {
            
        }
        catch (error){
            console.log("error in qr_upload endpoint: ", error)
            res.status(500).json({error: `error qr_upload endpoint: ${error}`})
        }
    }
    else{
        res.status(500).json({error: `error in qr_upload endpoint: unknown req method`})       
    }
}
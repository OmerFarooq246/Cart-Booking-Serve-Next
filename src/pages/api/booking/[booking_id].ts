import type { NextApiRequest, NextApiResponse } from "next";
import { mongoConnect } from "@/libs/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET"){
        try {
            const client = await mongoConnect()
            const Bookings = client?.db("Cart_Booking").collection("Bookings")
            const { booking_id } = req.query
            const id = typeof booking_id === "string" ? booking_id : undefined
            
            const booking = await Bookings?.findOne({ _id : new ObjectId(id) })
            if (booking){
                console.log("booking:", booking)
                if (booking.status === "used")
                    return {"status": 409, "error": "Booking is already used"}
                else if (booking.status === "active"){
                    const res = await Bookings?.updateOne({ _id: new ObjectId(id) }, { $set: { status: "used" } })
                    console.log("res:", res)
                    return {"status": 200, "message": "Booking status set to used"}
                }
                else
                    return {"status": 409, "error": "Booking has an unknown status"}
            }
            else
                return {"status": 404, "error": "No booking found for the requested id"}
        }
        catch (error){
            console.log("error in booking endpoint: ", error)
            res.status(500).json({error: `error booking endpoint: ${error}`})
        }
    }
    else{
        res.status(500).json({error: `error in booking endpoint: unknown req method`})       
    }
}
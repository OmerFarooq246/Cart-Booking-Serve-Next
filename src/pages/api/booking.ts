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
            console.log("booking_id: ", booking_id)
            
            const booking = await Bookings?.findOne({ _id : new ObjectId(id) })
            if (booking){
                console.log("booking:", booking)
                if (booking.status === "used")
                    res.status(409).json({error: "الحجز مستخدم مسبقًا."})
                else if (booking.status === "active"){
                    const result = await Bookings?.updateOne({ _id: new ObjectId(id) }, { $set: { status: "used" } })
                    console.log("result:", result)
                    const res_json = {
                        "message": "تم تغيير حالة الحجز إلى مستخدم.",
                    }
                    res.status(200).json(res_json)
                }
                else
                    res.status(409).json({"error": "Booking has an unknown status"})
            }
            else
                res.status(404).json({"error": "No booking found for the requested id"})
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
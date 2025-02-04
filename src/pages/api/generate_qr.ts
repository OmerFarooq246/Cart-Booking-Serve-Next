import QRCode from 'qrcode';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST"){
        try {
            const booking_id = req.body.booking_id
            if (booking_id){
                try{
                    const fileName = `${booking_id}.png`
                    const img_path = path.join(process.cwd(), 'public/qr_codes', fileName);
                    const data = `${process.env.SERVE}/api/booking?booking_id=${booking_id}`
                    await QRCode.toFile(img_path, data, {
                        width: 300,
                        errorCorrectionLevel: 'H',
                    });
                    const qrUrl = `/qr_codes/` + fileName;
                    return res.status(200).json({ qrUrl });
                }
                catch (error){
                    console.log("error in generate_qr endpoint: ", error)
                    res.status(500).json({error: `error in generating qr: ${error}`})
                }
            }
            else {
                console.log("error in generate_qr: booking id not recieved")
                res.status(500).json({error: `error generate_qr endpoint: booking id not recieved`})
            }
        }
        catch (error){
            console.log("error in generate_qr endpoint: ", error)
            res.status(500).json({error: `error generate_qr endpoint: ${error}`})
        }
    }
    else{
        res.status(500).json({error: `error in generate_qr endpoint: unknown req method`})       
    }
}
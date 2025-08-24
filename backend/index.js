import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import cors from 'cors';
import fs from 'fs';  // <-- import fs to read file

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

// Allow CORS from your frontend
app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json());

app.post('/send-confirmation', async (req, res) => {
  const { email, name } = req.body;

  try {
    // 1. Read the PDF file (must exist in your backend folder)
    const pdfBuffer = fs.readFileSync('Ai-Thesis.pdf');
    const base64File = pdfBuffer.toString('base64');

    // 2. Send email with styled HTML + PDF attachment
    const response = await resend.emails.send({
      from: 'AI Global Networks <info@aiglobalnetworks.co.za>',
      to: email,
      subject: 'Form Submitted Successfully!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
          <h2 style="color: #ff8c00ff;">Hi ${name},</h2>
          <p style="font-size: 16px; color: #333;">
            Thank you for your submission. We’re excited to have you onboard!
          </p>
          <div style="margin-top: 20px; padding: 10px; border: 1px solid #ddd; background: #fff;">
            <p style="margin: 0;">✅ Your details were received successfully.</p>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #777;">
            — The AI Global Networks Team
          </p>
        </div>`,
      attachments: [
        {
          filename: 'Ai-Thesis.pdf',
          content: base64File
        }
      ]
    });

    console.log("Resend API response:", response);
    res.status(200).json({ message: 'Email sent with attachment' });
  } catch (error) {
    console.error("Resend API error:", error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});
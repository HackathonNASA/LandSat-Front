import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4321; // Asegúrate de que este sea el puerto correcto

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruta para la raíz
app.get('/', (req, res) => {
    res.send('Server is running.'); // Respuesta simple
});

// Configura el transportador de Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Cambia esto por tu proveedor SMTP
    port: 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: 'landsatproject@gmail.com', // Tu correo
        pass: 'difsjmlbumkcmdms', // Tu contraseña
    },
});

// Ruta para manejar el envío del correo
app.post('/api/send-email', (req, res) => {
    console.log('Received email submission:', req.body);
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'landsatproject@gmail.com',
        subject: `New message from ${name}`,
        text: message,
        replyTo: email,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully' });
    });
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

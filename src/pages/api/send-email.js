import nodemailer from 'nodemailer';

export async function post({ request }) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    console.log('Received form data:', { name, email, message });

    // Configura el transporter de nodemailer para Gmail
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: 'landsatproject@gmail.com', // reemplaza con tu correo de Gmail
        pass: 'difsjmlbumkcmdms', // reemplaza con tu contraseña de aplicación
      },
    });

    console.log('Attempting to send email...');

    // Envía el correo
    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "landsatproject@gmail.com",
      subject: "Nuevo mensaje de contacto",
      text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
      html: `<p><strong>Nombre:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mensaje:</strong> ${message}</p>`,
    });

    console.log('Email sent successfully:', info);

    return new Response(JSON.stringify({ message: "Correo enviado con éxito" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error detallado al enviar el correo:", error);
    return new Response(JSON.stringify({ message: "Error al enviar el correo", error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
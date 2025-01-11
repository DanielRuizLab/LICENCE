document.getElementById('generatePdf').addEventListener('click', function () {
    const photo = document.getElementById('photo').files[0];
    const fullName = document.getElementById('fullName').value.toUpperCase();
    const lastName = document.getElementById('lastName').value.toUpperCase();
    const cc = document.getElementById('cc').value;
    const rh = document.getElementById('rh').value.toUpperCase();
    const arl = document.getElementById('arl').value;

    if (!photo || !fullName || !lastName || !cc || !rh || !arl) {
        alert("Por favor complete todos los campos.");
        return;
    }

    if (!/^\d+$/.test(cc)) {
        alert("El campo CC solo puede contener números.");
        return;
    }

    const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodTypes.includes(rh)) {
        alert("El campo RH solo puede contener tipos de sangre válidos (A+, A-, B+, B-, AB+, AB-, O+, O-).");
        return;
    }

    const { jsPDF } = window.jspdf;

    const reader = new FileReader();
    reader.onload = function (e) {
        const photoData = e.target.result;

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'cm',
            format: [8, 5]
        });

        const logo = 'ico/logooppo2.png';
        const bgImage = 'ico/logome2.png';

        try {
            doc.addImage(bgImage, 'PNG', 2.8, 0.2, 2, 0.6);
        } catch (error) {
            console.error('Error al agregar el logo: ', error);
        }

        try {
            doc.addImage(logo, 'PNG', 0.4, 0.3, 1.5, 0.5);
        } catch (error) {
            console.error('Error al agregar el fondo: ', error);
        }

        const image = new Image();
        image.src = photoData;
        image.onload = function () {
            const photoX = (8 - 2.5) / 2 - 1.5;
            doc.addImage(photoData, 'JPEG', photoX, 0.9, 2.5, 3);

            // Nombre
            doc.setFont("helvetica", "bold"); // Fuente y estilo
            doc.setFontSize(13); // Tamaño
            doc.setTextColor(100, 149, 237); // Color
            const pageWidth = doc.internal.pageSize.getWidth();
            const fullNameWidth = doc.getTextWidth(fullName);
            const fullNameX = (pageWidth - fullNameWidth) / 2;
            doc.text(fullName, fullNameX, 4.5); // Centrando el texto

            // Apellido
            doc.setFont("helvetica", "normal"); // Cambia estilo a normal
            doc.setFontSize(8); // Tamaño más pequeño
            doc.setTextColor(0, 0, 0); // Color negro
            const lastNameWidth = doc.getTextWidth(lastName);
            const lastNameX = (pageWidth - lastNameWidth) / 2;
            doc.text(lastName, lastNameX, 5); // Centrando el apellido

            // CC
            doc.setFontSize(8); // Tamaño reducido
            doc.text(`C.C. ${cc}`, 1.4, 5.5);

            // RH
            doc.setFontSize(8); // Mantén el tamaño reducido
            doc.text(`RH: ${rh}`, 1.9, 6);

            // ARL
            doc.setFontSize(8); // Igual tamaño reducido
            doc.text(`ARL: ${arl}`, 1.7, 6.3);

            // Enlace del sitio web
            doc.setFontSize(9);
            doc.text("www.multiempleos.com.co", 0.7, 6.6);

            // Línea de separación
            doc.setDrawColor(15, 75, 155);
            doc.setLineWidth(0.5);
            doc.line(0, 7.5, 8, 7.5);

            // Nueva página
            doc.addPage();

            // Texto largo
            const longText = ` Este documento identifica al portador
        como empleado en misión de
                MULTIEMPLEOS S.A.   
                
    Es deber del portador devolverlo a
                MULTIEMPLEOS S.A.
    al terminar de prestar sus servicios.

    En caso de daño o pérdida de este
    documento, el trabajador responderá
                        por su valor.








                       ARL SURA:
    018000511414 O  018000941414

    WHATSAPP MULTIEMPLEOS S.A
                       300 187 6692`;

            const textWidth = 7.5;
            const textLines = doc.splitTextToSize(longText, textWidth);

            // Logos en la segunda página
            const logoSura = 'ico/logosura.png';
            const bgImage2 = 'ico/logome2.png';

            try {
                doc.addImage(logoSura, 'PNG', 1.7, 3.3, 2.5, 1.2);
            } catch (error) {
                console.error('Error al agregar el logo Sura: ', error);
            }

            try {
                doc.addImage(bgImage2, 'PNG', 1.6, 7, 2, 0.6);
            } catch (error) {
                console.error('Error al agregar el fondo: ', error);
            }

            // Añadir texto largo
            doc.setFontSize(6);
            let y = 1;
            textLines.forEach(line => {
                doc.text(line, 0.7, y);
                y += 0.2;
            });

            // Guardar el PDF
            doc.save(`${fullName}_${lastName}_Carnet.pdf`);
        };

        image.onerror = function () {
            console.error('La imagen cargada no es válida.');
            alert('La imagen cargada no es válida. Por favor, elija una imagen JPG o PNG.');
        };
    };

    reader.readAsDataURL(photo);
});

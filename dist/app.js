document.getElementById('cotizacionForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Detener el envío tradicional del formulario

    const mensajeRespuesta = document.getElementById('mensaje-respuesta');
    mensajeRespuesta.textContent = 'Enviando cotización...';
    mensajeRespuesta.style.color = 'blue';

    // 1. Recoger los datos del formulario
    const data = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        descripcion: document.getElementById('descripcion').value,
        fecha: new Date().toISOString()
    };

    // 2. Definir la URL de tu API en Azure
    // **IMPORTANTE**: Reemplaza esta URL con la de tu Azure App Service
    const apiUrl = 'https://carpinteria-ap.azurewebsites.net/api/cotizaciones'; 

    try {
        // 3. Enviar los datos a la API (Backend)
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            mensajeRespuesta.textContent = '✅ ¡Cotización enviada con éxito! Pronto nos contactaremos contigo.';
            mensajeRespuesta.style.color = 'green';
            document.getElementById('cotizacionForm').reset(); // Limpiar el formulario
        } else {
            // Manejo de errores de la API
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error desconocido al guardar la cotización.');
        }

    } catch (error) {
        console.error('Error al enviar la cotización:', error);
        mensajeRespuesta.textContent = `❌ Error al enviar. Intenta más tarde. Detalle: ${error.message}`;
        mensajeRespuesta.style.color = 'red';
    }
});

// =================================================================
// LÓGICA DEL CARRUSEL DE IMÁGENES
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Si no hay formulario, no intentes agregar el listener (para que el código siga funcionando)
    const form = document.getElementById('cotizacionForm');
    if (form) {
        form.addEventListener('submit', enviarCotizacion);
    }
    
    // Si hay carrusel, inicializar la lógica
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-button');
        const prevButton = document.querySelector('.prev-button');
        const slideWidth = slides[0].getBoundingClientRect().width; // Ancho de un slide

        let currentSlideIndex = 0;

        // Función para mover el carrusel
        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        };

        // Arreglar la posición de cada slide
        const setSlidePosition = (slide, index) => {
            // Cada slide estará a 100% * su índice
            slide.style.left = 100 * index + '%'; 
        };
        slides.forEach(setSlidePosition);

        // Actualizar la posición del carrusel
        const updateCarousel = (index) => {
             // Mover el track al 100% * índice
             track.style.transform = `translateX(-${index * 100}%)`;
             currentSlideIndex = index;
        };

        // Evento para el botón Siguiente
        nextButton.addEventListener('click', e => {
            let targetIndex = currentSlideIndex + 1;
            // Si es el último, regresa al primero (índice 0)
            if (targetIndex >= slides.length) {
                targetIndex = 0;
            }
            updateCarousel(targetIndex);
        });

        // Evento para el botón Anterior
        prevButton.addEventListener('click', e => {
            let targetIndex = currentSlideIndex - 1;
             // Si es el primero, va al último
            if (targetIndex < 0) {
                targetIndex = slides.length - 1;
            }
            updateCarousel(targetIndex);
        });
    }
});
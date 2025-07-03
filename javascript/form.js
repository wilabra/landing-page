document.addEventListener('DOMContentLoaded', function () {
    // Este código se ejecutará solo cuando la página web (el DOM) esté completamente cargada.
    // Es una buena práctica para asegurarnos de que todos los elementos HTML ya existan antes de intentar manipularlos.

    // --- 1. Seleccionar los elementos del formulario que vamos a necesitar ---
    // Usamos 'document.getElementById' para obtener cada campo de entrada y el área de mensaje,
    // así como los elementos donde mostraremos los mensajes de feedback.
    // Usamos 'var' para declarar las variables, aunque 'let' y 'const'
    // son más modernos y se recomiendan en JavaScript actual por su manejo de ámbito (scope),
    // 'var' sigue siendo válido y funciona.
    var formulario = document.querySelector('.needs-validation'); // Seleccionamos el formulario principal.
    var campoNombre = document.getElementById('inputName');       // Campo para el nombre.
    var campoEmail = document.getElementById('inputEmail');       // Campo para el email.
    var campoAsunto = document.getElementById('inputSubject');    // Campo para el asunto.
    var campoMensaje = document.getElementById('inputMessage');   // Campo para el mensaje.

    // Elemento para mostrar mensajes de éxito o error generales del formulario.
    var retroalimentacionFormulario = document.getElementById('formFeedback');

    // Botones del formulario.
    var botonEnviarPrincipal = formulario.querySelector('button[type="submit"]'); // El botón para enviar el formulario.
    var botonEnviarOtro = document.getElementById('sendAnotherMessageBtn');     // El botón para enviar otro mensaje después de uno exitoso.

    // Array para almacenar todos los campos que queremos validar. Esto facilita recorrerlos.
    var camposFormulario = [campoNombre, campoEmail, campoAsunto, campoMensaje];

    // --- Configuración de accesibilidad (No estrictamente necesario para la funcionalidad básica, pero buena práctica) ---
    // Si el elemento de retroalimentación existe, le añadimos un atributo 'aria-live'.
    // Esto ayuda a los lectores de pantalla a anunciar los mensajes que aparecen en este div,
    // mejorando la accesibilidad para personas con discapacidad visual.
    if (retroalimentacionFormulario) {
        retroalimentacionFormulario.setAttribute('aria-live', 'polite');
    }

    // --- 2. Función para mostrar mensajes de retroalimentación globales (éxito/error) ---
    // Esta función maneja la visibilidad y el estilo del div 'formFeedback'.
    function mostrarRetroalimentacion(tipo, mensaje) {
        // Los parámetros `tipo` y `mensaje` son valores que se "pasan" a la función cuando se llama.
        // Por ejemplo, `mostrarRetroalimentacion('success', '¡Formulario enviado!')`.
        // En este momento, `tipo` y `mensaje` no están declarados como variables globales,
        // solo existen dentro del ámbito de esta función cuando se la invoca.

        retroalimentacionFormulario.textContent = mensaje; // Establece el texto del mensaje.
        // Limpia cualquier clase de estilo anterior (como 'success' o 'error').
        retroalimentacionFormulario.classList.remove('success', 'error');
        // Añade la clase CSS adecuada ('success' para verde, 'error' para rojo).
        retroalimentacionFormulario.classList.add(tipo);
        retroalimentacionFormulario.style.display = 'block'; // Hace que el div sea visible.
        retroalimentacionFormulario.style.opacity = '1';     // Asegura que sea completamente visible (para transiciones).

        // --- Temporizador para ocultar mensajes de error (No estrictamente necesario para la validación) ---
        // Este bloque solo se ejecuta si el mensaje es de tipo 'error'.
        // Hace que el mensaje de error se desvanezca y oculte después de 5 segundos.
        if (tipo === 'error') {
            setTimeout(function () { // Inicia un temporizador.
                retroalimentacionFormulario.style.opacity = '0'; // Comienza el desvanecimiento.
                setTimeout(function () { // Otro temporizador para ocultar completamente después del desvanecimiento.
                    retroalimentacionFormulario.style.display = 'none'; // Oculta el div.
                    retroalimentacionFormulario.style.opacity = '1';    // Restablece la opacidad para futuros usos.
                }, 300); // Espera 0.3 segundos (la duración de la transición CSS).
            }, 5000); // El mensaje de error se mantiene visible durante 5 segundos.
        }
        // Los mensajes de éxito no se ocultan automáticamente para que el usuario pueda ver el botón "Enviar otro mensaje".
    }

    // --- 3. Función para actualizar el aspecto visual de un campo (verde/rojo) ---
    // Esta función añade o quita las clases 'is-valid' e 'is-invalid' de Bootstrap
    // y controla los mensajes de feedback específicos de cada campo.
    function actualizarInterfazCampo(elementoCampo, esValido, mensaje) {
        // Los parámetros `elementoCampo`, `esValido`, `mensaje` son valores que se "pasan" a la función cuando se llama.

        // Elimina cualquier clase de validación de Bootstrap ('is-valid' o 'is-invalid').
        elementoCampo.classList.remove('is-valid', 'is-invalid');
        // Quita el atributo 'aria-invalid' para accesibilidad por defecto.
        elementoCampo.setAttribute('aria-invalid', 'false');

        // Selecciona el div que muestra el mensaje de error para este campo específico.
        var elementoRetroalimentacionInvalid = document.getElementById(elementoCampo.id + 'Feedback');
        // Selecciona el div que muestra el mensaje de éxito para este campo.
        // Asumimos que el 'valid-feedback' es el siguiente hermano o el siguiente después del 'invalid-feedback'.
        var elementoRetroalimentacionValid = elementoCampo.nextElementSibling;
        if (elementoRetroalimentacionValid && elementoRetroalimentacionValid.classList.contains('invalid-feedback')) {
            elementoRetroalimentacionValid = elementoRetroalimentacionValid.nextElementSibling;
        }

        // Limpia cualquier mensaje de error anterior en el div de feedback inválido.
        if (elementoRetroalimentacionInvalid) {
            elementoRetroalimentacionInvalid.textContent = '';
        }

        if (esValido) {
            // Si el campo es válido:
            elementoCampo.classList.add('is-valid'); // Añade la clase 'is-valid' (borde verde).
            if (elementoRetroalimentacionInvalid) {
                elementoRetroalimentacionInvalid.style.display = 'none'; // Oculta el mensaje de error.
            }
            if (elementoRetroalimentacionValid) {
                elementoRetroalimentacionValid.style.display = 'block';  // Muestra el mensaje de "¡Se ve bien!".
            }
        } else {
            // Si el campo NO es válido:
            elementoCampo.classList.add('is-invalid'); // Añade la clase 'is-invalid' (borde rojo).
            elementoCampo.setAttribute('aria-invalid', 'true'); // Indica que el campo es inválido para lectores de pantalla.
            if (elementoRetroalimentacionInvalid) {
                elementoRetroalimentacionInvalid.textContent = mensaje; // Muestra el mensaje de error específico.
                elementoRetroalimentacionInvalid.style.display = 'block'; // Muestra el mensaje de error.
            }
            if (elementoRetroalimentacionValid && !elementoRetroalimentacionValid.classList.contains('invalid-feedback')) {
                elementoRetroalimentacionValid.style.display = 'none'; // Oculta el mensaje de "¡Se ve bien!".
            }
        }
    }

    // --- 4. Función para validar un campo individualmente ---
    // Contiene la lógica de validación para cada tipo de campo.
    function validarCampoIndividual(campo) {
        // El parámetro `campo` es el elemento HTML del campo que se está validando.
        // No está declarado globalmente, solo existe cuando se llama a esta función.

        // Obtenemos el valor actual del campo y eliminamos espacios al inicio/fin (trim).
        // Se crea una nueva variable `valor` para almacenar el contenido del campo después de limpiarlo.
        // Esto se hace para trabajar con un dato limpio y consistente en la validación.
        var valor = campo.value.trim();
        var esValido = true; // Asumimos que es válido al principio.
        var mensaje = "";    // Mensaje de error, si lo hay.

        // Usamos una estructura 'switch' para aplicar diferentes reglas de validación
        // dependiendo del 'id' del campo.
        switch (campo.id) {
            case 'inputName':
                // Validación del campo Nombre
                if (valor.length < 3) {
                    esValido = false;
                    mensaje = 'El nombre debe tener al menos 3 caracteres.';
                } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]{3,100}$/.test(valor)) {
                    // Esta expresión regular permite letras (incluyendo acentos y ñ), espacios, guiones y apóstrofes.
                    esValido = false;
                    mensaje = 'El nombre contiene caracteres no válidos (solo letras, espacios, guiones, apóstrofes).';
                }
                break;
            case 'inputEmail':
                // Validación del campo Email
                // Esta es una expresión regular simple para verificar el formato básico de un email.
                if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valor)) {
                    esValido = false;
                    mensaje = 'El formato del correo electrónico no es válido.';
                }
                break;
            case 'inputSubject':
                // Validación del campo Asunto
                if (valor.length < 5) {
                    esValido = false;
                    mensaje = 'El asunto debe tener al menos 5 caracteres.';
                } else if (valor.length > 250) {
                    esValido = false;
                    mensaje = 'El asunto no debe exceder los 250 caracteres.';
                }
                break;
            case 'inputMessage':
                // Validación del campo Mensaje
                if (valor.length < 10) {
                    esValido = false;
                    mensaje = 'El mensaje debe tener al menos 10 caracteres.';
                } else if (valor.length > 2000) {
                    esValido = false;
                    mensaje = 'El mensaje no debe exceder los 2000 caracteres.';
                }
                break;
            default:
                // Si el campo no tiene reglas específicas, se considera válido por defecto.
                esValido = true;
                mensaje = '';
        }

        // Una vez que tenemos el resultado de la validación, actualizamos la interfaz del campo.
        // Aquí, `elementoCampo`, `esValido` y `mensaje` se pasan como argumentos a la función
        // `actualizarInterfazCampo`.
        actualizarInterfazCampo(campo, esValido, mensaje);
        // Devolvemos si el campo es válido (true) o no (false).
        return esValido;
    }

    // --- 5. Manejar el envío del formulario ---
    // Añadimos un "escuchador" de eventos al formulario. Cuando alguien intenta enviarlo...
    if (formulario) {
        formulario.addEventListener('submit', function (evento) {
            evento.preventDefault(); // Evita que el navegador recargue la página al enviar el formulario.
            evento.stopPropagation(); // Detiene la propagación del evento a elementos padre.

            // Añade la clase 'was-validated' al formulario. Esto activa los estilos de validación de Bootstrap
            // para todos los campos, mostrando los mensajes de feedback.
            if (!formulario.classList.contains('was-validated')) {
                formulario.classList.add('was-validated');
            }

            var formularioEsValido = true; // Variable para rastrear si todo el formulario es válido.

            // Recorremos todos los campos del formulario.
            for (var i = 0; i < camposFormulario.length; i++) {
                var campo = camposFormulario[i];

                // Validamos cada campo usando nuestra función `validarCampoIndividual`.
                var campoEsValido = validarCampoIndividual(campo);

                // Si algún campo no es válido, marcamos que el formulario completo no lo es.
                if (!campoEsValido) {
                    formularioEsValido = false;
                }

                // Además de nuestra validación personalizada, comprobamos la validación nativa de HTML5.
                // Esto es importante para el atributo 'required' en campos vacíos, por ejemplo.
                // Si un campo no es válido por la validación nativa Y está vacío, lo marcamos como inválido.
                if (!campo.checkValidity() && campo.value.trim() === '') {
                    campo.classList.add('is-invalid'); // Añade la clase de Bootstrap para indicar error.
                    campo.setAttribute('aria-invalid', 'true'); // Para accesibilidad.
                    formularioEsValido = false; // El formulario no es válido.
                    // Oculta el mensaje de "¡Se ve bien!" si el campo está vacío y es requerido.
                    var validFeedbackDiv = campo.parentElement.querySelector('.valid-feedback');
                    if (validFeedbackDiv) {
                        validFeedbackDiv.style.display = 'none';
                    }
                }
            }

            // Si el formulario completo es válido (todos los campos pasaron la validación):
            if (formularioEsValido) {
                // Llamamos a la función para simular el envío de datos.
                enviarFormulario();
            } else {
                // Si hay errores, mostramos un mensaje de error global en el formulario.
                mostrarRetroalimentacion('error', 'Por favor, corrige los errores en los campos marcados.');
                // Nos aseguramos de que el botón "Enviar Otro Mensaje" esté oculto.
                botonEnviarOtro.style.display = 'none';
            }
        }, false);
    }

    // --- 6. Simulación del envío de datos (No es un envío real a un servidor) ---
    // Esta función simula lo que sucedería si enviaras el formulario a un servidor.
    function enviarFormulario() {
        // Se crean nuevas variables (`nombre`, `email`, `asunto`, `mensaje`) para almacenar los valores limpios (sin espacios al inicio/fin)
        // de los campos del formulario. Esto es una buena práctica para asegurar que los datos que se "envían"
        // estén estandarizados.
        var nombre = campoNombre.value.trim();
        var email = campoEmail.value.trim();
        var asunto = campoAsunto.value.trim();
        var mensaje = campoMensaje.value.trim();

        // Creamos un objeto con los datos del formulario.
        var datosFormulario = {
            nombre: nombre,
            email: email,
            asunto: asunto,
            mensaje: mensaje,
            fechaEnvio: new Date().toISOString() // Añadimos la fecha actual de "envío".
        };

        // Cambiamos el texto del botón y lo deshabilitamos para indicar que se está procesando.
        botonEnviarPrincipal.textContent = 'Enviando...';
        botonEnviarPrincipal.disabled = true;

        // --- Simulación de una respuesta del servidor (No estrictamente necesario para la validación) ---
        // Usamos `setTimeout` para simular un tiempo de espera, como si los datos se estuvieran enviando
        // a un servidor real y este tardara en responder.
        setTimeout(function () {
            // En un escenario real, aquí harías una petición a tu servidor (por ejemplo, con `fetch` o `XMLHttpRequest`).
            // `console.log` solo muestra los datos en la consola del navegador.
            console.log('Datos del formulario (SIMULADOS):', datosFormulario);

            // Una vez que la "respuesta" llega, mostramos el mensaje de éxito.
            mostrarRetroalimentacion('success', '¡Mensaje enviado correctamente! Gracias por contactarnos. Puedes enviar otro mensaje si lo deseas.');

            // Deshabilitamos todos los campos del formulario para que el usuario no pueda editarlos después del envío.
            camposFormulario.forEach(campo => {
                campo.disabled = true;
            });

            // Ocultamos el botón principal de "Enviar Mensaje".
            botonEnviarPrincipal.style.display = 'none';
            // Mostramos el botón para "Enviar Otro Mensaje".
            botonEnviarOtro.style.display = 'block';

        }, 2000); // La simulación tarda 2 segundos.
    }

    // --- 7. Función para limpiar y resetear el formulario ---
    // Esta función devuelve el formulario a su estado inicial, listo para un nuevo envío.
    function limpiarFormulario() {
        // Resetea los valores de los campos a vacío.
        campoNombre.value = '';
        campoEmail.value = '';
        campoAsunto.value = '';
        campoMensaje.value = '';

        // Recorremos todos los campos para limpiar sus estilos de validación.
        for (var i = 0; i < camposFormulario.length; i++) {
            var campo = camposFormulario[i];
            campo.classList.remove('is-valid', 'is-invalid'); // Elimina las clases de Bootstrap.
            campo.removeAttribute('aria-invalid');            // Quita el atributo de accesibilidad.

            // Selecciona y limpia los mensajes de feedback específicos de cada campo.
            var elementoRetroalimentacionInvalid = document.getElementById(campo.id + 'Feedback');
            var elementoRetroalimentacionValid = campo.parentElement.querySelector('.valid-feedback');

            if (elementoRetroalimentacionInvalid) {
                elementoRetroalimentacionInvalid.textContent = '';
                elementoRetroalimentacionInvalid.style.display = ''; // Restaura el display por defecto.
            }
            if (elementoRetroalimentacionValid) {
                elementoRetroalimentacionValid.style.display = ''; // Restaura el display por defecto.
            }
            campo.disabled = false; // Re-habilita el campo.
        }

        // Quita la clase 'was-validated' del formulario para resetear la validación visual general.
        formulario.classList.remove('was-validated');
        // Oculta el mensaje de feedback global y limpia sus estilos.
        retroalimentacionFormulario.style.display = 'none';
        retroalimentacionFormulario.classList.remove('success', 'error');

        // Restablece el botón de envío principal.
        botonEnviarPrincipal.textContent = 'Enviar Mensaje';
        botonEnviarPrincipal.disabled = false;
        botonEnviarPrincipal.style.display = 'block';

        // Oculta el botón "Enviar Otro Mensaje".
        botonEnviarOtro.style.display = 'none';
    }

    // --- 8. Configurar la validación en tiempo real (al escribir o salir de un campo) ---
    // Recorremos todos los campos del formulario para añadirles escuchadores de eventos.
    for (var i = 0; i < camposFormulario.length; i++) {
        var campo = camposFormulario[i];

        // Evento 'input': se dispara cada vez que el usuario escribe algo en el campo.
        campo.addEventListener('input', function () {
            // Solo validamos mientras se escribe si el formulario ya ha sido marcado como 'was-validated'
            // (es decir, el usuario ya intentó enviar o salió de un campo antes).
            if (formulario.classList.contains('was-validated')) {
                // Llamamos a `validarCampoIndividual` para validar el campo actual (`this` se refiere al campo).
                validarCampoIndividual(this);
            }
        });

        // Evento 'blur': se dispara cuando el campo pierde el foco (el usuario hace clic fuera del campo).
        campo.addEventListener('blur', function () {
            // Si el formulario aún no está en modo 'was-validated', lo activamos.
            // Esto asegura que el feedback de validación aparezca inmediatamente al salir de un campo.
            if (!formulario.classList.contains('was-validated')) {
                formulario.classList.add('was-validated');
            }
            // Validamos el campo actual sin retraso.
            validarCampoIndividual(this);
        });
    }

    // --- 9. Manejar el clic en el botón "Enviar Otro Mensaje" ---
    // Cuando el usuario hace clic en este botón, llamamos a la función `limpiarFormulario`.
    botonEnviarOtro.addEventListener('click', limpiarFormulario);
});
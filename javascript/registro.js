const form = document.getElementById("registro123");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nombre = form.nombre.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirmar = form.confirmar.value;

  if (password !== confirmar) {
    errorMsg.textContent = "Las contraseñas no coinciden.";
    return;
  }

  errorMsg.textContent = "";

  // Aquí iría la lógica para enviar los datos al servidor
  alert("¡Registro exitoso!\nUsuario: " + nombre + "\nEmail: " + email);

  // Limpiar el formulario
  form.reset();
  
});

document.addEventListener('DOMContentLoaded', function () {

  // Paso 1: Selección de elementos
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const btnRegistrar = document.getElementById('btnRegistrar');
  const formRegistro = document.getElementById('registro123');

  // Paso 2: Expresión regular para email
  const emailRegex = /^\S+@\S+\.\S+$/;


  function validarEmail(email) {
    if (!emailRegex.test(email)) {
      document.getElementById('errorEmail').textContent = 'Formato de email inválido';
      emailInput.classList.remove('is-valid');
      emailInput.classList.add('is-invalid');
      return false;
    }
    document.getElementById('errorEmail').textContent = '';
    emailInput.classList.remove('is-invalid');
    emailInput.classList.add('is-valid');
    return true;
  }

  // Paso 3: Validación de contraseña

  function validarPassword(password) {
    let errores = [];

    if (password.length < 8) {
      errores.push('Mínimo 8 caracteres');
    }
    if (!/\d/.test(password)) {
      errores.push('Debe contener al menos 1 número');
    }
    if (!/[A-Z]/.test(password)) {
      errores.push('Debe contener al menos 1 mayúscula');
    }

    if (errores.length > 0) {
      document.getElementById('errorPassword').textContent = errores.join(', ');
      passwordInput.classList.add('is-invalid');
      return false;
    }

    document.getElementById('errorPassword').textContent = '';
    passwordInput.classList.remove('is-invalid');
    passwordInput.classList.add('is-valid');
    return true;
  }

  // Paso 4: Habilitar botón

  function actualizarBoton() {
    const emailValido = emailInput.classList.contains('is-valid');
    const passwordValido = passwordInput.classList.contains('is-valid');
    let btnRegistrar = document.getElementById("btnRegistrar");

    if (btnRegistrar) {
      (emailValido && passwordValido);
    }


  }
  /**
   * TODO
   * Añadir explicación detallada de condicional, negación y &&
  */

  emailInput.addEventListener('input', () => {
    validarEmail(emailInput.value);
    actualizarBoton();
  });

  passwordInput.addEventListener('input', () => {
    validarPassword(passwordInput.value);
    actualizarBoton();
  });

  // Paso 5: Manejar envío

  formRegistro.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nombre = document.getElementById('nombre').value // Obtiene el nombre
    const email = document.getElementById('email').value // Obtiene el email
    if (nombre) {
      // Redirige a la página de bienvenida con el nombre y el email como parámetro
      return window.location.href = `prueba2.html?nombre=${encodeURIComponent(nombre)}&email=${encodeURIComponent(email)}`;

    }
    return alert("Por favor, introduce tu nombre.");

  });
});

/**
 * @function inicializarAplicacion
 * @description esto va al examen bro
 */


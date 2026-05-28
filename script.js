// Script básico para SaludPlus
document.addEventListener('DOMContentLoaded', () => {
  // Año en footer
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Toggle navegación mobile
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      primaryNav.dataset.open = String(!open);
    });
  }

  // Form submit (turnos page)
  const form = document.getElementById('form-turno');
  const status = form?.querySelector('.form-status');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        if (status) status.textContent = 'Por favor completa los campos requeridos.';
        return;
      }
      if (status) status.textContent = 'Enviando solicitud...';
      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());
      // Aquí iría la llamada real a la API
      setTimeout(() => {
        if (status) status.textContent = 'Solicitud enviada. Nos comunicaremos pronto.';
        form.reset();
        console.log('Turno solicitado:', payload);
      }, 900);
    });
  }
});
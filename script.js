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

  // Form submit (turnos page) — validación avanzada y toasts
  const form = document.getElementById('form-turno');
  const status = form?.querySelector('.form-status');

  function createToast(message, type = 'success', timeout = 3500){
    let container = document.querySelector('.toast-container');
    if(!container){
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast--${type} toast-show`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(()=>{ toast.classList.remove('toast-show'); toast.classList.add('toast-hide'); }, timeout);
    setTimeout(()=>{ toast.remove(); if(!container.children.length) container.remove(); }, timeout + 300);
  }

  function clearFieldErrors(formEl){
    formEl.querySelectorAll('.field-error').forEach(n => n.remove());
    formEl.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
  }

  function showFieldError(field, message){
    field.setAttribute('aria-invalid','true');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = message;
    // remove existing
    const next = field.nextElementSibling;
    if(next && next.classList && next.classList.contains('field-error')) next.remove();
    field.insertAdjacentElement('afterend', err);
  }

  function validateForm(formEl){
    clearFieldErrors(formEl);
    const data = new FormData(formEl);
    const errors = [];
    const nombre = data.get('nombre')?.toString().trim() || '';
    const telefono = data.get('telefono')?.toString().trim() || '';
    const email = data.get('email')?.toString().trim() || '';
    const especialidad = data.get('especialidad')?.toString().trim() || '';
    const fecha = data.get('fecha')?.toString().trim() || '';
    const hora = data.get('hora')?.toString().trim() || '';

    if(nombre.length < 3) { errors.push('nombre'); showFieldError(formEl.querySelector('[name="nombre"]'), 'Ingresa al menos 3 caracteres.'); }
    const phoneClean = telefono.replace(/[^0-9+]/g,'');
    if(phoneClean.length < 7) { errors.push('telefono'); showFieldError(formEl.querySelector('[name="telefono"]'), 'Ingrese un teléfono válido.'); }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRe.test(email)) { errors.push('email'); showFieldError(formEl.querySelector('[name="email"]'), 'Ingresa un email válido.'); }
    if(!especialidad) { errors.push('especialidad'); showFieldError(formEl.querySelector('[name="especialidad"]'), 'Seleccione una especialidad.'); }
    if(fecha){
      const selected = new Date(fecha);
      const today = new Date(); today.setHours(0,0,0,0);
      if(selected < today){ errors.push('fecha'); showFieldError(formEl.querySelector('[name="fecha"]'), 'La fecha no puede ser anterior a hoy.'); }
    } else { errors.push('fecha'); showFieldError(formEl.querySelector('[name="fecha"]'), 'Seleccione una fecha.'); }
    if(!hora){ errors.push('hora'); showFieldError(formEl.querySelector('[name="hora"]'), 'Seleccione una hora.'); }

    return { ok: errors.length === 0, data: Object.fromEntries(data.entries()) };
  }

  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const result = validateForm(form);
      if(!result.ok){
        if(status) status.textContent = 'Corrige los errores del formulario.';
        createToast('Corrige los errores del formulario.', 'error');
        return;
      }
      if(status) status.textContent = 'Enviando solicitud...';
      if(submitBtn) submitBtn.disabled = true;
      createToast('Enviando solicitud...', 'success');
      // Simular envío
      setTimeout(()=>{
        if(status) status.textContent = '';
        createToast('Solicitud enviada. Nos comunicaremos pronto.', 'success');
        form.reset();
        if(submitBtn) submitBtn.disabled = false;
        console.log('Turno solicitado:', result.data);
      }, 1000);
    });
  }
});
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

  // Modal de turnos
  const modal = document.getElementById('modal-turno');
  const openBtns = [document.getElementById('open-turno'), document.getElementById('hero-turno')];
  const closeBtn = modal?.querySelector('.modal-close');
  const cancelBtn = document.getElementById('cancel-turno');
  const form = document.getElementById('form-turno');
  const status = modal?.querySelector('.form-status');

  function openModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input,select,textarea,button');
    if(firstInput) firstInput.focus();
  }
  function closeModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn=>{ if(btn) btn.addEventListener('click', (e)=>{ e.preventDefault(); openModal(); }) });
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Cerrar con Escape
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });

  // Form submit (simulado)
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      if(!form.checkValidity()){
        status.textContent = 'Por favor completa los campos requeridos.';
        return;
      }
      status.textContent = 'Enviando solicitud...';
      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());
      // Simular envío
      setTimeout(()=>{
        status.textContent = 'Solicitud enviada. Nos comunicaremos pronto.';
        form.reset();
        setTimeout(closeModal,1200);
        console.log('Turno solicitado:', payload);
      },900);
    });
  }
});
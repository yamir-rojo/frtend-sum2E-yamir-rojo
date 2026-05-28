// Validaciones para el formulario de turnos
(function(window){
  const nameRe = /^[A-Za-zÀ-ÖØ-öø-ÿÑñ\s]+$/u;
  const dniRe = /^\d{7,8}$/;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[0-9+\-\s()]+$/;

  // Objeto de médicos por especialidad (requerido)
  const medicosPorEspecialidad = {
    "Clinica General": ["Dr. Gomez, Carlos", "Dra. Lopez, Maria"],
    "Cardiologia": ["Dr. Perez, Juan", "Dra. Torres, Ana"],
    "Pediatria": ["Dra. Diaz, Laura", "Dr. Soto, Pablo"],
    "Ginecologia": ["Dra. Romero, Valeria", "Dra. Castro, Elena"],
    "Traumatologia": ["Dr. Ramos, Sergio", "Dr. Herrera, Diego"],
    "Neurologia": ["Dr. Molina, Andres", "Dra. Vargas, Cecilia"]
  };

  function clearFieldState(form){
    form.querySelectorAll('.campo-error, .campo-ok').forEach(el=>{
      el.classList.remove('campo-error','campo-ok');
    });
    form.querySelectorAll('.mensaje-error').forEach(n=>n.remove());
  }

  function setFieldError(field, message){
    field.classList.remove('campo-ok');
    field.classList.add('campo-error');
    const err = document.createElement('span');
    err.className = 'mensaje-error';
    err.textContent = message;
    // insert after field
    const next = field.nextElementSibling;
    if(next && next.classList && next.classList.contains('mensaje-error')) next.remove();
    field.insertAdjacentElement('afterend', err);
  }

  function setFieldOk(field){
    field.classList.remove('campo-error');
    field.classList.add('campo-ok');
    const next = field.nextElementSibling;
    if(next && next.classList && next.classList.contains('mensaje-error')) next.remove();
  }

  function validarFechaNacimiento(value){
    if(!value) return {ok:false,msg:'Fecha de nacimiento requerida.'};
    const d = new Date(value);
    const now = new Date();
    if(isNaN(d)) return {ok:false,msg:'Fecha inválida.'};
    if(d > now) return {ok:false,msg:'La fecha no puede ser futura.'};
    const age = Math.floor((now - d) / (365.25*24*60*60*1000));
    if(age < 0 || age > 120) return {ok:false,msg:'Edad fuera de rango (0-120).'};
    return {ok:true};
  }

  function validarFechaTurno(value){
    if(!value) return {ok:false,msg:'Fecha del turno requerida.'};
    const selected = new Date(value);
    if(isNaN(selected)) return {ok:false,msg:'Fecha inválida.'};
    const now = new Date();
    const min = new Date(now.getTime() + 24*60*60*1000);
    // compare date-only (ignore time) but keep 24h rule
    if(selected < min) return {ok:false,msg:'La fecha debe tener al menos 24 horas de anticipación.'};
    const day = selected.getDay(); // 0 Domingo, 6 Sabado
    if(day === 0 || day === 6) return {ok:false,msg:'La fecha debe ser un día hábil (Lun-Vie).'};
    return {ok:true};
  }

  function validarHoraTurno(value){
    if(!value) return {ok:false,msg:'Hora del turno requerida.'};
    // value format HH:MM
    const [hh,mm] = value.split(':').map(Number);
    if(isNaN(hh) || isNaN(mm)) return {ok:false,msg:'Hora inválida.'};
    const minutes = hh*60 + mm;
    const start = 8*60; const end = 20*60; // 08:00 - 20:00
    if(minutes < start || minutes > end) return {ok:false,msg:'La hora debe estar entre 08:00 y 20:00.'};
    return {ok:true};
  }

  function validateForm(form){
    clearFieldState(form);
    const data = new FormData(form);
    let ok = true;
    let firstInvalid = null;

    // Nombre
    const nombre = (data.get('nombre')||'').toString().trim();
    const apellido = (data.get('apellido')||'').toString().trim();
    if(!nombre || !nameRe.test(nombre)) { setFieldError(form.querySelector('[name="nombre"]'), 'Nombre inválido (solo letras y espacios).'); ok = false; } else setFieldOk(form.querySelector('[name="nombre"]'));
    if(!apellido || !nameRe.test(apellido)) { setFieldError(form.querySelector('[name="apellido"]'), 'Apellido inválido (solo letras y espacios).'); ok = false; } else setFieldOk(form.querySelector('[name="apellido"]'));

    // DNI
    const dni = (data.get('dni')||'').toString().trim();
    if(!dniRe.test(dni)) { setFieldError(form.querySelector('[name="dni"]'), 'DNI inválido (7-8 dígitos).'); ok = false; } else setFieldOk(form.querySelector('[name="dni"]'));

    // Email
    const email = (data.get('email')||'').toString().trim();
    if(!emailRe.test(email)) { setFieldError(form.querySelector('[name="email"]'), 'Email inválido.'); ok = false; } else setFieldOk(form.querySelector('[name="email"]'));

    // Telefono
    const telefono = (data.get('telefono')||'').toString().trim();
    const phoneDigits = telefono.replace(/[^0-9]/g,'');
    if(!phoneRe.test(telefono) || phoneDigits.length < 8) { setFieldError(form.querySelector('[name="telefono"]'), 'Teléfono inválido.'); ok = false; } else setFieldOk(form.querySelector('[name="telefono"]'));

    // Fecha de nacimiento
    const nacimiento = (data.get('nacimiento')||'').toString().trim();
    const fn = validarFechaNacimiento(nacimiento);
    if(!fn.ok){ setFieldError(form.querySelector('[name="nacimiento"]'), fn.msg); ok = false; } else setFieldOk(form.querySelector('[name="nacimiento"]'));

    // Seccion 2: especialidad
    const especialidad = (data.get('especialidad')||'').toString().trim();
    if(!especialidad){ setFieldError(form.querySelector('[name="especialidad"]'), 'Seleccione una especialidad.'); ok = false; } else setFieldOk(form.querySelector('[name="especialidad"]'));

    // medico
    const medico = (data.get('medico')||'').toString().trim();
    if(!medico){ setFieldError(form.querySelector('[name="medico"]'), 'Seleccione un médico.'); ok = false; } else setFieldOk(form.querySelector('[name="medico"]'));

    // tipo consulta
    const tipo = (data.get('tipo_consulta')||'').toString().trim();
    if(!tipo){ setFieldError(form.querySelector('[name="tipo_consulta"]'), 'Seleccione tipo de consulta.'); ok = false; } else setFieldOk(form.querySelector('[name="tipo_consulta"]'));

    // fecha turno
    const fecha_turno = (data.get('fecha_turno')||'').toString().trim();
    const vf = validarFechaTurno(fecha_turno);
    if(!vf.ok){ setFieldError(form.querySelector('[name="fecha_turno"]'), vf.msg); ok = false; } else setFieldOk(form.querySelector('[name="fecha_turno"]'));

    // hora turno
    const hora_turno = (data.get('hora_turno')||'').toString().trim();
    const vh = validarHoraTurno(hora_turno);
    if(!vh.ok){ setFieldError(form.querySelector('[name="hora_turno"]'), vh.msg); ok = false; } else setFieldOk(form.querySelector('[name="hora_turno"]'));

    // modalidad
    const modalidad = (data.get('modalidad')||'').toString().trim();
    if(!modalidad){ setFieldError(form.querySelector('[name="modalidad"]'), 'Seleccione modalidad.'); ok = false; } else setFieldOk(form.querySelector('[name="modalidad"]'));

    // plataforma si videoconsulta
    if(modalidad === 'Videoconsulta'){
      const plataforma = (data.get('plataforma')||'').toString().trim();
      if(!plataforma){ setFieldError(form.querySelector('[name="plataforma"]'), 'Seleccione plataforma.'); ok = false; } else setFieldOk(form.querySelector('[name="plataforma"]'));
    }

    // Seccion 3 - Cobertura
    const cobertura = (data.get('cobertura')||'').toString().trim();
    const numero_credencial = (data.get('numero_credencial')||'').toString().trim();
    const plan = (data.get('plan')||'').toString().trim();
    if(!cobertura){ setFieldError(form.querySelector('[name="cobertura"]'), 'Seleccione cobertura.'); ok = false; } else setFieldOk(form.querySelector('[name="cobertura"]'));
    if(cobertura && cobertura.toLowerCase() !== 'particular'){
      if(!numero_credencial || numero_credencial.length < 5 || !/^[a-zA-Z0-9]+$/.test(numero_credencial)){
        setFieldError(form.querySelector('[name="numero_credencial"]'), 'Número de credencial inválido (mínimo 5 caracteres alfanuméricos).'); ok = false;
      } else setFieldOk(form.querySelector('[name="numero_credencial"]'));
      if(!plan){ setFieldError(form.querySelector('[name="plan"]'), 'Ingrese el plan.'); ok = false; } else setFieldOk(form.querySelector('[name="plan"]'));
    }

    // Seccion 4 - Información adicional
    const primera_visita = form.querySelector('[name="primera_visita"]')?.checked;
    const como_nos_conocio = (data.get('como_nos_conocio')||'').toString().trim();
    const motivo = (data.get('motivo')||'').toString().trim();
    const estudios_previos = form.querySelector('[name="estudios_previos"]')?.checked;
    const descripcion_estudios = (data.get('descripcion_estudios')||'').toString().trim();

    if(primera_visita){ if(!como_nos_conocio){ setFieldError(form.querySelector('[name="como_nos_conocio"]'), 'Por favor indique cómo nos conoció.'); ok = false; } else setFieldOk(form.querySelector('[name="como_nos_conocio"]')); }

    if(!motivo){ setFieldError(form.querySelector('[name="motivo"]'), 'El motivo de consulta es obligatorio.'); ok = false; } else setFieldOk(form.querySelector('[name="motivo"]'));

    if(estudios_previos){ if(!descripcion_estudios || descripcion_estudios.length < 20){ setFieldError(form.querySelector('[name="descripcion_estudios"]'), 'La descripción de estudios debe tener al menos 20 caracteres.'); ok = false; } else setFieldOk(form.querySelector('[name="descripcion_estudios"]')); }

    // find first invalid element (element with campo-error)
    const firstErr = form.querySelector('.campo-error');
    if(!ok && firstErr){ firstErr.scrollIntoView({behavior:'smooth', block:'center'}); }

    if(ok){
      // generar numero de turno
      const num = Math.floor(Math.random()*90000)+10000; // 5 dígitos
      const turno = `TURN-${num}`;
      // mostrar confirmación en pantalla
      let container = document.getElementById('confirmacion-turno');
      if(!container){
        container = document.createElement('div');
        container.id = 'confirmacion-turno';
        container.style.margin = '1rem 0';
        container.style.padding = '1rem';
        container.style.border = '2px solid var(--primary)';
        container.style.borderRadius = '10px';
        container.style.background = 'linear-gradient(90deg, rgba(11,116,218,0.04), rgba(11,116,218,0.02))';
        const main = document.querySelector('main.container') || document.body;
        main.insertBefore(container, main.firstChild);
      }
      const nombrePaciente = `${data.get('nombre') || ''} ${data.get('apellido') || ''}`.trim();
      container.innerHTML = `<strong>Turno reservado: ${turno}</strong><p>Paciente: ${nombrePaciente}</p><p>Especialidad: ${data.get('especialidad') || ''}</p><p>Fecha: ${data.get('fecha_turno') || ''} · Hora: ${data.get('hora_turno') || ''}</p>`;
      // marcar campos ok
      form.querySelectorAll('input,select,textarea').forEach(el=>{ el.classList.remove('campo-error'); el.classList.add('campo-ok'); });
      // reset form
      form.reset();
      return { ok:true, data: Object.fromEntries(data.entries()), turno };
    }

    return { ok, data: Object.fromEntries(data.entries()) };
  }

  window.Validaciones = { validateForm };

})(window);

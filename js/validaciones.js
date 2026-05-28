// Validaciones para el formulario de turnos
(function(window){
  const nameRe = /^[A-Za-zÀ-ÖØ-öø-ÿÑñ\s]+$/u;
  const dniRe = /^\d{7,8}$/;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[0-9+\-\s()]+$/;

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

    return { ok, data: Object.fromEntries(data.entries()) };
  }

  window.Validaciones = { validateForm };

})(window);

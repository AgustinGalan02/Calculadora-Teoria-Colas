"use strict";


// Cambia el modelo que se está visualizando
function selectModel(model) {
    // ocultar modulo de calculadora
    document.querySelectorAll('.calculator-section').forEach(section => {
        section.classList.remove('active');
    });

    // cambia el boton activo
    document.querySelectorAll('.model-btn').forEach(section => {
        section.classList.remove('active');
    });

    //selecciona el modelo
    document.getElementById(model).classList.add('active');

    //mantiene la seleccion del modelo
    event.target.classList.add('active');
}

//funcion para mostrar mensajes de error
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="error">${message}</div>`;
    container.style.display = 'block';
}

//funcion para mostrar resultados
function showResults(containerId, results) {
    const container = document.getElementById(containerId);
    let html = '<h3>Resultados del Cálculo</h3><div class="results-grid">';

    for (const [key, value] of Object.entries(results)) {
        html += `
            <div class="result-item">
                <h4>${key}</h4>
                <div class="result-value">${typeof value === 'number' ? value.toFixed(2) : value}</div>
            </div>
            `;
    }

    html += '</div';
    container.innerHTML = html;
    container.style.display = 'block';
}

// M/M/1

function calculateMM1() {
    const lambda = parseFloat(document.getElementById('lambda_mm1').value);
    const mu = parseFloat(document.getElementById('mu_mm1').value);

    //validar inputs
    if (isNaN(lambda) || isNaN(mu) || lambda <= 0 || mu <= 0) {
        showError('results_mm1', 'Ingresar valores mayores a 0 para λ y μ');
        return;
    }

    // validar que el sistema sea estable
    if (lambda >= mu) {
        showError('results_mm1', 'Recorda que para que el sistema sea estable, <b>λ</b> debe ser menor que <b>μ</b>');
        return
    }

    // formulas m/m/1
    const rho = lambda / mu;
    const p0 = 1 - rho;
   // const pn = (1 - lambda / mu) - (lambda / mu) ** 2;
    const ls = lambda / (mu - lambda);
    const ws = 1 / (mu - lambda);
    const lq = (lambda ** 2) / (mu * (mu - lambda));
    const wq = lambda / (mu * (mu - lambda));

    const results = {
        'Utilización del Sistema (ρ)': rho,
        'Probabilidad de que el sistema esté vacío (P₀)': `${p0.toFixed(4)} (${(p0 * 100).toFixed(2)}%)`,
        'Número promedio de clientes en el sistema (Ls)': ls,
        'Tiempo promedio que un cliente pasa en el sistema (Ws)': `${ws.toFixed(4)} horas (${(ws * 60).toFixed(2)} minutos)`,
        'Cantidad de clientes en la cola (Lq)': lq,
        'Tiempo promedio de espera de un cliente (Wq)': `${wq.toFixed(4)} horas (${(wq * 60).toFixed(2)} minutos)`
        //[`Probabilidad de que haya ${lambda} clientes en el sistema`]: `${pn.toFixed(4)} (${(pn * 100).toFixed(2)}%)`
    };

    showResults('results_mm1', results);
}


// M/M/1/N

function calculateMM1N() {
    const lambda = parseFloat(document.getElementById('lambda_mm1n').value);
    const mu = parseFloat(document.getElementById('mu_mm1n').value);
    const n = parseFloat(document.getElementById('n_mm1n').value);

    if (isNaN(lambda) || isNaN(mu) || isNaN(n) || lambda <= 0 || mu <= 0 || n <= 0) {
        showError('results_mm1n', 'Ingresá valores válidos para λ, μ y N (mayores a 0)');
        return;
    }

    //formulas basicas

    const rho = lambda / mu;
    const p0 = (1 - rho) / (1 - Math.pow(rho, n + 1)); 
    const pn = Math.pow(rho, n) * p0;
    const lambda_efectiva = lambda * (1 - pn);
    const rho_efectiva = lambda_efectiva / mu;
    const rendimiento_salida = mu - (mu * p0);

    // formulas dependiendo si p es igual o no a 1

    // LS
    let ls;
    if (rho === 1) {
        ls = n / 2;
    } else {
        ls = (rho / (1 - rho)) - ((n + 1) * Math.pow(rho, n + 1)) / (1 - Math.pow(rho, n + 1));
    }

    // LQ
    let lq;
    if (rho === 1) {
        lq = ls - (1 - Math.pow(rho, n)) / (1 - Math.pow(rho, n + 1));
    } else {
        lq = (n * (n - 1)) / (2 * (n + 1));
    }

    // WS Y WQ
    const ws = ls / lambda_efectiva;
    const wq = lq / lambda_efectiva;

    // Pb y Z
    const pb = Math.pow(rho, n) * (1 - rho) / (1 - Math.pow(rho, n + 1));
    const z = lambda * pb;

    //rendimiento de entrada
    const rendimiento_entrada = lambda - z;

    // validacion para que si hay un resultado invalido se muestre error en vez de calcular
    const valuesToCheck = [rho, p0, pn, lambda_efectiva, rho_efectiva, ls, lq, ws, wq, pb, z];

    const hasInvalid = valuesToCheck.some(value => !isFinite(value) || isNaN(value));

    if (hasInvalid) {
    showError('results_mm1n', 'Los cálculos no se pueden realizar con estos valores. Tus resultados van a ser inválidos. Reducí λ o aumentá μ');
    return;
    }

    const results = {
        'Utilización del Sistema (ρ)': `${rho.toFixed(4)} (${(rho * 100).toFixed(2)}%)`,
        'Utilización efectiva del sistema (λ̄ )': rho_efectiva.toFixed(4),
        'Probabilidad de que el sistema esté lleno (Pn)': `${pn.toFixed(4)} (${(pn * 100).toFixed(2)}%)`,
        'Probabilidad de que el sistema esté vacío (P0)': `${p0.toFixed(4)} (${(p0 * 100).toFixed(2)}%)`,
        'Tasa de llegada efectiva (λ̄)': lambda_efectiva.toFixed(4),
        'Número promedio de clientes en el sistema (Ls)': ls.toFixed(4),
        'Número promedio de clientes en cola (Lq)': lq.toFixed(4),
        'Tiempo promedio en el sistema (Ws)': `${ws.toFixed(4)} horas (${(ws * 60).toFixed(2)} min)`,
        'Tiempo promedio en cola (Wq)': `${wq.toFixed(4)} horas (${(wq * 60).toFixed(2)} min)`,
        'Probabilidad de bloqueo (Pb)': `${pb.toFixed(4)} (${(pb * 100).toFixed(2)}%)`,
        'Tasa de rechazo (Z)': z.toFixed(4),
        'Rendimiento de salida': rendimiento_salida.toFixed(4),
        'Rendimiento de entrada': rendimiento_entrada.toFixed(4)
        
    };

    showResults('results_mm1n', results);
};

// M/M/2
function calculateMM2() {
    const lambda = parseFloat(document.getElementById('lambda_mm2').value);
    const mu1 = parseFloat(document.getElementById('mu_mm21').value);
    const mu2 = parseFloat(document.getElementById('mu_mm22').value);
    const tipomm2 = document.getElementById('mm2_type').value;
    
        // Validación
    if (isNaN(lambda) || isNaN(lambda) || isNaN(mu1) || isNaN(mu2) || lambda <= 0 || mu1 <= 0 || mu2 <= 0) {
        showError('results_mm2', 'Ingresá valores válidos y mayores a 0 para λ, μ1 y μ2.');
        return;
    }

    // Mu sub s. Dependiendo la velocidad de los servidores, se suma o multiplica
    let Us = mu1 == mu2 ? 2 * mu1 : mu1 + mu2;

   const ro = lambda / Us;
   const ls = (ro) / (1 - ro);
   const ws = ls / lambda;
   const lq = (ro ** 2) / (1 - ro);
   const wq = lq / lambda;

    const resultados = { ro, ls, ws, lq, wq, mu1, mu2, lambda };

    if (tipomm2 == "sin") {
        const results = calculateMM2SinSeleccion(resultados);
        return showResults('results_mm2', results);
    }
    const results = calculateMM2ConSeleccion(resultados);
    return showResults('results_mm2', results);
}

const calculateMM2SinSeleccion = (resultados) => {
    const { ro, ls, ws, lq, wq, mu1, mu2, lambda } = resultados;

    
    const a = (2 * mu1 * mu2) / (mu1 + mu2);
    const r = mu2 > mu1 ? (mu2 / mu1) : (mu1 / mu2);

    const Po = (1 - ro) / (1 - ro + lambda / a);
    const Pc = 1 - Math.sqrt((r * (1 + r)) / (1 + r ** 2));

    // const N = ((1 - p0) / p0) + ((1 - p0) * a);
    const N = lambda / ((1 - ro) * (lambda + (1-ro) * a));

    return {
        'Utilización del Sistema (ρ)': `${ro.toFixed(4)} (${(ro * 100).toFixed(2)}%)`,
        'Número promedio de clientes en el sistema (N / Ls)': ls,
        'Tiempo promedio que un cliente pasa en el sistema (Ws)': `${ws.toFixed(4)} horas (${(ws * 60).toFixed(2)} min)`,
        'Cantidad de clientes en la cola (Lq)': lq,
        'Tiempo promedio de espera de un cliente (Wq)': `${wq.toFixed(4)} horas (${(wq * 60).toFixed(2)} min)`,
        'Probabilidad de que el sistema esté vacío (P₀)': `${Po.toFixed(4)} (${(Po * 100).toFixed(2)}%)`,
        'ρ crítico (Pc)': Pc,
    }
}

const calculateMM2ConSeleccion = (resultados) => {
    const { ro, ls, ws, lq, wq, mu1, mu2, lambda } = resultados;

    const mu = mu1 + mu2;
    const r = mu2 / mu1;

    // Calcular ρc resolviendo la cuadrática
    const A = 1 + Math.pow(r, 2);
    const B = -(2 + Math.pow(r, 2));
    const C = -(2 * r - 1) * (1 + r);
    const discriminante = B * B - 4 * A * C;

    let Pc;
    if (discriminante < 0) {
        Pc = "No se pudo calcular (discriminante negativo)";
    } else {
        const sol1 = (-B + Math.sqrt(discriminante)) / (2 * A);
        const sol2 = (-B - Math.sqrt(discriminante)) / (2 * A);
        Pc = Math.max(sol1, sol2);
    }

    // Calcular a'
    const aprima = ((2 * lambda + mu) * (mu1 * mu2)) / (mu * (lambda + mu2));

    // Calcular P₀
    const Po = (1 - ro) / (1 - ro + (lambda / aprima));

    // Calcular N
    const N = lambda / ((1 - ro) * (lambda + (1 - ro) * aprima));

    return {
        'Utilización del Sistema (ρ)': `${ro.toFixed(4)} (${(ro * 100).toFixed(2)}%)`,
        'Número promedio de clientes en el sistema (Ls)': ls,
        'Tiempo promedio que un cliente pasa en el sistema (Ws)': `${ws.toFixed(4)} horas (${(ws * 60).toFixed(2)} min)`,
        'Cantidad de clientes en la cola (Lq)': lq,
        'Tiempo promedio de espera de un cliente (Wq)': `${wq.toFixed(4)} horas (${(wq * 60).toFixed(2)} min)`,
        'Probabilidad de que el sistema esté vacío (P₀)': `${Po.toFixed(4)} (${(Po * 100).toFixed(2)}%)`,
        'ρ crítico (Pc)': Pc,
        'Número promedio de clientes en el sistema (N)': N
    };
};




// M/G/1
function calculateMG1() {
    const lambda = parseFloat(document.getElementById('lambda_mg1').value);
    const es = parseFloat(document.getElementById('es_mg1').value);
    const varianza = parseFloat(document.getElementById('sigma_mg1').value);

    // Validación
    if (isNaN(lambda) || isNaN(es) || isNaN(varianza) || lambda <= 0 || es <= 0 || varianza <= 0) {
        showError('results_mg1', 'Ingresá valores válidos y mayores a 0 para λ, E(s) y la varianza.');
        return;
    }

    const mu = 1 / es;
    const rho = lambda * es;

    if (rho >= 1) {
        showError('results_mg1', 'Para que el sistema sea estable, λ × E(s) debe ser menor a 1.');
        return;
    }

    // Cálculos según fórmula del apunte
    const en = (rho / (1 - rho)) * (1 - (rho / 2) * (1 - mu ** 2 * varianza ** 2));
    const et = (1 / (mu * (1 - rho))) * (1 - (rho / 2) * (1 - mu ** 2 * varianza ** 2));

    const results = {
        'Utilización del Sistema (ρ)': `${rho.toFixed(2)} (${(rho * 100).toFixed(2)}%)`,
        'Clientes promedio en el sistema (E(n))': en.toFixed(2),
        'Tiempo promedio en el sistema (E(T))': `${et.toFixed(2)} horas (${(et * 60).toFixed(1)} min)`,
        'Mu (1/E(s))': `${mu.toFixed(2)}`
    };

    showResults('results_mg1', results);
}


// M/D/1
function calculateMD1() {
  const lambda = parseFloat(document.getElementById('lambda_md1').value);
  const mu     = parseFloat(document.getElementById('mu_md1').value);

  if (isNaN(lambda) || isNaN(mu) || lambda <= 0 || mu <= 0) {
    showError('results_md1', 'Ingresá valores mayores a 0 para λ y μ.');
    return;
  }
  if (lambda >= mu) {
    showError('results_md1', 'Para que el sistema sea estable, λ debe ser menor que μ.');
    return;
  }

  const rho = lambda / mu;

  const en = (rho / (1 - rho)) * (1 - (rho / 2));  // E(n)
  const et = en / lambda;                          // E(T)

  const results = {
    'Utilización del Sistema (ρ)': `${rho.toFixed(2)} (${(rho * 100).toFixed(2)}%)`,
    'Clientes promedio en el sistema E(n)': en.toFixed(2),
    'Tiempo promedio en el sistema E(T)': `${et.toFixed(2)} horas (${(et * 60).toFixed(1)} min)`
  };

  showResults('results_md1', results);
}


function generateMuInputs() {
    const numServers = parseInt(document.getElementById('num_servers').value);
    const container = document.getElementById('mu_inputs_container_server');
    container.innerHTML = ''; 

    for (let i = 1; i <= numServers; i++) {
        const div = document.createElement('div');
        div.className = 'form-field';
        div.innerHTML = `
            <label>Tasa de Servicio Servidor ${i} (μ${i})</label>
            <input type="number" id="mu_multiserver_${i}" min="0" placeholder="Ej: 5" />
        `;
        container.appendChild(div);
    }
}

function analyzeServer() {
    const numServers = parseInt(document.getElementById('num_servers').value);
    const lambda = parseFloat(document.getElementById('lambda_server').value);

    let totalMu = 0;
    const muValues = [];
    let allMuValid = true;

    for (let i = 1; i <= numServers; i++) {
        const muInput = document.getElementById(`mu_multiserver_${i}`);
        const mu = parseFloat(muInput.value);

        if (isNaN(mu) || mu <= 0) {
            allMuValid = false;
            break;
        }

        muValues.push(mu);
        totalMu += mu;

    }

    if (isNaN(lambda) || lambda <= 0 || !allMuValid) {
        showError('results_server', 'Ingresa un número de servidores actuales válido. También acuerdate de ingresar valores válidos y mayores a 0 para λ, y todas las μ. La Utilización actual del sistema(ρ) debe ser entre 0 y 1 (exclusivo).');
        return;
    }

    const actual_rho = lambda / totalMu;

    let recommendation = "";


    if (actual_rho >= 1) {
        recommendation = `El sistema actual (${(actual_rho * 100).toFixed(2)}%) es inestable. Es CRÍTICO agregar más servidores o mejorar los existentes.`;
    } else {
        recommendation = `La utilización actual del sistema (${(actual_rho * 100).toFixed(2)}%) es estable. NO es necesario agregar un servidor.`;
    }



    const results = {
        'Número de Servidores Actuales (c)': numServers,
        'Tasa de Llegadas (λ)': lambda,
        'Tasas de Servicio (μ_i)': muValues.map(m => m.toFixed(2)).join(', '),
        'Tasa de Servicio Total (μi)': totalMu.toFixed(2),
        'Utilización Actual del Sistema (ρ)': `${actual_rho.toFixed(2)} (${(actual_rho * 100).toFixed(2)}%)`,
        'Recomendación': recommendation
    };

    showResults('results_server', results);
}
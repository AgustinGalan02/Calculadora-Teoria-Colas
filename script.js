"use strict";

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
    const pn = (1 - lambda / mu) - (lambda / mu) ** 2;
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
        'Tiempo promedio de espera de un cliente (Wq)': `${wq.toFixed(4)} horas (${(wq * 60).toFixed(2)} minutos)`,
        [`Probabilidad de que haya ${lambda} clientes en el sistema`]: `${pn.toFixed(4)} (${(pn * 100).toFixed(2)}%)`
    };

    showResults('results_mm1', results);
}


// M/M/1/N

function calculateMM1N() {
    const lambda = parseFloat(document.getElementById('lambda_mm1n').value);
    const mu = parseFloat(document.getElementById('mu_mm1n').value);
    const n = parseFloat(document.getElementById('n_mm1n').value);

    //validar inputs
    if (isNaN(lambda) || isNaN(mu) || isNaN(n) ||lambda <= 0 || mu <= 0 || n <= 0) {
        showError('results_mm1n', 'Ingresar valores mayores a 0 para λ y μ');
        return;
    }

    // validar que el sistema sea estable
    if (lambda >= mu) {
        showError('results_mm1n', 'Recorda que para que el sistema sea estable, <b>λ</b> debe ser menor que <b>μ</b>');
        return
    }

    // formulas m/m/1
    const rho = lambda / mu;
    const p0 = 1 - rho;
    const pn = (1 - lambda / mu) - (lambda / mu) ** 2;
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
        'Tiempo promedio de espera de un cliente (Wq)': `${wq.toFixed(4)} horas (${(wq * 60).toFixed(2)} minutos)`,
        [`Probabilidad de que haya ${lambda} clientes en el sistema`]: `${pn.toFixed(4)} (${(pn * 100).toFixed(2)}%)`
    };

    showResults('results_mm1n', results);
}














// M/M/2

// M/G/1
// M/G/1 (versión solo en horas)
function calculateMG1() {
    const lambda = parseFloat(document.getElementById('lambda_mg1').value);
    const es = parseFloat(document.getElementById('es_mg1').value);
    const varianza = parseFloat(document.getElementById('sigma_mg1').value); // ya es varianza σ²

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
    const en = (rho / (1 - rho)) * (1 - (rho / 2) * (1 - mu ** 2 * varianza));
    const et = en / lambda;

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


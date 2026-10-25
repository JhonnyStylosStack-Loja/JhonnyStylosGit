// ── Dados operacionais ────────────────────────────────────────────
const ADMIN_STAFF = []

function fmt(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

function trend(v) {
  const cls = v >= 0 ? 'up' : 'down'
  return `<span class="adm-trend adm-trend--${cls}">${UIIcons.svg(v >= 0 ? 'arrowUp' : 'arrowDown')} ${Math.abs(v).toFixed(1)}%</span>`
}

function badge(status) {
  return `<span class="adm-badge adm-badge--${status.toLowerCase()}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`
}

// ── Chart: Sparkline ──────────────────────────────────────────────
function renderSparkline(values, color = '#fff') {
  const w = 68, h = 26
  const max = Math.max(...values) || 1
  const min = Math.min(...values)
  const range = max - min || 1
  const step = w / (values.length - 1)
  const pts = values.map((v, i) => `${(i * step).toFixed(1)},${(h - 2 - ((v - min) / range) * (h - 4)).toFixed(1)}`).join(' ')
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" class="adm-sparkline">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
  </svg>`
}

// ── Chart.js infrastructure ───────────────────────────────────────
let _cjsSeq = 0
const _cjsPending = []
const _cjsInst = {}

function _cjsQueue(cfg) {
  const id = `adm-cjs-${++_cjsSeq}`
  _cjsPending.push({ id, ...cfg })
  return id
}

function _cjsDestroyAll() {
  Object.values(_cjsInst).forEach(c => { try { c.destroy() } catch (e) {} })
  Object.keys(_cjsInst).forEach(k => delete _cjsInst[k])
}

function initPendingCharts() {
  if (typeof Chart === 'undefined') return
  const fmtBRL = v => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 0 })
  const tickStyle = { color: '#6b5a5f', font: { family: 'Poppins, sans-serif', size: 11 } }

  _cjsPending.splice(0).forEach(cfg => {
    const canvas = document.getElementById(cfg.id)
    if (!canvas) return
    _cjsInst[cfg.id]?.destroy()

    if (cfg.type === 'area') {
      const { values, labels, color } = cfg
      const max = Math.max(...values)
      const ctx = canvas.getContext('2d')
      const grad = ctx.createLinearGradient(0, 0, 0, 210)
      grad.addColorStop(0, color + '47')
      grad.addColorStop(1, color + '04')
      _cjsInst[cfg.id] = new Chart(canvas, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            data: values,
            borderColor: color,
            backgroundColor: grad,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointBorderWidth: 1.5,
            pointRadius: 4,
            borderWidth: 2.5,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: c => ' ' + fmtBRL(c.parsed.y) } }
          },
          scales: {
            y: { display: false, suggestedMin: 0, suggestedMax: max * 1.2 },
            x: {
              grid: { display: false },
              ticks: tickStyle,
              border: { display: false }
            }
          }
        }
      })

    } else if (cfg.type === 'bar') {
      const { values, labels } = cfg
      const max = Math.max(...values)
      _cjsInst[cfg.id] = new Chart(canvas, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: 'rgba(212,83,126,0.70)',
            borderRadius: 6,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: c => ' ' + fmtBRL(c.parsed.y) } }
          },
          scales: {
            y: {
              suggestedMin: 0,
              suggestedMax: max * 1.15,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: { ...tickStyle, callback: fmtBRL },
              border: { display: false }
            },
            x: {
              grid: { display: false },
              ticks: { ...tickStyle, font: { family: 'Poppins, sans-serif', size: 12 } },
              border: { display: false }
            }
          }
        }
      })

    } else if (cfg.type === 'dual') {
      const { v1, v2, labels } = cfg
      _cjsInst[cfg.id] = new Chart(canvas, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Receita',
              data: v1,
              borderColor: '#e8798c',
              backgroundColor: 'rgba(232,121,140,0.15)',
              fill: true,
              tension: 0.35,
              pointBackgroundColor: '#e8798c',
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5,
              pointRadius: 3,
              borderWidth: 2.5,
            },
            {
              label: 'Despesas',
              data: v2,
              borderColor: '#d97706',
              backgroundColor: 'rgba(217,119,6,0.08)',
              fill: true,
              tension: 0.35,
              borderDash: [6, 4],
              pointBackgroundColor: '#d97706',
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5,
              pointRadius: 3,
              borderWidth: 2,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: { label: c => ` ${c.dataset.label}: ${fmtBRL(c.parsed.y)}` }
            }
          },
          scales: {
            y: {
              suggestedMin: 0,
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: { ...tickStyle, callback: fmtBRL },
              border: { display: false }
            },
            x: {
              grid: { display: false },
              ticks: tickStyle,
              border: { display: false }
            }
          }
        }
      })
    }
  })
}

// ── Chart: Area ───────────────────────────────────────────────────
function renderAreaChart(values, labels, color = '#e8798c') {
  if (values.length < 2) return ''
  const id = _cjsQueue({ type: 'area', values, labels, color })
  return `<div style="position:relative;height:210px"><canvas id="${id}"></canvas></div>`
}

// ── Chart: Dual Area ──────────────────────────────────────────────
function renderDualAreaChart(v1, v2, labels) {
  const id = _cjsQueue({ type: 'dual', v1, v2, labels })
  return `<div style="position:relative;height:210px"><canvas id="${id}"></canvas></div>`
}

// ── Chart: Bar ────────────────────────────────────────────────────
function renderBarChart(values, labels) {
  const id = _cjsQueue({ type: 'bar', values, labels })
  return `<div style="position:relative;height:240px"><canvas id="${id}"></canvas></div>`
}

// ── Chart: Donut ──────────────────────────────────────────────────
function renderDonutChart(segments, size = 140, centerText = '') {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1
  const r = 46, cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  let cum = 0
  const arcs = segments.map(seg => {
    const dash = (seg.value / total) * circ
    const rot = -90 + (cum / total) * 360
    cum += seg.value
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="14"
      stroke-dasharray="${dash.toFixed(2)} ${(circ - dash).toFixed(2)}"
      transform="rotate(${rot.toFixed(2)} ${cx} ${cy})"/>`
  })
  const legend = segments.map(s => `
    <div class="adm-legend-item">
      <span class="adm-legend-dot" style="background:${s.color}"></span>
      <span class="adm-legend-lbl">${s.label}</span>
      <span class="adm-legend-val">${s.value}</span>
    </div>`).join('')
  const center = centerText ? `
    <text x="${cx}" y="${cy + 1}" text-anchor="middle" dominant-baseline="middle" class="adm-donut-center-val">${centerText}</text>
    <text x="${cx}" y="${cy + 16}" text-anchor="middle" class="adm-donut-center-lbl">total</text>` : ''
  return `<div class="adm-donut-wrap">
    <svg viewBox="0 0 ${size} ${size}" class="adm-donut-svg" width="${size}" height="${size}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ffd0d3" stroke-width="14"/>
      ${arcs.join('')}${center}
    </svg>
    <div class="adm-legend">${legend}</div>
  </div>`
}

// ── Chart: Ring ───────────────────────────────────────────────────
function renderRingChart(pct, color, label, sublabel = '', size = 96) {
  const r = 34, cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const dash = (Math.min(pct, 100) / 100) * circ
  return `<div class="adm-ring-item">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ffd0d3" stroke-width="8"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="8"
        stroke-dasharray="${dash.toFixed(2)} ${(circ - dash).toFixed(2)}"
        stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
      <text x="${cx}" y="${cy + 5}" text-anchor="middle" class="adm-ring-val">${pct}%</text>
    </svg>
    <p class="adm-ring-label">${label}</p>
    ${sublabel ? `<p class="adm-ring-sublabel">${sublabel}</p>` : ''}
  </div>`
}

// ── Section: Dashboard ────────────────────────────────────────────
async function renderDashboard(period) {
  const metrics = await CMS.getDashboardMetrics(period)
  const products = metrics.products
  const lowStock = metrics.lowStock
  const statusCounts = metrics.statusCounts
  const orderCount = metrics.orders.length
  const topProducts = products
  const donutSegments = [
    { label: 'Entregue',     value: statusCounts.delivered  || 0, color: '#16a34a' },
    { label: 'Enviado',      value: statusCounts.shipped    || 0, color: '#2563eb' },
    { label: 'Pago',         value: statusCounts.paid       || 0, color: '#7c3aed' },
    { label: 'Processando',  value: statusCounts.processing || 0, color: '#d97706' },
    { label: 'Pendente',     value: statusCounts.pending    || 0, color: '#9b3b48' },
    { label: 'Cancelado',    value: statusCounts.cancelled  || 0, color: '#9ca3af' },
    { label: 'Estornado',    value: statusCounts.refunded   || 0, color: '#64748b' },
  ]
  const entregaTaxa = orderCount ? Math.round(((statusCounts.delivered || 0) / orderCount) * 100) : 0
  const cancelTaxa = orderCount ? Math.round(((statusCounts.cancelled || 0) / orderCount) * 100) : 0
  const stockOk = metrics.activeStock ? Math.round(((metrics.activeStock - lowStock) / metrics.activeStock) * 100) : 0

  return `
  <div class="adm-kpi-grid">
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
      <div class="adm-kpi__body">
        <p class="adm-kpi__label">Receita Total</p>
        <p class="adm-kpi__value">${fmt(metrics.revenue)}</p>
        <p class="adm-kpi__sub">Pagamentos aprovados no período</p>
      </div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
      <div class="adm-kpi__body">
        <p class="adm-kpi__label">Pedidos</p>
        <p class="adm-kpi__value">${orderCount}</p>
        <p class="adm-kpi__sub">Criados no período selecionado</p>
      </div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
      <div class="adm-kpi__body">
        <p class="adm-kpi__label">Clientes Novos</p>
        <p class="adm-kpi__value">${metrics.newCustomers}</p>
        <p class="adm-kpi__sub">Cadastros de clientes no período</p>
      </div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--${lowStock > 0 ? 'warn' : '4'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
      <div class="adm-kpi__body">
        <p class="adm-kpi__label">Estoque Crítico</p>
        <p class="adm-kpi__value">${lowStock} variantes</p>
        <p class="adm-kpi__sub${lowStock > 0 ? ' adm-kpi__sub--warn' : ''}">${lowStock > 0 ? '⚠️ Reposição necessária (até 5 un.)' : 'Nenhuma variante com estoque baixo'}</p>
      </div>
    </div>
  </div>

  <div class="adm-row adm-row--wide">
    <div class="adm-card">
      <div class="adm-card__header">
        <h3 class="adm-card__title">Receita — Evolução do Período</h3>
        <span class="adm-card__subtitle">${fmt(metrics.revenue)} total</span>
      </div>
      <div class="adm-chart-wrap">${orderCount ? '<div class="cms-empty">A evolução da receita será exibida após a consolidação das vendas.</div>' : '<div class="cms-empty">Ainda não há vendas no período selecionado.</div>'}</div>
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Status dos Pedidos</h3></div>
      ${orderCount ? renderDonutChart(donutSegments, 130, orderCount.toString()) : '<div class="cms-empty">Ainda não há pedidos no período selecionado.</div>'}
    </div>
  </div>

  <div class="adm-row">
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Produtos ativos recentes</h3></div>
      <div class="adm-top-products">
        ${topProducts.map((p, i) => `
          <div class="adm-top-product">
            <span class="adm-top-product__rank">${i + 1}</span>
            <img src="${p.image}" alt="${p.name}" class="adm-top-product__img">
            <div class="adm-top-product__info">
              <p class="adm-top-product__name">${p.name}</p>
              <p class="adm-top-product__cat">${p.category}</p>
            </div>
            <div class="adm-top-product__meta">
              <p class="adm-top-product__price">${fmt(p.price)}</p>
              <p class="adm-top-product__reviews">${p.reviews} avaliações</p>
            </div>
          </div>`).join('')}
      </div>
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Indicadores de Desempenho</h3></div>
      <div class="adm-ring-group">
        ${renderRingChart(entregaTaxa, '#16a34a', 'Entregas', orderCount ? 'taxa de sucesso' : 'sem pedidos')}
        ${renderRingChart(stockOk, '#2563eb', 'Estoque OK', metrics.activeStock ? 'variantes normais' : 'sem variantes')}
        ${renderRingChart(orderCount ? 100 - cancelTaxa : 0, '#e8798c', 'Retenção', orderCount ? 'pedidos válidos' : 'sem pedidos')}
      </div>
    </div>
  </div>`
}

// ── Section: Vendas ───────────────────────────────────────────────
function renderNoData(message) {
  return `<div class="adm-card cms-empty">${message}</div>`
}

function orderStatusLabel(status) {
  return ({
    pending: 'Pendente', paid: 'Pago', processing: 'Processando',
    shipped: 'Enviado', delivered: 'Entregue', cancelled: 'Cancelado', refunded: 'Estornado'
  })[status] || status || 'Sem status'
}

async function renderVendasReal(period) {
  const metrics = await CMS.getDashboardMetrics(period)
  const paidOrders = metrics.orders.filter(order => order.payment_status === 'approved')
  const ticket = paidOrders.length ? metrics.revenue / paidOrders.length : 0
  return `
    <div class="adm-kpi-grid">
      <div class="adm-kpi"><div class="adm-kpi__body"><p class="adm-kpi__label">Receita aprovada</p><p class="adm-kpi__value">${fmt(metrics.revenue)}</p><p class="adm-kpi__sub">No período selecionado</p></div></div>
      <div class="adm-kpi"><div class="adm-kpi__body"><p class="adm-kpi__label">Pedidos</p><p class="adm-kpi__value">${metrics.orders.length}</p><p class="adm-kpi__sub">No período selecionado</p></div></div>
      <div class="adm-kpi"><div class="adm-kpi__body"><p class="adm-kpi__label">Ticket médio</p><p class="adm-kpi__value">${fmt(ticket)}</p><p class="adm-kpi__sub">Somente pagamentos aprovados</p></div></div>
      <div class="adm-kpi"><div class="adm-kpi__body"><p class="adm-kpi__label">Clientes novos</p><p class="adm-kpi__value">${metrics.newCustomers}</p><p class="adm-kpi__sub">No período selecionado</p></div></div>
    </div>
    ${metrics.orders.length ? '<div class="adm-card"><div class="adm-card__header"><h3 class="adm-card__title">Resumo de vendas</h3></div><p class="adm-muted">Os gráficos serão mostrados quando houver histórico suficiente de vendas reais.</p></div>' : renderNoData('Ainda não há vendas reais para o período selecionado.')}
  `
}

async function renderPedidosReal() {
  const { orders } = await CMS.getAdminOperations()
  if (!orders.length) return renderNoData('Nenhum pedido real foi registrado até o momento.')
  return `<div class="adm-card"><div class="adm-card__header"><h3 class="adm-card__title">Pedidos recentes</h3></div>
    <table class="adm-table"><thead><tr><th>Pedido</th><th>Data</th><th>Valor</th><th>Pagamento</th><th>Status</th></tr></thead>
    <tbody>${orders.map(order => `<tr><td class="adm-mono">${_cmsEscape(order.order_number || String(order.id).slice(0, 8))}</td><td>${new Date(order.created_at).toLocaleDateString('pt-BR')}</td><td class="adm-mono">${fmt(Number(order.total_amount || 0))}</td><td>${_cmsEscape(order.payment_status || 'Pendente')}</td><td>${badge(orderStatusLabel(order.status))}</td></tr>`).join('')}</tbody></table></div>`
}

async function renderPagamentosReal() {
  const { orders } = await CMS.getAdminOperations()
  const approved = orders.filter(order => order.payment_status === 'approved')
  const pending = orders.filter(order => order.payment_status === 'pending')
  const cancelled = orders.filter(order => ['cancelled', 'rejected', 'refunded'].includes(order.payment_status))
  const sum = list => list.reduce((total, order) => total + Number(order.total_amount || 0), 0)
  return `<div class="adm-kpi-grid">
    <div class="adm-kpi"><div class="adm-kpi__body"><p class="adm-kpi__label">Aprovados</p><p class="adm-kpi__value">${fmt(sum(approved))}</p><p class="adm-kpi__sub">${approved.length} pagamento(s)</p></div></div>
    <div class="adm-kpi"><div class="adm-kpi__body"><p class="adm-kpi__label">Pendentes</p><p class="adm-kpi__value">${fmt(sum(pending))}</p><p class="adm-kpi__sub">${pending.length} pagamento(s)</p></div></div>
    <div class="adm-kpi"><div class="adm-kpi__body"><p class="adm-kpi__label">Cancelados / estornados</p><p class="adm-kpi__value">${fmt(sum(cancelled))}</p><p class="adm-kpi__sub">${cancelled.length} pagamento(s)</p></div></div>
  </div>
  ${orders.length ? '<div class="adm-card"><p class="adm-muted">Os valores acima são calculados a partir dos pedidos reais.</p></div>' : renderNoData('Nenhum pagamento real foi registrado até o momento.')}`
}

async function renderClientesReal() {
  const { orders, customers } = await CMS.getAdminOperations()
  const customersById = new Map(customers.map(customer => [customer.id, customer]))
  const totalsByCustomer = orders.reduce((totals, order) => {
    const current = totals.get(order.user_id) || { orders: 0, total: 0 }
    current.orders++
    if (order.payment_status === 'approved') current.total += Number(order.total_amount || 0)
    totals.set(order.user_id, current)
    return totals
  }, new Map())
  const totalRevenue = [...totalsByCustomer.values()].reduce((total, item) => total + item.total, 0)
  const rows = customers.map(customer => ({ customer, ...(totalsByCustomer.get(customer.id) || { orders: 0, total: 0 }) }))
  return `<div class="adm-kpi-grid adm-kpi-grid--3">
    <div class="adm-kpi"><div class="adm-kpi__body"><p class="adm-kpi__label">Clientes cadastrados</p><p class="adm-kpi__value">${customers.length}</p><p class="adm-kpi__sub">Clientes reais na base</p></div></div>
    <div class="adm-kpi"><div class="adm-kpi__body"><p class="adm-kpi__label">Receita aprovada</p><p class="adm-kpi__value">${fmt(totalRevenue)}</p><p class="adm-kpi__sub">Somente pedidos aprovados</p></div></div>
    <div class="adm-kpi"><div class="adm-kpi__body"><p class="adm-kpi__label">Pedidos</p><p class="adm-kpi__value">${orders.length}</p><p class="adm-kpi__sub">Registrados na base</p></div></div>
  </div>
  ${rows.length ? `<div class="adm-card"><div class="adm-card__header"><h3 class="adm-card__title">Base de clientes</h3></div><table class="adm-table"><thead><tr><th>Nome</th><th>E-mail</th><th>Pedidos</th><th>Total aprovado</th><th>Cadastro</th></tr></thead><tbody>${rows.map(row => `<tr><td>${_cmsEscape(row.customer.full_name || 'Sem nome')}</td><td class="adm-muted">${_cmsEscape(row.customer.email || '')}</td><td>${row.orders}</td><td>${fmt(row.total)}</td><td>${new Date(row.customer.created_at).toLocaleDateString('pt-BR')}</td></tr>`).join('')}</tbody></table></div>` : renderNoData('Nenhum cliente real foi cadastrado até o momento.')}`
}

function renderPerfil() {
  const profile = JSON.parse(localStorage.getItem('adm_profile') || '{}')
  const name  = profile.name  || document.querySelector('.adm-sidebar__user-name')?.textContent || 'Usuário'
  const role  = profile.role  || document.querySelector('.adm-sidebar__user-role')?.textContent || 'Administrador(a)'
  const theme = profile.theme || 'rosa'
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('')
  const MONTHS_LONG  = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  const MONTHS_SHORT = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']
  const today = new Date()
  const THEMES = [
    { id:'rosa',  name:'Rosa (Padrão)', c1:'#ffbdc6', c2:'#ffd0d3' },
    { id:'roxo',  name:'Roxo',          c1:'#7c3aed', c2:'#8b5cf6' },
    { id:'azul',  name:'Azul',          c1:'#1d4ed8', c2:'#3b82f6' },
    { id:'verde', name:'Verde',          c1:'#15803d', c2:'#16a34a' },
  ]

  return `
  <div class="adm-row">
    <div class="adm-card adm-profile-hero">
      <div class="adm-profile-hero__avatar-wrap">
        ${(() => {
          const src = localStorage.getItem('adm_profile_photo') || 'assets/images/usuarios/shelly.webp'
          return `<img src="${src}" class="adm-profile-hero__photo" id="profile-avatar-display" alt="Foto de perfil">`
        })()}
        <label class="adm-profile-photo-edit" title="Alterar foto" for="pf-photo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </label>
      </div>
      <div class="adm-profile-hero__info">
        <p class="adm-profile-hero__greeting">Olá,</p>
        <h2 class="adm-profile-hero__name" id="profile-name-display">${name}</h2>
        <p class="adm-profile-hero__role" id="profile-role-display">${role}</p>
      </div>
    </div>
    <div class="adm-card adm-profile-month-card">
      <p class="adm-profile-month__label">Período selecionado</p>
      <h2 class="adm-profile-month__val">Mês de ${MONTHS_SHORT[calMonth]} ${calYear}</h2>
      <p class="adm-profile-month__sub">${MONTHS_LONG[calMonth]} de ${calYear}</p>
      <p class="adm-profile-month__today">Hoje: ${today.toLocaleDateString('pt-BR', {weekday:'long', day:'2-digit', month:'long'})}</p>
    </div>
  </div>

  <div class="adm-card">
    <div class="adm-card__header"><h3 class="adm-card__title">Personalização do Perfil</h3><span class="adm-card__subtitle">Alterações salvas automaticamente</span></div>
    <form class="adm-profile-form" id="adm-profile-form" autocomplete="off">
      <div class="adm-profile-form__row">
        <div class="adm-profile-form__field">
          <label class="adm-profile-form__label">Seu nome</label>
          <input class="adm-profile-form__input" type="text" id="pf-name" value="${name}" placeholder="Nome completo">
        </div>
        <div class="adm-profile-form__field">
          <label class="adm-profile-form__label">Cargo / Função</label>
          <input class="adm-profile-form__input" type="text" id="pf-role" value="${role}" placeholder="Ex: Administradora">
        </div>
      </div>
      <div class="adm-profile-form__field">
        <label class="adm-profile-form__label">Tema de cores</label>
        <div class="adm-theme-grid">
          ${THEMES.map(t => `
            <label class="adm-theme-card${theme === t.id ? ' is-active' : ''}">
              <input type="radio" name="theme" value="${t.id}" ${theme === t.id ? 'checked' : ''}>
              <div class="adm-theme-card__swatch">
                <span style="background:${t.c1}"></span>
                <span style="background:${t.c2}"></span>
              </div>
              <span class="adm-theme-card__name">${t.name}</span>
            </label>`).join('')}
        </div>
      </div>
    </form>
  </div>

  <div class="adm-card">
    <div class="adm-card__header"><h3 class="adm-card__title">Administradores do Sistema</h3></div>
    <table class="adm-table">
      <thead><tr><th>Nome</th><th>Cargo</th><th>E-mail</th><th>Desde</th><th>Status</th></tr></thead>
      <tbody>
        ${ADMIN_STAFF.map(s => `<tr>
          <td><strong>${s.name}</strong></td><td>${s.role}</td>
          <td class="adm-muted">${s.email}</td><td>${s.since}</td><td>${badge(s.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`
}

function bindProfileForm() {
  const form = document.getElementById('adm-profile-form')
  if (!form) return
  const THEME_VARS = {
    rosa:  { sidebar: '#ffbdc6', primary: '#ffbdc6', light: '#ffd0d3' },
    roxo:  { sidebar: '#7c3aed', primary: '#8b5cf6', light: '#ede9fe' },
    azul:  { sidebar: '#1d4ed8', primary: '#3b82f6', light: '#dbeafe' },
    verde: { sidebar: '#15803d', primary: '#16a34a', light: '#dcfce7' },
  }
  function save() {
    const name  = document.getElementById('pf-name')?.value.trim()  || 'Shelly Lopes'
    const role  = document.getElementById('pf-role')?.value.trim()  || 'Administradora'
    const theme = form.querySelector('input[name="theme"]:checked')?.value || 'rosa'
    localStorage.setItem('adm_profile', JSON.stringify({ name, role, theme }))
    applyStoredProfile()
    const nd = document.getElementById('profile-name-display')
    const rd = document.getElementById('profile-role-display')
    const ad = document.getElementById('profile-avatar-display')
    if (nd) nd.textContent = name
    if (rd) rd.textContent = role
    if (ad && ad.tagName !== 'IMG') ad.textContent = name.split(' ').map(n => n[0]).slice(0, 2).join('')
    form.querySelectorAll('.adm-theme-card').forEach(c => {
      c.classList.toggle('is-active', c.querySelector('input').value === theme)
    })
    showToast('Perfil atualizado!')
  }
  form.addEventListener('input', save)

  // Photo upload
  const photoInput = document.getElementById('pf-photo')
  photoInput?.addEventListener('change', () => {
    const file = photoInput.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      const dataUrl = e.target.result
      localStorage.setItem('adm_profile_photo', dataUrl)
      applyStoredProfile()
      const wrap = document.querySelector('.adm-profile-hero__avatar-wrap')
      if (wrap) {
        const existing = wrap.querySelector('.adm-profile-hero__initials, .adm-profile-hero__photo')
        if (existing) {
          const img = document.createElement('img')
          img.src = dataUrl
          img.className = 'adm-profile-hero__photo'
          img.id = 'profile-avatar-display'
          img.alt = 'Foto de perfil'
          wrap.replaceChild(img, existing)
        }
      }
      showToast('Foto atualizada!')
    }
    reader.readAsDataURL(file)
  })
}

function applyTheme(t) {
  const s = document.documentElement.style
  // tema rosa = identidade da cliente: sidebar clara, texto escuro. Os outros mantêm sidebar escura com texto branco.
  const brand = t.sidebar.toLowerCase() === '#ffbdc6'
  s.setProperty('--adm-sidebar-bg', t.sidebar)
  s.setProperty('--adm-primary', t.primary)
  s.setProperty('--adm-primary-light', t.light)
  s.setProperty('--adm-primary-text', brand ? '#9b3b48' : t.sidebar)
  s.setProperty('--adm-on-primary', brand ? '#2d2226' : '#ffffff')
  s.setProperty('--adm-sidebar-text', brand ? '#2d2226' : '#ffffff')
  s.setProperty('--adm-sidebar-active', brand ? '#2d2226' : '#ffffff')
  s.setProperty('--adm-sidebar-muted', brand ? 'rgba(45,34,38,0.72)' : 'rgba(255,255,255,0.65)')
  s.setProperty('--adm-sidebar-active-bg', brand ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.20)')
  s.setProperty('--adm-sidebar-hover', brand ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.12)')
}

function applyStoredProfile() {
  const p = JSON.parse(localStorage.getItem('adm_profile') || '{}')
  const photo = localStorage.getItem('adm_profile_photo') || 'assets/images/usuarios/shelly.webp'
  const THEME_VARS = {
    rosa:  { sidebar: '#ffbdc6', primary: '#ffbdc6', light: '#ffd0d3' },
    roxo:  { sidebar: '#7c3aed', primary: '#8b5cf6', light: '#ede9fe' },
    azul:  { sidebar: '#1d4ed8', primary: '#3b82f6', light: '#dbeafe' },
    verde: { sidebar: '#15803d', primary: '#16a34a', light: '#dcfce7' },
  }
  if (p.theme && THEME_VARS[p.theme]) applyTheme(THEME_VARS[p.theme])
  const uaEl = document.querySelector('.adm-sidebar__user-avatar')
  if (uaEl) uaEl.innerHTML = `<img src="${photo}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" alt="">`
  if (p.name) {
    const unEl = document.querySelector('.adm-sidebar__user-name')
    if (unEl) unEl.textContent = p.name
  }
  if (p.role) {
    const urEl = document.querySelector('.adm-sidebar__user-role')
    if (urEl) urEl.textContent = p.role
  }
}

function showToast(msg) {
  const t = document.getElementById('adm-toast')
  if (!t) return
  t.textContent = msg
  t.classList.add('is-visible')
  setTimeout(() => t.classList.remove('is-visible'), 2600)
}

// ── Calendar Picker ───────────────────────────────────────────────
let calYear = 2026, calMonth = 5

function initCalendarPicker() {
  const MONTHS_LONG  = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  const MONTHS_SHORT = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']
  let dropOpen = false

  const labelText = document.getElementById('adm-cal-text')
  const dropdown  = document.getElementById('adm-cal-dropdown')
  const yearEl    = document.getElementById('adm-cal-year')
  const monthsEl  = document.getElementById('adm-cal-months')
  const calWrap   = document.getElementById('adm-cal')
  if (!labelText || !dropdown) return

  function updateLabel() {
    labelText.textContent = `${MONTHS_LONG[calMonth]} de ${calYear}`
  }

  function renderMonths() {
    if (yearEl) yearEl.textContent = calYear
    if (!monthsEl) return
    monthsEl.innerHTML = MONTHS_SHORT.map((m, i) =>
      `<button class="adm-cal__month-btn${i === calMonth ? ' is-active' : ''}" data-m="${i}">${m}</button>`
    ).join('')
    monthsEl.querySelectorAll('.adm-cal__month-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation()
        calMonth = +btn.dataset.m
        updateLabel()
        closeDropdown()
        renderSection(currentSection, currentPeriod)
      })
    })
  }

  function openDropdown()  { renderMonths(); dropdown.classList.add('is-open');    dropOpen = true  }
  function closeDropdown() { dropdown.classList.remove('is-open'); dropOpen = false }

  function changeMonth(d) {
    calMonth += d
    if (calMonth > 11) { calMonth = 0; calYear++ }
    if (calMonth < 0)  { calMonth = 11; calYear-- }
    updateLabel()
    renderSection(currentSection, currentPeriod)
  }

  document.getElementById('adm-cal-prev')?.addEventListener('click', () => changeMonth(-1))
  document.getElementById('adm-cal-next')?.addEventListener('click', () => changeMonth(+1))
  document.getElementById('adm-cal-label')?.addEventListener('click', e => { e.stopPropagation(); dropOpen ? closeDropdown() : openDropdown() })
  document.getElementById('adm-cal-yr-prev')?.addEventListener('click', e => { e.stopPropagation(); calYear--; renderMonths() })
  document.getElementById('adm-cal-yr-next')?.addEventListener('click', e => { e.stopPropagation(); calYear++; renderMonths() })
  document.getElementById('adm-cal-today')?.addEventListener('click', () => { calYear = 2026; calMonth = 5; updateLabel(); closeDropdown(); renderSection(currentSection, currentPeriod) })
  document.addEventListener('click', e => { if (dropOpen && calWrap && !calWrap.contains(e.target)) closeDropdown() })

  updateLabel()
}

// ── Quick Actions FAB ─────────────────────────────────────────────
function initQuickActions() {
  const fabBtn  = document.getElementById('adm-fab-btn')
  const fabWrap = document.getElementById('adm-fab-wrap')
  const modalEl = document.getElementById('adm-modal')
  const modalTitle  = document.getElementById('adm-modal-title')
  const modalBody   = document.getElementById('adm-modal-body')
  const modalClose  = document.getElementById('adm-modal-close')
  const modalBdrop  = document.getElementById('adm-modal-backdrop')
  if (!fabBtn) return

  let fabOpen = false

  fabBtn.addEventListener('click', e => {
    e.stopPropagation()
    fabOpen = !fabOpen
    fabWrap?.classList.toggle('is-open', fabOpen)
    fabBtn.querySelector('svg')?.style && (fabBtn.querySelector('svg').style.transform = fabOpen ? 'rotate(45deg)' : '')
  })

  document.addEventListener('click', e => {
    if (fabOpen && fabWrap && !fabWrap.contains(e.target)) {
      fabOpen = false
      fabWrap.classList.remove('is-open')
    }
  })

  const ACTION_CONFIG = {
    venda:    { title: 'Nova Venda',          desc: 'Registre uma nova transação de venda',        color: '#9b3b48', icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0', fields: [['Cliente','text','Nome do cliente'],['Produto','text','Nome do produto'],['Valor (R$)','number','0,00'],['Pagamento','select','PIX|Cartão|Boleto']] },
    pedido:   { title: 'Novo Pedido',         desc: 'Crie um novo pedido para um cliente',         color: '#3b82f6', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', fields: [['Cliente','text','Nome do cliente'],['Produto','text','Nome do produto'],['Quantidade','number','1'],['Observação','text','—']] },
    entrada:  { title: 'Registrar Entrada',   desc: 'Adicione uma entrada financeira',              color: '#16a34a', icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', fields: [['Descrição','text','Ex: Pagamento recebido'],['Valor (R$)','number','0,00'],['Categoria','select','Vendas|Transferência|Outros'],['Data','date','']] },
    saida:    { title: 'Registrar Saída',     desc: 'Registre uma despesa ou saída',                color: '#f59e0b', icon: 'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', fields: [['Descrição','text','Ex: Fornecedor'],['Valor (R$)','number','0,00'],['Categoria','select','Estoque|Operação|Logística|Outros'],['Data','date','']] },
    cliente:  { title: 'Novo Cliente',        desc: 'Cadastre um novo cliente na base',             color: '#8b5cf6', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', fields: [['Nome completo','text','Nome do cliente'],['E-mail','email','email@exemplo.com'],['Telefone','text','(00) 00000-0000'],['Cidade','text','Cidade - UF']] },
    pagamento:{ title: 'Registrar Pagamento', desc: 'Registre um pagamento recebido ou realizado', color: '#0891b2', icon: 'M1 4h22v16H1z M1 10h22', fields: [['Cliente','text','Nome do cliente'],['Valor (R$)','number','0,00'],['Método','select','PIX|Cartão|Boleto'],['Referência','text','Ex: Pedido JS0053']] },
  }

  document.querySelectorAll('.adm-fab__action').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action
      const cfg = ACTION_CONFIG[action]
      if (!cfg || !modalEl) return
      fabOpen = false
      fabWrap?.classList.remove('is-open')

      const headerEl = modalEl.querySelector('.adm-modal__header')
      if (headerEl) {
        headerEl.innerHTML = `
          <div class="adm-modal__header-inner">
            <div class="adm-modal__action-icon" style="background:${cfg.color}1a;color:${cfg.color}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${cfg.icon}"/></svg>
            </div>
            <div>
              <h3 class="adm-modal__title">${cfg.title}</h3>
              <p class="adm-modal__subtitle">${cfg.desc}</p>
            </div>
          </div>
          <button class="adm-modal__close" id="adm-modal-close" aria-label="Fechar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>`
        headerEl.querySelector('#adm-modal-close')?.addEventListener('click', closeModal)
      }

      if (modalBody) {
        modalBody.innerHTML = `
          <div class="adm-modal__sep"></div>
          <form class="adm-modal__form" id="adm-quick-form">
            ${cfg.fields.map(([label, type, ph]) => {
              if (type === 'select') {
                const opts = ph.split('|').map(o => `<option>${o}</option>`).join('')
                return `<div class="adm-modal__field"><label>${label}</label><select class="adm-modal__input">${opts}</select></div>`
              }
              const today = new Date().toISOString().split('T')[0]
              return `<div class="adm-modal__field"><label>${label}</label><input class="adm-modal__input" type="${type}" placeholder="${ph}" ${type==='date' ? `value="${today}"` : ''}></div>`
            }).join('')}
            <div class="adm-modal__actions">
              <button type="button" class="adm-modal__cancel" id="adm-modal-cancel-btn">Cancelar</button>
              <button type="submit" class="adm-modal__submit" style="background:${cfg.color};box-shadow:0 3px 14px ${cfg.color}55">Confirmar</button>
            </div>
          </form>`
        document.getElementById('adm-modal-cancel-btn')?.addEventListener('click', closeModal)
        document.getElementById('adm-quick-form')?.addEventListener('submit', e => {
          e.preventDefault()
          closeModal()
          showToast(`${cfg.title} registrado com sucesso!`)
        })
      }
      modalEl.classList.add('is-open')
    })
  })

  function closeModal() { modalEl?.classList.remove('is-open') }
  modalClose?.addEventListener('click', closeModal)
  modalBdrop?.addEventListener('click', closeModal)
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modalEl?.classList.contains('is-open')) closeModal()
  })
}

// ── Navigation ────────────────────────────────────────────────────
const SECTION_TITLES = {
  dashboard: 'Dashboard', vendas: 'Vendas', financeiro: 'Financeiro',
  estoque: 'Estoque', pedidos: 'Pedidos', pagamentos: 'Pagamentos',
  fornecedores: 'Fornecedores', colaboradores: 'Colaboradores', clientes: 'Clientes',
  perfil: 'Meu Perfil',
  'cms-produtos':  'Produtos — Conteúdo',
  'cms-blog':      'Blog — Conteúdo',
  'cms-novidades': 'Novidades — Conteúdo',
  'cms-loja':      'Loja Física — Conteúdo',
  'cms-banners':   'Banners — Conteúdo',
}
const PERIOD_SECTIONS = ['dashboard', 'vendas', 'financeiro']

let currentSection = 'dashboard'
let currentPeriod  = 'semana'

async function renderSection(section, period) {
  const content   = document.getElementById('adm-content')
  const title     = document.getElementById('adm-page-title')
  const periodBar = document.getElementById('adm-period-pills')
  if (!content) return

  if (periodBar) periodBar.style.display = PERIOD_SECTIONS.includes(section) ? 'flex' : 'none'
  if (title) title.textContent = SECTION_TITLES[section] || section

  const renderers = {
    dashboard: () => renderDashboard(period),
    vendas: () => renderVendasReal(period),
    financeiro: () => renderNoData('Financeiro será disponibilizado quando a conciliação estiver configurada.'),
    estoque: () => renderNoData('Estoque será disponibilizado quando o controle operacional estiver configurado.'),
    pedidos: renderPedidosReal,
    pagamentos: renderPagamentosReal,
    fornecedores: () => renderNoData('Fornecedores será disponibilizado quando o cadastro estiver configurado.'),
    colaboradores: () => renderNoData('Colaboradores será disponibilizado quando a gestão de equipe estiver configurada.'),
    clientes: renderClientesReal,
    perfil: renderPerfil,
    'cms-produtos':  renderCmsProdutos,
    'cms-blog':      renderCmsBlog,
    'cms-novidades': renderCmsNovidades,
    'cms-loja':      renderCmsLojaFisica,
    'cms-banners':   renderCmsBanners,
  }

  // Trigger animation
  content.classList.remove('adm-anim')
  void content.offsetWidth
  _cjsDestroyAll()
  try {
    content.innerHTML = await (renderers[section] || (() => ''))()
  } catch (error) {
    console.error(`Erro ao abrir a seção ${section}:`, error)
    content.innerHTML = `<div class="adm-card cms-error-state" role="alert">${_cmsEscape(error.message || 'Não foi possível carregar esta seção.')}</div>`
    return
  }
  content.classList.add('adm-anim')
  initPendingCharts()

  if (section === 'perfil') bindProfileForm()

  const _cmsBinders = { 'cms-produtos': bindCmsProdutos, 'cms-blog': bindCmsBlog, 'cms-novidades': bindCmsNovidades, 'cms-loja': bindCmsLojaFisica, 'cms-banners': bindCmsBanners }
  if (_cmsBinders[section]) _cmsBinders[section]()

  // Order filter
  const orderFilter = document.getElementById('order-filter')
  if (orderFilter) {
    orderFilter.querySelectorAll('.adm-filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        orderFilter.querySelectorAll('.adm-filter-pill').forEach(p => p.classList.remove('is-active'))
        pill.classList.add('is-active')
        const f = pill.dataset.filter
        document.querySelectorAll('#orders-table tbody tr').forEach(row => {
          row.style.display = f === 'all' || row.dataset.status === f ? '' : 'none'
        })
      })
    })
  }

  // Status pills in Pedidos (click to filter)
  document.querySelectorAll('.adm-status-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      const f = pill.dataset.filter
      document.querySelectorAll('#orders-table tbody tr').forEach(row => {
        row.style.display = f === 'all' || row.dataset.status === f ? '' : 'none'
      })
    })
  })

  // Internal nav links (e.g., "Ver todos")
  content.querySelectorAll('[data-section]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); navigate(el.dataset.section) })
  })
}

async function navigate(section) {
  currentSection = section
  document.querySelectorAll('.adm-nav__item').forEach(item => {
    item.classList.toggle('is-active', item.dataset.section === section)
  })
  await renderSection(section, currentPeriod)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Search ────────────────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById('adm-search')
  if (!input) return
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim()
    document.querySelectorAll('.adm-nav__item').forEach(item => {
      const text = item.textContent.trim().toLowerCase()
      item.classList.toggle('is-hidden', q !== '' && !text.includes(q))
    })
  })
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const user = await SupabaseAuth.getCurrentUser()
  const profile = user ? await SupabaseAuth.getCurrentUserProfile() : null
  const canAccessCRM = ['admin', 'hr'].includes(profile?.role)

  if (!user || !canAccessCRM) {
    window.location.replace('login.html')
    return
  }

  const displayName = profile.full_name || profile.email || user.email
  const roleLabel = profile.role === 'hr' ? 'RH' : 'Administrador(a)'
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()
  const sidebarName = document.querySelector('.adm-sidebar__user-name')
  const sidebarRole = document.querySelector('.adm-sidebar__user-role')
  const sidebarAvatar = document.querySelector('.adm-sidebar__user-avatar')
  if (sidebarName) sidebarName.textContent = displayName
  if (sidebarRole) sidebarRole.textContent = roleLabel
  if (sidebarAvatar) sidebarAvatar.textContent = initials || 'JS'
  document.documentElement.classList.remove('auth-pending')

  document.querySelectorAll('.adm-nav__item').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.section))
  })

  document.querySelectorAll('.adm-period-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.adm-period-pill').forEach(p => p.classList.remove('is-active'))
      pill.classList.add('is-active')
      currentPeriod = pill.dataset.period
      renderSection(currentSection, currentPeriod)
    })
  })

  const toggle  = document.getElementById('adm-toggle')
  const sidebar = document.getElementById('adm-sidebar')
  const overlay = document.getElementById('adm-overlay')

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      const open = sidebar.classList.toggle('is-open')
      if (overlay) { overlay.style.opacity = open ? '1' : '0'; overlay.style.pointerEvents = open ? 'auto' : 'none' }
    })
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('is-open')
        overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'
      })
    }
  }

  document.getElementById('adm-user-profile-btn')?.addEventListener('click', () => navigate('perfil'))

  document.querySelector('.adm-sidebar__back')?.addEventListener('click', e => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute('href')
    document.body.classList.add('is-leaving')
    setTimeout(() => { window.location.href = href }, 190)
  })

  document.getElementById('adm-logout')?.addEventListener('click', async e => {
    e.preventDefault()
    await SupabaseAuth.logout()
    window.location.href = 'login.html'
  })

  initSearch()
  initCalendarPicker()
  initQuickActions()
  applyStoredProfile()
  renderSection('dashboard', 'semana')

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return
    const open = document.querySelector('.cms-modal-overlay.is-open')
    if (open) _cmsCloseModal(open.id)
  })
})

// ══════════════════════════════════════════════════════════════════
// CMS — Conteúdo do Site
// ══════════════════════════════════════════════════════════════════

function _cmsOpenModal(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.style.display = 'flex'
  requestAnimationFrame(() => el.classList.add('is-open'))
}
function _cmsCloseModal(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.classList.remove('is-open')
  setTimeout(() => { el.style.display = 'none' }, 220)
}

// ── Produtos ──────────────────────────────────────────────────────
let _cmsProdPage = 0
let _cmsProdFilters = { search: '', category: '', status: '' }
let _cmsProdImageList = []
let _cmsEditingProduct = null
const CMS_PRODUCTS_PAGE_SIZE = 25

function _cmsEscape(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char])
}

async function renderCmsProdutos() {
  const [{ products, count }, categories] = await Promise.all([
    CMS.getAdminProducts({ ..._cmsProdFilters, page: _cmsProdPage, pageSize: CMS_PRODUCTS_PAGE_SIZE }),
    CMS.getProductCategories()
  ])
  const collections = await CMS.getCollections()
  const collectionsHtml = collections.map(c => `
    <span class="cms-badge" style="display:inline-flex;align-items:center;gap:.4rem;padding:4px 10px;border:1px solid var(--color-border);border-radius:100px;margin:0 .4rem .4rem 0">
      <button type="button" class="cms-star-btn" data-star="${c.id}" title="Marcar como destaque na home" style="background:none;border:none;cursor:pointer;font-size:1rem;color:${c.is_featured ? 'var(--color-primary-mid)' : '#ccc'}">★</button>
      ${_cmsEscape(c.name)}
      <button type="button" class="cms-icon-btn" data-del-col="${c.id}" title="Excluir coleção" style="background:none;border:none;cursor:pointer">${UIIcons.svg('trash')}</button>
    </span>`).join('') || '<span style="color:var(--color-muted);font-size:.85rem">Nenhuma coleção ainda.</span>'

  const rows = products.map(p => `
    <tr data-id="${p.id}">
      <td>${p.image ? `<img class="cms-table__thumb" src="${_cmsEscape(p.image)}" alt="${_cmsEscape(p.name)}" loading="lazy">` : '<div class="cms-table__thumb" style="background:#f5f5f5"></div>'}</td>
      <td><strong>${_cmsEscape(p.name)}</strong><br><small class="cms-table__sub">SKU: ${_cmsEscape(p.sku || '—')}</small></td>
      <td>${_cmsEscape(p.category || '—')}</td>
      <td>R$&nbsp;${Number(p.price).toFixed(2).replace('.',',')}${p.comparePrice ? `<br><small style="text-decoration:line-through;color:var(--color-muted)">R$&nbsp;${Number(p.comparePrice).toFixed(2).replace('.',',')}</small>` : ''}</td>
      <td><span class="cms-badge cms-badge--${p.status === 'active' ? 'new' : 'draft'}">${p.status === 'active' ? 'Publicado' : p.status === 'archived' ? 'Arquivado' : 'Rascunho'}</span></td>
      <td>
        <button class="cms-icon-btn" data-edit="${p.id}" title="Editar">✏️</button>
        <button class="cms-icon-btn" data-publish="${p.id}" title="${p.status === 'active' ? 'Despublicar' : 'Publicar'}">${p.status === 'active' ? '⏸' : '▶'}</button>
        <button class="cms-icon-btn cms-icon-btn--danger" data-del="${p.id}" title="Excluir">🗑</button>
      </td>
    </tr>`).join('')

  return `
    <div class="cms-toolbar">
      <input class="cms-search" id="cms-prod-search" value="${_cmsEscape(_cmsProdFilters.search)}" placeholder="Buscar por nome ou SKU…">
      <select class="cms-filter-select cms-cat-select" id="cms-prod-cat-filter">
        <option value="">Todas as categorias</option>
        ${categories.map(c => `<option value="${_cmsEscape(c.name)}" ${_cmsProdFilters.category === c.name ? 'selected' : ''}>${_cmsEscape(c.name)}</option>`).join('')}
      </select>
      <select class="cms-filter-select" id="cms-prod-status-filter">
        <option value="">Todos os status</option>
        <option value="active" ${_cmsProdFilters.status === 'active' ? 'selected' : ''}>Publicado</option>
        <option value="draft" ${_cmsProdFilters.status === 'draft' ? 'selected' : ''}>Rascunho</option>
        <option value="archived" ${_cmsProdFilters.status === 'archived' ? 'selected' : ''}>Arquivado</option>
      </select>
      <button class="cms-btn cms-btn--primary" id="cms-prod-new">+ Novo Produto</button>
    </div>
    <div class="cms-prod-category-add">
      <input class="cms-input" id="cms-category-name" placeholder="Nome da nova categoria">
      <button class="cms-btn cms-btn--outline cms-btn--sm" id="cms-category-add">Adicionar categoria</button>
    </div>
    <div class="cms-product-categories" id="cms-product-categories">
      ${categories.map(c => `
        <span class="cms-category-chip">${_cmsEscape(c.name)}
          <button type="button" data-category-edit="${_cmsEscape(c.id)}" data-category-name="${_cmsEscape(c.name)}" title="Renomear ${_cmsEscape(c.name)}">✏️</button>
          <button type="button" data-category-delete="${_cmsEscape(c.id)}" data-category-name="${_cmsEscape(c.name)}" title="Excluir ${_cmsEscape(c.name)}">${UIIcons.svg('x')}</button>
        </span>`).join('') || '<span class="cms-hint">Nenhuma categoria criada.</span>'}
    </div>
    <div class="adm-card" style="margin-bottom:1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:.5rem">
        <strong>Coleções <span style="font-weight:400;color:var(--color-muted);font-size:.8rem">— clique na estrela pra marcar a que aparece no botão "Ver Coleção" da home</span></strong>
        <div style="display:flex;gap:.5rem">
          <input class="cms-input" id="cms-new-collection" placeholder="Nova coleção…" style="width:200px">
          <button class="cms-btn cms-btn--outline cms-btn--sm" id="cms-add-collection">+ Adicionar</button>
        </div>
      </div>
      <div id="cms-collections-list">${collectionsHtml}</div>
    </div>
    <div class="adm-card" style="padding:0;overflow:auto">
      <table class="cms-table" id="cms-prod-table">
        <thead><tr><th>Foto</th><th>Produto / SKU</th><th>Categoria</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6" class="cms-empty">Nenhum produto encontrado.</td></tr>'}</tbody>
      </table>
    </div>
    <div class="cms-prod-pagination">
      <span>${count ? `${_cmsProdPage * CMS_PRODUCTS_PAGE_SIZE + 1}–${Math.min((_cmsProdPage + 1) * CMS_PRODUCTS_PAGE_SIZE, count)} de ${count} produtos` : '0 produtos'}</span>
      <div>
        <button class="cms-btn cms-btn--outline cms-btn--sm" id="cms-prod-prev" ${_cmsProdPage === 0 ? 'disabled' : ''}>Anterior</button>
        <button class="cms-btn cms-btn--outline cms-btn--sm" id="cms-prod-next" ${(_cmsProdPage + 1) * CMS_PRODUCTS_PAGE_SIZE >= count ? 'disabled' : ''}>Próxima</button>
      </div>
    </div>
    <div class="cms-modal-overlay" id="cms-prod-overlay" style="display:none">
      <div class="cms-modal cms-product-modal">
        <div class="cms-modal__header">
          <div><h2 class="cms-modal__title" id="cms-prod-modal-title">Novo Produto</h2><p class="cms-hint">Cadastre os dados comerciais e variantes da peça.</p></div>
          <button class="cms-modal__close" id="cms-prod-close" type="button" aria-label="Fechar">${UIIcons.svg('x')}</button>
        </div>
        <div class="cms-modal__body cms-product-modal__body">
          <form class="cms-form" id="cms-prod-form">
            <input type="hidden" id="cms-prod-id">
            <section class="cms-product-section">
              <h3>Informações do produto</h3>
              <div class="cms-form-row">
                <div class="cms-field cms-field--full">
                  <label class="cms-label" for="cms-prod-name">Nome do produto *</label>
                  <input class="cms-input" id="cms-prod-name" type="text" required maxlength="160" placeholder="Ex.: Vestido Longo Floral">
                </div>
                <div class="cms-field">
                  <label class="cms-label" for="cms-prod-sku">SKU principal</label>
                  <input class="cms-input" id="cms-prod-sku" type="text" maxlength="80" placeholder="Ex.: VES-001">
                </div>
                <div class="cms-field">
                  <label class="cms-label" for="cms-prod-slug">Slug da página</label>
                  <input class="cms-input" id="cms-prod-slug" type="text" maxlength="180" placeholder="gerado pelo nome se vazio">
                </div>
                <div class="cms-field">
                  <label class="cms-label" for="cms-prod-cat">Categoria *</label>
                  <select class="cms-select" id="cms-prod-cat" required>
                    <option value="">Selecione a categoria</option>
                    ${categories.map(c => `<option value="${_cmsEscape(c.id)}">${_cmsEscape(c.name)}</option>`).join('')}
                  </select>
                </div>
                <div class="cms-field">
                  <label class="cms-label" for="cms-prod-brand">Marca</label>
                  <input class="cms-input" id="cms-prod-brand" type="text" maxlength="100" placeholder="Opcional">
                </div>
                <div class="cms-field cms-field--full">
                  <label class="cms-label" for="cms-prod-description">Descrição</label>
                  <textarea class="cms-textarea" id="cms-prod-description" rows="4" maxlength="5000" placeholder="Detalhes, material e caimento"></textarea>
                </div>
              </div>
            </section>
            <section class="cms-product-section">
              <h3>Preços e publicação</h3>
              <div class="cms-form-row">
                <div class="cms-field">
                  <label class="cms-label" for="cms-prod-price">Preço de venda (R$) *</label>
                  <input class="cms-input" id="cms-prod-price" type="number" min="0.01" step="0.01" required>
                </div>
                <div class="cms-field">
                  <label class="cms-label" for="cms-prod-compare">Preço original (R$)</label>
                  <input class="cms-input" id="cms-prod-compare" type="number" min="0.01" step="0.01" placeholder="Opcional">
                </div>
                <div class="cms-field">
                  <label class="cms-label" for="cms-prod-status">Status</label>
                  <select class="cms-select" id="cms-prod-status">
                    <option value="draft">Rascunho</option>
                    <option value="active">Publicado</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
                <div class="cms-field">
                  <label class="cms-label">Destaques</label>
                  <div class="cms-check-row">
                    <label><input type="checkbox" id="cms-prod-isnew"> Novo</label>
                    <label><input type="checkbox" id="cms-prod-issale"> Promoção</label>
                  </div>
                </div>
              </div>
            </section>
            <section class="cms-product-section">
              <div class="cms-product-section__heading">
                <div><h3>Fotos do produto</h3><p class="cms-hint">Até 12 fotos, no máximo 10 MB cada. A primeira será a imagem principal.</p></div>
                <label class="cms-btn cms-btn--outline cms-btn--sm">
                  Adicionar fotos
                  <input type="file" id="cms-prod-file" accept="image/jpeg,image/png,image/webp" multiple hidden>
                </label>
              </div>
              <div class="cms-dropzone" id="cms-prod-dropzone" tabindex="0">
                Arraste fotos para cá ou use “Adicionar fotos”
              </div>
              <div class="cms-prod-images" id="cms-prod-images"></div>
              <div class="cms-upload-progress" id="cms-prod-upload-progress" role="progressbar" aria-label="Envio de imagens" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                <span></span>
              </div>
              <p class="cms-hint" id="cms-prod-upload-status" aria-live="polite"></p>
            </section>
            <section class="cms-product-section">
              <div class="cms-product-section__heading">
                <div><h3>Tamanhos, cores e estoque</h3><p class="cms-hint">Cada combinação tem SKU e quantidade próprios.</p></div>
                <button class="cms-btn cms-btn--outline cms-btn--sm" id="cms-prod-add-variant" type="button">+ Variante</button>
              </div>
              <div class="cms-variants-head"><span>SKU *</span><span>Cor</span><span>Tamanho</span><span>Preço (opcional)</span><span>Estoque</span><span></span></div>
              <div class="cms-variants-list" id="cms-prod-variants"></div>
            </section>
            <section class="cms-product-section">
              <h3>Coleções</h3>
              <div id="cms-prod-collections" class="cms-check-row">
                ${collections.map(c => `
                  <label><input type="checkbox" data-col-check="${_cmsEscape(c.id)}"> ${_cmsEscape(c.name)}</label>`).join('') || '<span class="cms-hint">Nenhuma coleção cadastrada ainda.</span>'}
              </div>
            </section>
          </form>
        </div>
        <div class="cms-modal__footer">
          <button class="cms-btn cms-btn--outline" id="cms-prod-cancel" type="button">Cancelar</button>
          <button class="cms-btn cms-btn--primary" id="cms-prod-save" type="button">Salvar produto</button>
        </div>
      </div>
    </div>`
}

function _cmsRenderProductImages() {
  const container = document.getElementById('cms-prod-images')
  if (!container) return
  container.innerHTML = _cmsProdImageList.map((image, index) => `
    <article class="cms-prod-image">
      <img src="${_cmsEscape(image.previewUrl || image.image || '')}" alt="${_cmsEscape(image.alt || `Foto ${index + 1}`)}">
      <span class="cms-prod-image__primary">${index === 0 ? 'Principal' : `Foto ${index + 1}`}</span>
      <div class="cms-prod-image__actions">
        <button type="button" class="cms-icon-btn" data-image-up="${index}" title="Mover para a esquerda" ${index === 0 ? 'disabled' : ''}>${UIIcons.svg('arrowLeft')}</button>
        <button type="button" class="cms-icon-btn" data-image-down="${index}" title="Mover para a direita" ${index === _cmsProdImageList.length - 1 ? 'disabled' : ''}>${UIIcons.svg('arrowRight')}</button>
        <button type="button" class="cms-icon-btn cms-icon-btn--danger" data-image-remove="${index}" title="Remover foto">${UIIcons.svg('trash')}</button>
      </div>
    </article>`).join('')
}

function _cmsVariantRow(variant = {}) {
  return `<div class="cms-variant-row">
    <input class="cms-input" data-variant-field="sku" required maxlength="80" placeholder="SKU único" value="${_cmsEscape(variant.sku || '')}">
    <input class="cms-input" data-variant-field="color" maxlength="60" placeholder="Cor" value="${_cmsEscape(variant.color || '')}">
    <input class="cms-input" data-variant-field="size" maxlength="40" placeholder="Tamanho" value="${_cmsEscape(variant.size || '')}">
    <input class="cms-input" data-variant-field="price" type="number" min="0.01" step="0.01" placeholder="Usar preço base" value="${variant.price ?? ''}">
    <input class="cms-input" data-variant-field="stock" type="number" min="0" step="1" required value="${variant.stock ?? 0}">
    <button type="button" class="cms-icon-btn cms-icon-btn--danger" data-variant-remove title="Remover variante">${UIIcons.svg('trash')}</button>
  </div>`
}

function _cmsRenderVariants(variants = []) {
  const container = document.getElementById('cms-prod-variants')
  if (container) container.innerHTML = variants.map(_cmsVariantRow).join('')
}

function _cmsRevokePendingPreviews() {
  _cmsProdImageList.forEach(image => {
    if (image.previewUrl && image.file) URL.revokeObjectURL(image.previewUrl)
  })
}

function _cmsAddProductFiles(files) {
  const status = document.getElementById('cms-prod-upload-status')
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  for (const file of files) {
    if (_cmsProdImageList.length >= 12) {
      status.textContent = 'Limite de 12 imagens por produto.'
      break
    }
    if (!allowed.includes(file.type) || file.size > 10 * 1024 * 1024) {
      status.textContent = `${file.name}: use JPG, PNG ou WebP com até 10 MB.`
      continue
    }
    _cmsProdImageList.push({
      file,
      previewUrl: URL.createObjectURL(file),
      alt: document.getElementById('cms-prod-name').value.trim()
    })
  }
  _cmsRenderProductImages()
}

function _cmsProdOpenModal(p, productCollections = [], variants = []) {
  _cmsRevokePendingPreviews()
  _cmsEditingProduct = p
  _cmsProdImageList = (p?.images || []).filter(image => image.storage_path).map(image => ({
    id: image.id,
    storage_path: image.storage_path,
    image: image.image,
    alt: image.alt || p.name
  }))
  document.getElementById('cms-prod-modal-title').textContent = p ? 'Editar produto' : 'Novo produto'
  document.getElementById('cms-prod-id').value = p?.id ?? ''
  document.getElementById('cms-prod-name').value = p?.name ?? ''
  document.getElementById('cms-prod-sku').value = p?.sku ?? ''
  document.getElementById('cms-prod-slug').value = p?.slug ?? ''
  document.getElementById('cms-prod-description').value = p?.description ?? ''
  document.getElementById('cms-prod-cat').value = p?.categoryId ?? ''
  document.getElementById('cms-prod-brand').value = p?.brand ?? ''
  document.getElementById('cms-prod-price').value = p?.price ?? ''
  document.getElementById('cms-prod-compare').value = p?.comparePrice ?? ''
  document.getElementById('cms-prod-status').value = p?.status ?? 'draft'
  document.getElementById('cms-prod-isnew').checked = p?.isNew ?? false
  document.getElementById('cms-prod-issale').checked = p?.isSale ?? false
  document.getElementById('cms-prod-upload-status').textContent = ''
  document.getElementById('cms-prod-file').value = ''
  document.querySelectorAll('#cms-prod-collections input[data-col-check]').forEach(chk => {
    chk.checked = productCollections.includes(chk.dataset.colCheck)
  })
  _cmsRenderProductImages()
  _cmsRenderVariants(variants)
  _cmsOpenModal('cms-prod-overlay')
}

function bindCmsProdutos() {
  const search = document.getElementById('cms-prod-search')
  const applySearch = () => {
      _cmsProdFilters.search = search.value.trim()
      _cmsProdPage = 0
      navigate('cms-produtos')
  }
  search?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); applySearch() }
  })
  search?.addEventListener('change', applySearch)
  document.getElementById('cms-prod-cat-filter')?.addEventListener('change', e => {
    _cmsProdFilters.category = e.currentTarget.value
    _cmsProdPage = 0
    navigate('cms-produtos')
  })
  document.getElementById('cms-prod-status-filter')?.addEventListener('change', e => {
    _cmsProdFilters.status = e.currentTarget.value
    _cmsProdPage = 0
    navigate('cms-produtos')
  })
  document.getElementById('cms-prod-prev')?.addEventListener('click', () => {
    if (_cmsProdPage > 0) { _cmsProdPage--; navigate('cms-produtos') }
  })
  document.getElementById('cms-prod-next')?.addEventListener('click', () => {
    _cmsProdPage++
    navigate('cms-produtos')
  })
  document.getElementById('cms-category-add')?.addEventListener('click', async () => {
    const input = document.getElementById('cms-category-name')
    const name = input.value.trim()
    if (!name) { input.focus(); return }
    try {
      await CMS.createProductCategory(name)
      showToast('Categoria adicionada.')
      navigate('cms-produtos')
    } catch (error) {
      console.error(error)
      showToast(error.message)
    }
  })
  document.getElementById('cms-category-name')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('cms-category-add').click() }
  })
  document.getElementById('cms-product-categories')?.addEventListener('click', async e => {
    const edit = e.target.closest('[data-category-edit]')
    const remove = e.target.closest('[data-category-delete]')
    try {
      if (edit) {
        const name = prompt('Novo nome da categoria:', edit.dataset.categoryName)?.trim()
        if (!name || name === edit.dataset.categoryName) return
        await CMS.renameProductCategory(edit.dataset.categoryEdit, name)
        showToast('Categoria renomeada.')
        navigate('cms-produtos')
      }
      if (remove && confirm(`Excluir a categoria "${remove.dataset.categoryName}"? Produtos vinculados precisam ser reatribuídos primeiro.`)) {
        await CMS.deleteProductCategory(remove.dataset.categoryDelete)
        showToast('Categoria excluída.')
        navigate('cms-produtos')
      }
    } catch (error) { console.error(error); showToast(error.message) }
  })

  document.getElementById('cms-prod-new')?.addEventListener('click', () => _cmsProdOpenModal(null))
  document.getElementById('cms-add-collection')?.addEventListener('click', async () => {
    const input = document.getElementById('cms-new-collection')
    const name = input?.value.trim()
    if (!name) return
    try { await CMS.addCollection(name); navigate('cms-produtos') }
    catch (error) { console.error(error); showToast(error.message) }
  })
  document.getElementById('cms-new-collection')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('cms-add-collection')?.click() }
  })
  document.getElementById('cms-collections-list')?.addEventListener('click', async e => {
    const starBtn = e.target.closest('[data-star]')
    const delBtn = e.target.closest('[data-del-col]')
    try {
      if (starBtn) {
        await CMS.setFeaturedCollection(starBtn.dataset.star)
        navigate('cms-produtos')
      }
      if (delBtn && confirm('Excluir esta coleção? Ela será removida de todos os produtos.')) {
        await CMS.deleteCollection(delBtn.dataset.delCol)
        navigate('cms-produtos')
      }
    } catch (error) { console.error(error); showToast(error.message) }
  })

  document.getElementById('cms-prod-table')?.addEventListener('click', async e => {
    const editBtn = e.target.closest('[data-edit]')
    const delBtn = e.target.closest('[data-del]')
    const publishBtn = e.target.closest('[data-publish]')
    try {
      if (editBtn) {
        const result = await CMS.getAdminProducts({
          ..._cmsProdFilters, page: _cmsProdPage, pageSize: CMS_PRODUCTS_PAGE_SIZE
        })
        const product = result.products.find(item => item.id === editBtn.dataset.edit)
        if (!product) throw new Error('Produto não encontrado. Atualize a lista e tente novamente.')
        const [productCollections, variants] = await Promise.all([
          CMS.getProductCollections(product.id),
          CMS.getProductVariants(product.id)
        ])
        _cmsProdOpenModal(product, productCollections, variants)
      }
      if (publishBtn) {
        const result = await CMS.getAdminProducts({
          ..._cmsProdFilters, page: _cmsProdPage, pageSize: CMS_PRODUCTS_PAGE_SIZE
        })
        const product = result.products.find(item => item.id === publishBtn.dataset.publish)
        if (!product) throw new Error('Produto não encontrado. Atualize a lista e tente novamente.')
        await CMS.updateProductStatus(product.id, product.status === 'active' ? 'draft' : 'active')
        showToast(product.status === 'active' ? 'Produto despublicado.' : 'Produto publicado.')
        navigate('cms-produtos')
      }
      if (delBtn && confirm('Excluir este produto e suas imagens? Esta ação não pode ser desfeita.')) {
        await CMS.deleteProduct(delBtn.dataset.del)
        showToast('Produto excluído.')
        navigate('cms-produtos')
      }
    } catch (error) { console.error(error); showToast(error.message) }
  })

  const closeModal = () => {
    _cmsRevokePendingPreviews()
    _cmsProdImageList = []
    _cmsCloseModal('cms-prod-overlay')
  }
  document.getElementById('cms-prod-close')?.addEventListener('click', closeModal)
  document.getElementById('cms-prod-cancel')?.addEventListener('click', closeModal)
  document.getElementById('cms-prod-overlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal()
  })

  const fileInput = document.getElementById('cms-prod-file')
  const dropzone = document.getElementById('cms-prod-dropzone')
  fileInput?.addEventListener('change', () => {
    _cmsAddProductFiles(Array.from(fileInput.files || []))
    fileInput.value = ''
  })
  dropzone?.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('is-dragging') })
  dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('is-dragging'))
  dropzone?.addEventListener('drop', e => {
    e.preventDefault()
    dropzone.classList.remove('is-dragging')
    _cmsAddProductFiles(Array.from(e.dataTransfer.files || []))
  })
  document.getElementById('cms-prod-images')?.addEventListener('click', e => {
    const up = e.target.closest('[data-image-up]')
    const down = e.target.closest('[data-image-down]')
    const remove = e.target.closest('[data-image-remove]')
    const index = Number(up?.dataset.imageUp ?? down?.dataset.imageDown ?? remove?.dataset.imageRemove)
    if (up && index > 0) [_cmsProdImageList[index - 1], _cmsProdImageList[index]] = [_cmsProdImageList[index], _cmsProdImageList[index - 1]]
    if (down && index < _cmsProdImageList.length - 1) [_cmsProdImageList[index + 1], _cmsProdImageList[index]] = [_cmsProdImageList[index], _cmsProdImageList[index + 1]]
    if (remove) {
      const [removed] = _cmsProdImageList.splice(index, 1)
      if (removed.file) URL.revokeObjectURL(removed.previewUrl)
    }
    _cmsRenderProductImages()
  })
  document.getElementById('cms-prod-add-variant')?.addEventListener('click', () => {
    document.getElementById('cms-prod-variants').insertAdjacentHTML('beforeend', _cmsVariantRow())
  })
  document.getElementById('cms-prod-variants')?.addEventListener('click', e => {
    if (e.target.closest('[data-variant-remove]')) e.target.closest('.cms-variant-row').remove()
  })

  document.getElementById('cms-prod-save')?.addEventListener('click', async e => {
    const form = document.getElementById('cms-prod-form')
    if (!form.reportValidity()) return
    const button = e.currentTarget
    const status = document.getElementById('cms-prod-upload-status')
    const name = document.getElementById('cms-prod-name').value.trim()
    const price = Number(document.getElementById('cms-prod-price').value)
    const comparePrice = Number(document.getElementById('cms-prod-compare').value) || null
    const targetStatus = document.getElementById('cms-prod-status').value
    const isSale = document.getElementById('cms-prod-issale').checked
    if (comparePrice !== null && comparePrice <= price) {
      showToast('O preço original precisa ser maior que o preço de venda.')
      document.getElementById('cms-prod-compare').focus()
      return
    }
    if (isSale && comparePrice === null) {
      showToast('Informe o preço original para marcar o produto como promoção.')
      document.getElementById('cms-prod-compare').focus()
      return
    }
    if (targetStatus === 'active' && !_cmsProdImageList.length) {
      showToast('Adicione pelo menos uma foto antes de publicar.')
      return
    }
    const variants = Array.from(document.querySelectorAll('#cms-prod-variants .cms-variant-row')).map(row => ({
      sku: row.querySelector('[data-variant-field="sku"]').value.trim(),
      color: row.querySelector('[data-variant-field="color"]').value.trim(),
      size: row.querySelector('[data-variant-field="size"]').value.trim(),
      price: Number(row.querySelector('[data-variant-field="price"]').value) || null,
      stock: Number(row.querySelector('[data-variant-field="stock"]').value),
      is_active: true
    }))
    const skuSet = new Set()
    for (const variant of variants) {
      const normalizedSku = variant.sku.toLowerCase()
      if (!variant.sku || skuSet.has(normalizedSku)) {
        showToast('Preencha cada SKU de variante com um valor único.')
        return
      }
      if (!Number.isInteger(variant.stock) || variant.stock < 0) {
        showToast(`Estoque inválido para a variante ${variant.sku}.`)
        return
      }
      skuSet.add(normalizedSku)
    }
    button.disabled = true
    button.textContent = 'Salvando…'
    let productId = null
    try {
      productId = await CMS.upsertProduct({
        id: document.getElementById('cms-prod-id').value || null,
        name,
        sku: document.getElementById('cms-prod-sku').value.trim(),
        slug: document.getElementById('cms-prod-slug').value.trim() || name,
        description: document.getElementById('cms-prod-description').value.trim(),
        categoryId: document.getElementById('cms-prod-cat').value || null,
        category: document.getElementById('cms-prod-cat').selectedOptions[0]?.textContent || '',
        brand: document.getElementById('cms-prod-brand').value.trim(),
        price,
        comparePrice,
        status: _cmsEditingProduct?.status || 'draft',
        isNew: document.getElementById('cms-prod-isnew').checked,
        isSale,
        rating: _cmsEditingProduct?.rating || 0,
        reviews: _cmsEditingProduct?.reviews || 0
      })
      const pendingCount = _cmsProdImageList.filter(image => image.file).length
      const progress = document.getElementById('cms-prod-upload-progress')
      const progressFill = progress.querySelector('span')
      progressFill.style.width = '0%'
      progress.setAttribute('aria-valuenow', '0')
      progress.classList.toggle('is-active', pendingCount > 0)
      status.textContent = pendingCount ? `Enviando 0 de ${pendingCount} imagens…` : 'Salvando imagens…'
      await CMS.saveProductImages(productId, _cmsProdImageList.map(image => ({ ...image, alt: image.alt || name })),
        (completed, total) => {
          const percent = Math.round((completed / total) * 100)
          progressFill.style.width = `${percent}%`
          progress.setAttribute('aria-valuenow', String(percent))
          status.textContent = `Enviando ${completed} de ${total} imagens…`
        })
      await CMS.saveProductVariants(productId, variants)
      const selectedCollections = Array.from(document.querySelectorAll('#cms-prod-collections input[data-col-check]:checked'))
        .map(input => input.dataset.colCheck)
      await CMS.setProductCollections(productId, selectedCollections)
      if (targetStatus !== (_cmsEditingProduct?.status || 'draft')) {
        await CMS.updateProductStatus(productId, targetStatus)
      }
      _cmsRevokePendingPreviews()
      showToast(targetStatus === 'active' ? 'Produto publicado com sucesso.' : 'Produto salvo com sucesso.')
      closeModal()
      navigate('cms-produtos')
    } catch (error) {
      console.error('Erro ao salvar o produto:', error)
      let message = error.message
      if (!_cmsEditingProduct && productId) {
        try {
          await CMS.deleteProduct(productId)
        } catch (cleanupError) {
          console.error('Falha ao remover o cadastro incompleto:', cleanupError)
          message += ` O rascunho incompleto permaneceu no sistema: ${cleanupError.message}`
        }
      }
      status.textContent = message
      showToast(message)
    } finally {
      button.disabled = false
      button.textContent = 'Salvar produto'
    }
  })
}

// ── Blog ──────────────────────────────────────────────────────────
async function renderCmsBlog() {
  const posts = await CMS.getBlogPosts()
  const cats  = ['Moda','Tendências','Estilo de Vida','Dicas','Lookbook']
  const rows  = posts.map(p => `
    <tr data-id="${p.id}" data-name="${(p.title||'').toLowerCase()}">
      <td>${p.image ? `<img class="cms-table__thumb" src="${p.image}" alt="${p.title}" onerror="this.style.display='none'">` : '<div class="cms-table__thumb" style="background:#f5f5f5"></div>'}</td>
      <td><strong>${p.title}</strong><br><small style="color:var(--color-muted)">${(p.excerpt||'').substring(0,70)}…</small></td>
      <td>${p.category}</td>
      <td>${p.date}</td>
      <td>
        <button class="cms-icon-btn" data-edit="${p.id}" title="Editar">✏️</button>
        <button class="cms-icon-btn cms-icon-btn--danger" data-del="${p.id}" title="Excluir">🗑</button>
      </td>
    </tr>`).join('')

  return `
    <div class="cms-toolbar">
      <input class="cms-search" id="cms-blog-search" placeholder="Buscar post…">
      <button class="cms-btn cms-btn--primary" id="cms-blog-new">+ Novo Post</button>
    </div>
    <div class="adm-card" style="padding:0;overflow:auto">
      <table class="cms-table" id="cms-blog-table">
        <thead><tr><th>Capa</th><th>Título</th><th>Categoria</th><th>Data</th><th>Ações</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="5" class="cms-empty">Nenhum post cadastrado.</td></tr>'}</tbody>
      </table>
    </div>
    <div class="cms-modal-overlay" id="cms-blog-overlay" style="display:none">
      <div class="cms-modal" style="max-width:640px">
        <div class="cms-modal__header">
          <span id="cms-blog-modal-title">Novo Post</span>
          <button class="cms-modal__close" id="cms-blog-close">${UIIcons.svg('x')}</button>
        </div>
        <div class="cms-modal__body" style="max-height:68vh;overflow-y:auto">
          <form class="cms-form" id="cms-blog-form">
            <input type="hidden" id="cms-blog-id">
            <div class="cms-field cms-field--full">
              <label class="cms-label">Título *</label>
              <input class="cms-input" id="cms-blog-title" type="text" required placeholder="Ex.: Dicas de Look para o Verão">
            </div>
            <div class="cms-form-row">
              <div class="cms-field">
                <label class="cms-label">Categoria *</label>
                <select class="cms-select" id="cms-blog-cat">
                  ${cats.map(c => `<option>${c}</option>`).join('')}
                </select>
              </div>
              <div class="cms-field">
                <label class="cms-label">Data *</label>
                <input class="cms-input" id="cms-blog-date" type="date" required>
              </div>
              <div class="cms-field">
                <label class="cms-label">Autor</label>
                <input class="cms-input" id="cms-blog-author" type="text" placeholder="Jhonny Styles">
              </div>
            </div>
            <div class="cms-field cms-field--full">
              <label class="cms-label">Resumo (aparece nos cards) *</label>
              <textarea class="cms-textarea" id="cms-blog-excerpt" rows="2" required placeholder="Breve descrição do post…"></textarea>
            </div>
            <div class="cms-field cms-field--full">
              <label class="cms-label">Conteúdo completo (HTML permitido)</label>
              <textarea class="cms-textarea" id="cms-blog-content" rows="8" placeholder="&lt;p&gt;Texto do post…&lt;/p&gt;"></textarea>
            </div>
            <div class="cms-field cms-field--full">
              <label class="cms-label">Foto de capa</label>
              <div class="cms-img-picker">
                <div class="cms-img-preview cms-img-preview--empty" id="cms-blog-img-preview"><span>Clique ou arraste uma foto</span></div>
                <div class="cms-img-actions">
                  <label class="cms-btn cms-btn--outline cms-btn--sm" style="cursor:pointer">
                    Escolher arquivo<input type="file" id="cms-blog-file" accept="image/*" style="display:none">
                  </label>
                  <span style="color:var(--color-muted);font-size:.8rem">ou</span>
                  <input class="cms-img-url-input" id="cms-blog-url" type="url" placeholder="Cole a URL da imagem">
                </div>
              </div>
              <input type="hidden" id="cms-blog-img">
              <div class="cms-blog-crop" id="cms-blog-crop" hidden>
                <label>Zoom <input id="cms-blog-crop-zoom" type="range" min="1" max="3" step=".05" value="1"></label>
                <label>Horizontal <input id="cms-blog-crop-x" type="range" min="0" max="100" value="50"></label>
                <label>Vertical <input id="cms-blog-crop-y" type="range" min="0" max="100" value="50"></label>
              </div>
            </div>
            <div class="cms-field cms-field--full">
              <label class="cms-label">Imagens adicionais do post</label>
              <div id="cms-blog-gallery-preview" class="cms-gallery"></div>
              <label class="cms-btn cms-btn--outline cms-btn--sm" style="cursor:pointer">Adicionar imagens<input type="file" id="cms-blog-gallery-file" accept="image/*" multiple style="display:none"></label>
              <input type="hidden" id="cms-blog-gallery">
            </div>
          </form>
        </div>
        <div class="cms-modal__footer">
          <button class="cms-btn cms-btn--outline" id="cms-blog-cancel">Cancelar</button>
          <button class="cms-btn cms-btn--primary" id="cms-blog-save">Salvar post</button>
        </div>
      </div>
    </div>`
}

function bindCmsBlog() {
  const search = document.getElementById('cms-blog-search')
  search?.addEventListener('input', () => {
    const q = search.value.toLowerCase()
    document.querySelectorAll('#cms-blog-table tbody tr[data-id]').forEach(row => {
      row.style.display = !q || row.dataset.name.includes(q) ? '' : 'none'
    })
  })

  document.getElementById('cms-blog-new')?.addEventListener('click', () => _cmsBlogOpenModal(null))

  document.getElementById('cms-blog-table')?.addEventListener('click', async e => {
    const editBtn = e.target.closest('[data-edit]')
    const delBtn  = e.target.closest('[data-del]')
    if (editBtn) {
      const posts = await CMS.getBlogPosts()
      const p = posts.find(x => x.id === editBtn.dataset.edit)
      if (p) _cmsBlogOpenModal(p)
    }
    if (delBtn && confirm('Excluir este post?')) {
      await CMS.deletePost(delBtn.dataset.del)
      navigate('cms-blog')
    }
  })

  document.getElementById('cms-blog-close')?.addEventListener('click',  () => _cmsCloseModal('cms-blog-overlay'))
  document.getElementById('cms-blog-cancel')?.addEventListener('click', () => _cmsCloseModal('cms-blog-overlay'))
  document.getElementById('cms-blog-overlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) _cmsCloseModal('cms-blog-overlay') })

  document.getElementById('cms-blog-file')?.addEventListener('change', async e => {
    const file = e.target.files?.[0]
    if (!file) return
    const resized = await CMS.resizeImage(await CMS.fileToDataUrl(file))
    _cmsBlogSetImg(resized)
  })
  document.getElementById('cms-blog-url')?.addEventListener('blur', e => {
    const url = e.target.value.trim()
    if (url) _cmsBlogSetImg(url)
  })
  document.querySelectorAll('#cms-blog-crop input').forEach(input => input.addEventListener('input', _cmsBlogUpdateCropPreview))
  document.getElementById('cms-blog-gallery-file')?.addEventListener('change', async e => {
    const current = JSON.parse(document.getElementById('cms-blog-gallery').value || '[]')
    for (const file of Array.from(e.target.files || [])) current.push(await CMS.resizeImage(await CMS.fileToDataUrl(file), 1600, 1200))
    _cmsBlogSetGallery(current)
  })
  document.getElementById('cms-blog-gallery-preview')?.addEventListener('click', e => {
    const button = e.target.closest('[data-gallery-remove]'); if (!button) return
    const gallery = JSON.parse(document.getElementById('cms-blog-gallery').value || '[]'); gallery.splice(Number(button.dataset.galleryRemove), 1); _cmsBlogSetGallery(gallery)
  })

  document.getElementById('cms-blog-save')?.addEventListener('click', async () => {
    if (!document.getElementById('cms-blog-form').reportValidity()) return
    const idVal = document.getElementById('cms-blog-id').value
    const title = document.getElementById('cms-blog-title').value.trim()
    await CMS.upsertPost({
      id:       idVal || null,
      title,
      slug:     title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''),
      category: document.getElementById('cms-blog-cat').value,
      date:     document.getElementById('cms-blog-date').value,
      author:   document.getElementById('cms-blog-author').value.trim() || 'Jhonny Styles',
      excerpt:  document.getElementById('cms-blog-excerpt').value.trim(),
      content:  document.getElementById('cms-blog-content').value,
      image:    document.getElementById('cms-blog-img').value || '',
      coverCropX: Number(document.getElementById('cms-blog-crop-x').value),
      coverCropY: Number(document.getElementById('cms-blog-crop-y').value),
      coverCropZoom: Number(document.getElementById('cms-blog-crop-zoom').value),
      gallery: JSON.parse(document.getElementById('cms-blog-gallery').value || '[]'),
    })
    _cmsCloseModal('cms-blog-overlay')
    navigate('cms-blog')
  })
}

function _cmsBlogOpenModal(p) {
  document.getElementById('cms-blog-modal-title').textContent = p ? 'Editar Post' : 'Novo Post'
  document.getElementById('cms-blog-id').value      = p?.id ?? ''
  document.getElementById('cms-blog-title').value   = p?.title ?? ''
  document.getElementById('cms-blog-cat').value     = p?.category ?? 'Moda'
  document.getElementById('cms-blog-date').value    = p?.date ?? new Date().toISOString().slice(0,10)
  document.getElementById('cms-blog-author').value  = p?.author ?? 'Jhonny Styles'
  document.getElementById('cms-blog-excerpt').value = p?.excerpt ?? ''
  document.getElementById('cms-blog-content').value = p?.content ?? ''
  document.getElementById('cms-blog-url').value = ''
  _cmsBlogSetImg(p?.image ?? '')
  document.getElementById('cms-blog-crop-x').value = p?.coverCropX ?? 50
  document.getElementById('cms-blog-crop-y').value = p?.coverCropY ?? 50
  document.getElementById('cms-blog-crop-zoom').value = p?.coverCropZoom ?? 1
  _cmsBlogSetGallery(p?.gallery || [])
  _cmsBlogUpdateCropPreview()
  _cmsOpenModal('cms-blog-overlay')
}

function _cmsBlogSetImg(src) {
  document.getElementById('cms-blog-img').value = src
  const preview = document.getElementById('cms-blog-img-preview')
  if (!preview) return
  if (src) {
    preview.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:6px">`
    preview.classList.remove('cms-img-preview--empty')
    document.getElementById('cms-blog-crop').hidden = false
  } else {
    preview.innerHTML = '<span>Clique ou arraste uma foto</span>'
    preview.classList.add('cms-img-preview--empty')
  }
}
function _cmsBlogUpdateCropPreview() {
  const image = document.querySelector('#cms-blog-img-preview img'); if (!image) return
  image.style.objectPosition = `${document.getElementById('cms-blog-crop-x').value}% ${document.getElementById('cms-blog-crop-y').value}%`
  image.style.transform = `scale(${document.getElementById('cms-blog-crop-zoom').value})`
}
function _cmsBlogSetGallery(gallery) {
  document.getElementById('cms-blog-gallery').value = JSON.stringify(gallery)
  const root = document.getElementById('cms-blog-gallery-preview'); if (!root) return
  root.innerHTML = gallery.map((src, index) => `<div class="cms-gallery__item"><img src="${src}" alt=""><button type="button" class="cms-gallery__del" data-gallery-remove="${index}">${UIIcons.svg('trash')}</button></div>`).join('')
}

// ── Loja Física ───────────────────────────────────────────────────
async function renderCmsLojaFisica() {
  let remote = {}
  try { remote = await CMS.getStoreContent() } catch (error) { console.error('Erro ao carregar dados da loja:', error) }
  const data = { ...CMS.getLojaFisica(), ...remote }
  const galleryItems = (data.gallery || []).map((src, i) => `
    <div class="cms-gallery__item" data-idx="${i}">
      <img src="${src}" alt="Foto ${i+1}" onerror="this.style.display='none'">
      <button class="cms-gallery__del" data-idx="${i}" title="Remover">${UIIcons.svg('trash')}</button>
    </div>`).join('')

  return `
    <div class="adm-card">
      <div class="adm-card__header">
        <h3 class="adm-card__title">Informações da Loja Física</h3>
        <span class="adm-card__subtitle">Alterações salvas ao clicar em Salvar</span>
      </div>
      <form class="adm-profile-form" id="cms-loja-form">
        <div class="adm-profile-form__field">
          <label class="adm-profile-form__label">Sobre a loja (texto institucional)</label>
          <textarea class="adm-profile-form__textarea" id="cms-loja-about" rows="4">${data.about || ''}</textarea>
        </div>
        <div class="adm-profile-form__field">
          <label class="adm-profile-form__label">Endereço</label>
          <input class="adm-profile-form__input" id="cms-loja-address" type="text" value="${data.address || ''}">
        </div>
        <div class="adm-profile-form__row adm-profile-form__row--3">
          <div class="adm-profile-form__field">
            <label class="adm-profile-form__label">Horário de funcionamento</label>
            <input class="adm-profile-form__input" id="cms-loja-hours" type="text" value="${data.hours || ''}">
          </div>
          <div class="adm-profile-form__field">
            <label class="adm-profile-form__label">Telefone</label>
            <input class="adm-profile-form__input" id="cms-loja-phone" type="text" value="${data.phone || ''}">
          </div>
          <div class="adm-profile-form__field">
            <label class="adm-profile-form__label">WhatsApp (só números)</label>
            <input class="adm-profile-form__input" id="cms-loja-whatsapp" type="text" value="${data.whatsapp || ''}" placeholder="5511999999999">
          </div>
        </div>
        <div class="adm-profile-form__field">
          <label class="adm-profile-form__label">Código do mapa (Google Maps embed &lt;iframe&gt;)</label>
          <textarea class="adm-profile-form__textarea" id="cms-loja-map" rows="3" placeholder='&lt;iframe src="https://www.google.com/maps/embed?..." ...&gt;&lt;/iframe&gt;'>${data.mapEmbed || ''}</textarea>
        </div>
        <div class="adm-profile-form__field">
          <label class="adm-profile-form__label">Galeria de fotos da loja</label>
          <div class="cms-gallery" id="cms-loja-gallery">
            ${galleryItems}
            <label class="cms-gallery__add" title="Adicionar foto" style="cursor:pointer">
              +<input type="file" id="cms-loja-gallery-input" accept="image/*" multiple style="display:none">
            </label>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end">
          <button type="button" class="cms-btn cms-btn--primary" id="cms-loja-save">Salvar alterações</button>
        </div>
      </form>
    </div>`
}

function bindCmsLojaFisica() {
  document.getElementById('cms-loja-gallery-input')?.addEventListener('change', async e => {
    const files = Array.from(e.target.files || [])
    const data  = CMS.getLojaFisica()
    data.gallery = data.gallery || []
    for (const file of files) {
      const resized = await CMS.resizeImage(await CMS.fileToDataUrl(file), 1200, 900)
      data.gallery.push(resized)
    }
    CMS.saveLojaFisica(data)
    navigate('cms-loja')
  })

  document.getElementById('cms-loja-gallery')?.addEventListener('click', e => {
    const delBtn = e.target.closest('.cms-gallery__del')
    if (!delBtn) return
    const data = CMS.getLojaFisica()
    data.gallery.splice(parseInt(delBtn.dataset.idx), 1)
    CMS.saveLojaFisica(data)
    navigate('cms-loja')
  })

  document.getElementById('cms-loja-save')?.addEventListener('click', async () => {
    const data = {
      ...CMS.getLojaFisica(),
      about:    document.getElementById('cms-loja-about').value,
      address:  document.getElementById('cms-loja-address').value,
      hours:    document.getElementById('cms-loja-hours').value,
      phone:    document.getElementById('cms-loja-phone').value,
      whatsapp: document.getElementById('cms-loja-whatsapp').value,
      mapEmbed: document.getElementById('cms-loja-map').value,
    }
    CMS.saveLojaFisica(data)
    const btn = document.getElementById('cms-loja-save')
    btn.disabled = true
    try {
      await CMS.saveStoreContent(data)
      btn.textContent = 'Salvo!'
    } catch (error) {
      Toast.show('Não foi possível salvar no site.', error.message, 'error')
      btn.textContent = 'Tentar novamente'
    }
    setTimeout(() => { btn.textContent = 'Salvar alterações'; btn.disabled = false }, 2000)
  })
}

// ── Novidades ─────────────────────────────────────────────────────
function renderCmsNovidades() {
  const data    = CMS.getNovidades()
  const allCats = ['Vestidos','Blusas','Conjuntos','Calças','Shorts','Saias','Looks','Promoções']
  const shown   = data.showCategories || []

  return `
    <div class="adm-card">
      <div class="adm-card__header">
        <h3 class="adm-card__title">Página Novidades</h3>
        <span class="adm-card__subtitle">Hero e categorias exibidas</span>
      </div>
      <form class="adm-profile-form" id="cms-nov-form">
        <div class="adm-profile-form__row">
          <div class="adm-profile-form__field">
            <label class="adm-profile-form__label">Título do hero</label>
            <input class="adm-profile-form__input" id="cms-nov-title" type="text" value="${data.heroTitle || 'Novidades'}">
          </div>
          <div class="adm-profile-form__field">
            <label class="adm-profile-form__label">Subtítulo do hero</label>
            <input class="adm-profile-form__input" id="cms-nov-subtitle" type="text" value="${data.heroSubtitle || ''}">
          </div>
        </div>
        <div class="adm-profile-form__field">
          <label class="adm-profile-form__label">Imagem de fundo do hero</label>
          <div class="cms-img-picker">
            <div class="cms-img-preview${data.heroBg ? '' : ' cms-img-preview--empty'}" id="cms-nov-img-preview">
              ${data.heroBg ? `<img src="${data.heroBg}" style="width:100%;height:100%;object-fit:cover;border-radius:6px">` : '<span>Clique ou arraste uma foto</span>'}
            </div>
            <div class="cms-img-actions">
              <label class="cms-btn cms-btn--outline cms-btn--sm" style="cursor:pointer">
                Escolher arquivo<input type="file" id="cms-nov-file" accept="image/*" style="display:none">
              </label>
              <span style="color:var(--adm-muted);font-size:.8rem">ou</span>
              <input class="adm-profile-form__input" id="cms-nov-url" type="url" value="${data.heroBg && !data.heroBg.startsWith('data:') ? data.heroBg : ''}" placeholder="Cole a URL da imagem" style="flex:1">
            </div>
          </div>
          <input type="hidden" id="cms-nov-bg" value="${data.heroBg || ''}">
        </div>
        <div class="adm-profile-form__field">
          <label class="adm-profile-form__label">Categorias visíveis na página</label>
          <div style="display:flex;flex-wrap:wrap;gap:.75rem;margin-top:.25rem">
            ${allCats.map(cat => `
              <label style="display:flex;align-items:center;gap:.4rem;cursor:pointer;font-size:.875rem;color:var(--adm-text)">
                <input type="checkbox" name="cms-nov-cat" value="${cat}" ${shown.includes(cat)?'checked':''} style="accent-color:var(--adm-primary);width:15px;height:15px">
                ${cat}
              </label>`).join('')}
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end">
          <button type="button" class="cms-btn cms-btn--primary" id="cms-nov-save">Salvar alterações</button>
        </div>
      </form>
    </div>`
}

function bindCmsNovidades() {
  document.getElementById('cms-nov-file')?.addEventListener('change', async e => {
    const file = e.target.files?.[0]
    if (!file) return
    const resized = await CMS.resizeImage(await CMS.fileToDataUrl(file), 1920, 600)
    _cmsNovSetImg(resized)
  })
  document.getElementById('cms-nov-url')?.addEventListener('blur', e => {
    const url = e.target.value.trim()
    if (url) _cmsNovSetImg(url)
  })

  document.getElementById('cms-nov-save')?.addEventListener('click', () => {
    const showCategories = Array.from(document.querySelectorAll('input[name="cms-nov-cat"]:checked')).map(el => el.value)
    CMS.saveNovidades({
      heroTitle:    document.getElementById('cms-nov-title').value,
      heroSubtitle: document.getElementById('cms-nov-subtitle').value,
      heroBg:       document.getElementById('cms-nov-bg').value,
      showCategories,
    })
    const btn = document.getElementById('cms-nov-save')
    btn.textContent = 'Salvo!'
    btn.disabled = true
    setTimeout(() => { btn.textContent = 'Salvar alterações'; btn.disabled = false }, 2000)
  })
}

function _cmsNovSetImg(src) {
  document.getElementById('cms-nov-bg').value = src
  if (!src.startsWith('data:')) document.getElementById('cms-nov-url').value = src
  const preview = document.getElementById('cms-nov-img-preview')
  if (!preview) return
  if (src) {
    preview.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:6px">`
    preview.classList.remove('cms-img-preview--empty')
  } else {
    preview.innerHTML = '<span>Clique ou arraste uma foto</span>'
    preview.classList.add('cms-img-preview--empty')
  }
}

// ── Banners ───────────────────────────────────────────────────────
function _cmsBannerParseTitleParts(titleHtml) {
  const [main, ...rest] = (titleHtml || '').split('<br>')
  const italic = (rest.join('<br>') || '').replace(/<\/?em>/g, '')
  return { main: main || '', italic }
}

function renderCmsBanners() {
  const banners = CMS.getBanners()

  const cards = banners.map(b => {
    const { main, italic } = _cmsBannerParseTitleParts(b.title)
    return `
    <div class="cms-banner-card" data-id="${b.id}">
      <div class="cms-banner-card__preview">
        ${b.image
          ? `<img src="${b.image}" alt="${main}" onerror="this.style.display='none'">`
          : '<div class="cms-banner-card__no-img">Sem imagem</div>'
        }
        <div class="cms-banner-card__overlay">
          <span class="cms-banner-card__handle">${b.handle || ''}</span>
          <span class="cms-banner-card__sub">${b.subtitle || ''}</span>
          <span class="cms-banner-card__title">${main}${italic ? `<br><em>${italic}</em>` : ''}</span>
        </div>
      </div>
      <div class="cms-banner-card__footer">
        <span class="cms-banner-card__label">${b.btnText || 'Ver Coleção'} ${UIIcons.svg('arrowRight')} ${b.link || ''}</span>
        <div class="cms-banner-card__actions">
          <button class="cms-icon-btn" data-edit="${b.id}" title="Editar">✏️</button>
          <button class="cms-icon-btn cms-icon-btn--danger" data-del="${b.id}" title="Excluir">🗑</button>
        </div>
      </div>
    </div>`
  }).join('')

  return `
    <div class="cms-toolbar">
      <span style="font-size:.85rem;color:var(--adm-muted)">${banners.length} banner${banners.length !== 1 ? 's' : ''} ativo${banners.length !== 1 ? 's' : ''}</span>
      <button class="cms-btn cms-btn--primary" id="cms-banner-new">+ Novo Banner</button>
    </div>
    <div class="cms-banner-grid" id="cms-banner-grid">
      ${cards || '<div style="color:var(--adm-muted);padding:2rem">Nenhum banner cadastrado.</div>'}
    </div>

    <div class="cms-modal-overlay" id="cms-banner-overlay" style="display:none">
      <div class="cms-modal" style="max-width:600px">
        <div class="cms-modal__header">
          <span id="cms-banner-modal-title">Novo Banner</span>
          <button class="cms-modal__close" id="cms-banner-close">${UIIcons.svg('x')}</button>
        </div>
        <div class="cms-modal__body">
          <form class="cms-form" id="cms-banner-form">
            <input type="hidden" id="cms-banner-id">
            <div class="cms-field cms-field--full">
              <label class="cms-label">Imagem de fundo</label>
              <div class="cms-img-picker">
                <div class="cms-img-preview cms-img-preview--empty" id="cms-banner-img-preview">
                  <span>Clique ou arraste uma foto</span>
                </div>
                <div class="cms-img-actions">
                  <label class="cms-btn cms-btn--outline cms-btn--sm" style="cursor:pointer">
                    Escolher arquivo<input type="file" id="cms-banner-file" accept="image/*" style="display:none">
                  </label>
                  <span style="color:var(--adm-muted);font-size:.8rem">ou</span>
                  <input class="cms-img-url-input" id="cms-banner-url" type="url" placeholder="Cole a URL da imagem">
                </div>
              </div>
              <input type="hidden" id="cms-banner-img">
            </div>
            <div class="cms-form-row">
              <div class="cms-field">
                <label class="cms-label">Handle</label>
                <input class="cms-input" id="cms-banner-handle" type="text" placeholder="@jhonnystylos">
              </div>
              <div class="cms-field">
                <label class="cms-label">Subtítulo</label>
                <input class="cms-input" id="cms-banner-subtitle" type="text" placeholder="Nova coleção chegou!">
              </div>
            </div>
            <div class="cms-form-row">
              <div class="cms-field">
                <label class="cms-label">Título — linha normal</label>
                <input class="cms-input" id="cms-banner-title-main" type="text" placeholder="Looks">
              </div>
              <div class="cms-field">
                <label class="cms-label">Título — linha em itálico</label>
                <input class="cms-input" id="cms-banner-title-italic" type="text" placeholder="Exclusivos">
              </div>
            </div>
            <div class="cms-form-row">
              <div class="cms-field">
                <label class="cms-label">Texto do botão</label>
                <input class="cms-input" id="cms-banner-btn-text" type="text" placeholder="Ver Coleção">
              </div>
              <div class="cms-field">
                <label class="cms-label">Link do botão</label>
                <input class="cms-input" id="cms-banner-link" type="text" placeholder="shop.html">
              </div>
            </div>
          </form>
        </div>
        <div class="cms-modal__footer">
          <button class="cms-btn cms-btn--outline" id="cms-banner-cancel">Cancelar</button>
          <button class="cms-btn cms-btn--primary" id="cms-banner-save">Salvar banner</button>
        </div>
      </div>
    </div>`
}

function bindCmsBanners() {
  document.getElementById('cms-banner-new')?.addEventListener('click', () => _cmsBannerOpenModal(null))

  document.getElementById('cms-banner-grid')?.addEventListener('click', e => {
    const editBtn = e.target.closest('[data-edit]')
    const delBtn  = e.target.closest('[data-del]')
    if (editBtn) {
      const b = CMS.getBanners().find(x => x.id === parseInt(editBtn.dataset.edit))
      if (b) _cmsBannerOpenModal(b)
    }
    if (delBtn && confirm('Excluir este banner?')) {
      CMS.saveBanners(CMS.getBanners().filter(x => x.id !== parseInt(delBtn.dataset.del)))
      navigate('cms-banners')
    }
  })

  document.getElementById('cms-banner-close')?.addEventListener('click',  () => _cmsCloseModal('cms-banner-overlay'))
  document.getElementById('cms-banner-cancel')?.addEventListener('click', () => _cmsCloseModal('cms-banner-overlay'))
  document.getElementById('cms-banner-overlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) _cmsCloseModal('cms-banner-overlay') })

  document.getElementById('cms-banner-file')?.addEventListener('change', async e => {
    const file = e.target.files?.[0]
    if (!file) return
    const resized = await CMS.resizeImage(await CMS.fileToDataUrl(file), 1920, 800)
    _cmsBannerSetImg(resized)
  })
  document.getElementById('cms-banner-url')?.addEventListener('blur', e => {
    const url = e.target.value.trim()
    if (url) _cmsBannerSetImg(url)
  })

  document.getElementById('cms-banner-save')?.addEventListener('click', () => {
    const idVal       = document.getElementById('cms-banner-id').value
    const titleMain   = document.getElementById('cms-banner-title-main').value.trim()
    const titleItalic = document.getElementById('cms-banner-title-italic').value.trim()
    const banner = {
      id:       idVal ? parseInt(idVal) : null,
      image:    document.getElementById('cms-banner-img').value || '',
      handle:   document.getElementById('cms-banner-handle').value.trim(),
      subtitle: document.getElementById('cms-banner-subtitle').value.trim(),
      title:    titleItalic ? `${titleMain}<br><em>${titleItalic}</em>` : titleMain,
      btnText:  document.getElementById('cms-banner-btn-text').value.trim() || 'Ver Coleção',
      link:     document.getElementById('cms-banner-link').value.trim() || 'shop.html',
    }
    const arr = CMS.getBanners()
    const idx = arr.findIndex(x => x.id === banner.id)
    if (idx >= 0) arr[idx] = banner
    else arr.push({ ...banner, id: CMS._newId(arr) })
    CMS.saveBanners(arr)
    _cmsCloseModal('cms-banner-overlay')
    navigate('cms-banners')
  })
}

function _cmsBannerOpenModal(b) {
  const { main, italic } = _cmsBannerParseTitleParts(b?.title)
  document.getElementById('cms-banner-modal-title').textContent   = b ? 'Editar Banner' : 'Novo Banner'
  document.getElementById('cms-banner-id').value                  = b?.id ?? ''
  document.getElementById('cms-banner-handle').value              = b?.handle ?? '@jhonnystylos'
  document.getElementById('cms-banner-subtitle').value            = b?.subtitle ?? ''
  document.getElementById('cms-banner-title-main').value          = main
  document.getElementById('cms-banner-title-italic').value        = italic
  document.getElementById('cms-banner-btn-text').value            = b?.btnText ?? 'Ver Coleção'
  document.getElementById('cms-banner-link').value                = b?.link ?? 'shop.html'
  document.getElementById('cms-banner-url').value = ''
  _cmsBannerSetImg(b?.image ?? '')
  _cmsOpenModal('cms-banner-overlay')
}

function _cmsBannerSetImg(src) {
  document.getElementById('cms-banner-img').value = src
  const preview = document.getElementById('cms-banner-img-preview')
  if (!preview) return
  if (src) {
    preview.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:6px">`
    preview.classList.remove('cms-img-preview--empty')
  } else {
    preview.innerHTML = '<span>Clique ou arraste uma foto</span>'
    preview.classList.add('cms-img-preview--empty')
  }
}

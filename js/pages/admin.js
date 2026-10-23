// ── Mock Data ─────────────────────────────────────────────────────
const ADMIN_CUSTOMERS = [
  { id:  1, name: 'Ana Paula Ferreira',  email: 'ana.ferreira@gmail.com',   phone: '(11) 98765-4321', city: 'São Paulo - SP',      total: 847.60,  orders: 5, since: 'Mar/2024', last: '05/06/2026' },
  { id:  2, name: 'Beatriz Oliveira',    email: 'bea.oliveira@hotmail.com',  phone: '(21) 97654-3210', city: 'Rio de Janeiro - RJ',  total: 429.80,  orders: 3, since: 'Abr/2024', last: '03/06/2026' },
  { id:  3, name: 'Carla Mendes',        email: 'carla.mendes@gmail.com',    phone: '(31) 96543-2109', city: 'Belo Horizonte - MG', total: 1120.50, orders: 8, since: 'Jan/2024', last: '07/06/2026' },
  { id:  4, name: 'Daniela Souza',       email: 'dani.souza@yahoo.com',      phone: '(41) 95432-1098', city: 'Curitiba - PR',       total: 299.90,  orders: 2, since: 'Mai/2024', last: '01/06/2026' },
  { id:  5, name: 'Eliane Costa',        email: 'eliane.costa@outlook.com',  phone: '(51) 94321-0987', city: 'Porto Alegre - RS',   total: 674.70,  orders: 4, since: 'Fev/2024', last: '06/06/2026' },
  { id:  6, name: 'Fernanda Lima',       email: 'fe.lima@gmail.com',         phone: '(85) 93210-9876', city: 'Fortaleza - CE',      total: 189.90,  orders: 1, since: 'Jun/2024', last: '04/06/2026' },
  { id:  7, name: 'Gabriela Alves',      email: 'gabi.alves@gmail.com',      phone: '(71) 92109-8765', city: 'Salvador - BA',       total: 959.60,  orders: 6, since: 'Jan/2024', last: '02/06/2026' },
  { id:  8, name: 'Helena Rocha',        email: 'helena.rocha@email.com',    phone: '(62) 91098-7654', city: 'Goiânia - GO',        total: 339.80,  orders: 2, since: 'Abr/2024', last: '31/05/2026' },
  { id:  9, name: 'Isabela Martins',     email: 'isa.martins@gmail.com',     phone: '(92) 90987-6543', city: 'Manaus - AM',         total: 229.90,  orders: 1, since: 'Mai/2024', last: '30/05/2026' },
  { id: 10, name: 'Juliana Pereira',     email: 'juli.pereira@hotmail.com',  phone: '(81) 89876-5432', city: 'Recife - PE',         total: 789.50,  orders: 5, since: 'Fev/2024', last: '08/06/2026' },
  { id: 11, name: 'Karen Santos',        email: 'karen.santos@gmail.com',    phone: '(48) 88765-4321', city: 'Florianópolis - SC',  total: 499.70,  orders: 3, since: 'Mar/2024', last: '29/05/2026' },
  { id: 12, name: 'Larissa Cardoso',     email: 'lari.cardoso@yahoo.com',    phone: '(11) 87654-3210', city: 'Campinas - SP',       total: 1340.80, orders: 9, since: 'Dez/2023', last: '07/06/2026' },
  { id: 13, name: 'Mariana Ribeiro',     email: 'mari.ribeiro@gmail.com',    phone: '(21) 86543-2109', city: 'Niterói - RJ',        total: 259.90,  orders: 2, since: 'Jun/2024', last: '28/05/2026' },
  { id: 14, name: 'Natália Gomes',       email: 'nati.gomes@email.com',      phone: '(31) 85432-1098', city: 'Uberlândia - MG',     total: 614.80,  orders: 4, since: 'Mar/2024', last: '05/06/2026' },
  { id: 15, name: 'Priscila Torres',     email: 'pri.torres@gmail.com',      phone: '(11) 84321-0987', city: 'São Paulo - SP',      total: 389.80,  orders: 2, since: 'Abr/2024', last: '04/06/2026' },
]

const ADMIN_ORDERS = [
  { id: 'JS0052', customer: 'Carla Mendes',         item: 'Vestido Rodado Festa',      qty: 1, total: 229.90, status: 'enviado',      date: '07/06/2026', payment: 'PIX'    },
  { id: 'JS0051', customer: 'Juliana Pereira',       item: 'Conjunto Premium',          qty: 1, total: 199.90, status: 'processando',  date: '07/06/2026', payment: 'Cartão' },
  { id: 'JS0050', customer: 'Larissa Cardoso',       item: 'Vestido Midi Florido',      qty: 2, total: 339.80, status: 'entregue',     date: '06/06/2026', payment: 'PIX'    },
  { id: 'JS0049', customer: 'Eliane Costa',          item: 'Blusa Social Feminina',     qty: 1, total:  89.90, status: 'entregue',     date: '06/06/2026', payment: 'PIX'    },
  { id: 'JS0048', customer: 'Ana Paula Ferreira',    item: 'Calça Alfaiataria Premium', qty: 1, total: 119.90, status: 'entregue',     date: '05/06/2026', payment: 'Boleto' },
  { id: 'JS0047', customer: 'Natália Gomes',         item: 'Vestido Longo Decote',      qty: 1, total: 189.90, status: 'entregue',     date: '05/06/2026', payment: 'Cartão' },
  { id: 'JS0046', customer: 'Fernanda Lima',         item: 'Vestido Longo Decote',      qty: 1, total: 189.90, status: 'entregue',     date: '04/06/2026', payment: 'PIX'    },
  { id: 'JS0045', customer: 'Priscila Torres',       item: 'Conjunto Elegante',         qty: 1, total: 159.90, status: 'entregue',     date: '04/06/2026', payment: 'PIX'    },
  { id: 'JS0044', customer: 'Beatriz Oliveira',      item: 'Short Elegante',            qty: 2, total: 159.80, status: 'entregue',     date: '03/06/2026', payment: 'Cartão' },
  { id: 'JS0043', customer: 'Gabriela Alves',        item: 'Blusa Cropped Exclusiva',   qty: 1, total:  74.90, status: 'entregue',     date: '02/06/2026', payment: 'PIX'    },
  { id: 'JS0042', customer: 'Helena Rocha',          item: 'Look Social Moderno',       qty: 1, total: 134.90, status: 'entregue',     date: '01/06/2026', payment: 'PIX'    },
  { id: 'JS0041', customer: 'Daniela Souza',         item: 'Calça Pantalona',           qty: 1, total: 109.90, status: 'entregue',     date: '31/05/2026', payment: 'Boleto' },
  { id: 'JS0040', customer: 'Karen Santos',          item: 'Saia Midi Social',          qty: 1, total:  99.90, status: 'cancelado',    date: '30/05/2026', payment: 'PIX'    },
  { id: 'JS0039', customer: 'Isabela Martins',       item: 'Vestido Rodado Festa',      qty: 1, total: 229.90, status: 'entregue',     date: '30/05/2026', payment: 'Cartão' },
  { id: 'JS0038', customer: 'Mariana Ribeiro',       item: 'Conjunto Elegante',         qty: 1, total: 159.90, status: 'entregue',     date: '29/05/2026', payment: 'PIX'    },
  { id: 'JS0037', customer: 'Larissa Cardoso',       item: 'Vestido Midi Florido',      qty: 1, total: 169.90, status: 'entregue',     date: '28/05/2026', payment: 'Cartão' },
  { id: 'JS0036', customer: 'Ana Paula Ferreira',    item: 'Conjunto Premium',          qty: 1, total: 199.90, status: 'pendente',     date: '08/06/2026', payment: 'Boleto' },
  { id: 'JS0035', customer: 'Juliana Pereira',       item: 'Blusa Social Feminina',     qty: 2, total: 179.80, status: 'pendente',     date: '08/06/2026', payment: 'PIX'    },
  { id: 'JS0034', customer: 'Gabriela Alves',        item: 'Vestido Longo Decote',      qty: 1, total: 189.90, status: 'enviado',      date: '06/06/2026', payment: 'Cartão' },
  { id: 'JS0033', customer: 'Eliane Costa',          item: 'Calça Alfaiataria Premium', qty: 2, total: 239.80, status: 'enviado',      date: '05/06/2026', payment: 'PIX'    },
]

const ADMIN_SUPPLIERS = [
  { id: 1, name: 'Moda Brasil Atacado',  contact: 'Carlos Silva',   phone: '(11) 3456-7890', email: 'contato@modabrasil.com.br',   categories: 'Vestidos, Saias',   terms: '30 dias', status: 'ativo'   },
  { id: 2, name: 'Fashion SP Indústria', contact: 'Roberta Pinto',  phone: '(11) 2345-6789', email: 'vendas@fashionsp.com.br',     categories: 'Conjuntos, Blusas', terms: '45 dias', status: 'ativo'   },
  { id: 3, name: 'Elegance Co.',         contact: 'Paulo Monteiro', phone: '(41) 3321-4567', email: 'comercial@elegance.com.br',   categories: 'Calças, Shorts',    terms: '30 dias', status: 'ativo'   },
  { id: 4, name: 'Top Modas Ltda.',      contact: 'Sandra Rocha',   phone: '(21) 3210-9876', email: 'sandra@topmodas.com.br',      categories: 'Blusas, Tops',      terms: '15 dias', status: 'ativo'   },
  { id: 5, name: 'Chic Atacarejo',       contact: 'Marcos Lima',    phone: '(85) 3109-8765', email: 'marcos@chicatac.com.br',      categories: 'Looks, Vestidos',   terms: '30 dias', status: 'inativo' },
  { id: 6, name: 'Trend Factory',        contact: 'Luciana Vaz',    phone: '(31) 3098-7654', email: 'luciana@trendfactory.com.br', categories: 'Conjuntos',         terms: '60 dias', status: 'ativo'   },
]

const ADMIN_STAFF = [
  { id: 1, name: 'Jhonny Lima',      role: 'Administrador', email: 'jhonny@jhonnystylos.com', phone: '(11) 99999-0001', since: 'Jan/2022', status: 'ativo' },
  { id: 2, name: 'Shelly Lopes',     role: 'Administradora',email: 'shelly@jhonnystylos.com', phone: '(11) 99999-0002', since: 'Fev/2022', status: 'ativo' },
  { id: 3, name: 'Marcia Souza',     role: 'Vendedora',     email: 'marcia@jhonnystylos.com', phone: '(11) 99999-0003', since: 'Mar/2023', status: 'ativo' },
  { id: 4, name: 'Tatiane Ferreira', role: 'Atendimento',   email: 'tati@jhonnystylos.com',   phone: '(11) 99999-0004', since: 'Jun/2023', status: 'ativo' },
  { id: 5, name: 'Renata Borges',    role: 'Estoque',       email: 'renata@jhonnystylos.com', phone: '(11) 99999-0005', since: 'Set/2023', status: 'ativo' },
  { id: 6, name: 'Paulo Almeida',    role: 'Entregador',    email: 'paulo@jhonnystylos.com',  phone: '(11) 99999-0006', since: 'Jan/2024', status: 'ativo' },
]

const ADMIN_PAYMENTS = [
  { id: 'PAY052', order: 'JS0052', customer: 'Carla Mendes',       amount: 229.90, method: 'PIX',    status: 'aprovado',  date: '07/06/2026' },
  { id: 'PAY051', order: 'JS0051', customer: 'Juliana Pereira',    amount: 199.90, method: 'Cartão', status: 'aprovado',  date: '07/06/2026' },
  { id: 'PAY050', order: 'JS0050', customer: 'Larissa Cardoso',    amount: 339.80, method: 'PIX',    status: 'aprovado',  date: '06/06/2026' },
  { id: 'PAY049', order: 'JS0049', customer: 'Eliane Costa',       amount:  89.90, method: 'PIX',    status: 'aprovado',  date: '06/06/2026' },
  { id: 'PAY048', order: 'JS0048', customer: 'Ana P. Ferreira',    amount: 119.90, method: 'Boleto', status: 'aprovado',  date: '05/06/2026' },
  { id: 'PAY047', order: 'JS0047', customer: 'Natália Gomes',      amount: 189.90, method: 'Cartão', status: 'aprovado',  date: '05/06/2026' },
  { id: 'PAY046', order: 'JS0046', customer: 'Fernanda Lima',      amount: 189.90, method: 'PIX',    status: 'aprovado',  date: '04/06/2026' },
  { id: 'PAY045', order: 'JS0045', customer: 'Priscila Torres',    amount: 159.90, method: 'PIX',    status: 'aprovado',  date: '04/06/2026' },
  { id: 'PAY044', order: 'JS0044', customer: 'Beatriz Oliveira',   amount: 159.80, method: 'Cartão', status: 'aprovado',  date: '03/06/2026' },
  { id: 'PAY043', order: 'JS0043', customer: 'Gabriela Alves',     amount:  74.90, method: 'PIX',    status: 'aprovado',  date: '02/06/2026' },
  { id: 'PAY040', order: 'JS0040', customer: 'Karen Santos',       amount:  99.90, method: 'PIX',    status: 'cancelado', date: '30/05/2026' },
  { id: 'PAY036', order: 'JS0036', customer: 'Ana P. Ferreira',    amount: 199.90, method: 'Boleto', status: 'pendente',  date: '08/06/2026' },
  { id: 'PAY035', order: 'JS0035', customer: 'Juliana Pereira',    amount: 179.80, method: 'PIX',    status: 'pendente',  date: '08/06/2026' },
]

const STOCK_QTYS = [45, 12, 28, 3, 67, 34, 8, 52, 19, 71, 23, 15]
const STOCK_SUPS = ['Moda Brasil Atacado', 'Fashion SP Indústria', 'Elegance Co.', 'Top Modas Ltda.', 'Trend Factory', 'Fashion SP Indústria']
const ADMIN_STOCK = (typeof MOCK_PRODUCTS !== 'undefined' ? MOCK_PRODUCTS : []).map((p, i) => ({
  ...p,
  stock: STOCK_QTYS[i] ?? 20,
  min_stock: 10,
  supplier: STOCK_SUPS[i % STOCK_SUPS.length],
  cost: +(p.price * 0.45).toFixed(2),
}))

const PERIOD_DATA = {
  semana: {
    receita: 3240.50, pedidos: 18, clientes_novos: 7, ticket_medio: 180.03,
    var_receita: 12.4, var_pedidos: 8.2, var_clientes: 16.7,
    despesas: 890.00, lucro: 2350.50,
    chart_labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    chart_receita: [380, 420, 510, 290, 680, 590, 370],
    spark_receita: [320, 380, 420, 290, 510, 590, 370],
    spark_pedidos: [2, 3, 3, 2, 4, 4, 1],
    spark_clientes: [1, 1, 2, 0, 1, 2, 1],
    pix_pct: 58, cartao_pct: 32, boleto_pct: 10,
    receita_prev: 2879.00, pedidos_prev: 17,
  },
  mes: {
    receita: 14820.70, pedidos: 87, clientes_novos: 34, ticket_medio: 170.35,
    var_receita: 18.7, var_pedidos: 15.3, var_clientes: 22.1,
    despesas: 4200.00, lucro: 10620.70,
    chart_labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    chart_receita: [3200, 4100, 3890, 3630],
    spark_receita: [3200, 4100, 3890, 3630],
    spark_pedidos: [19, 25, 22, 21],
    spark_clientes: [8, 10, 9, 7],
    pix_pct: 55, cartao_pct: 35, boleto_pct: 10,
    receita_prev: 12479.00, pedidos_prev: 76,
  },
  ano: {
    receita: 187340.20, pedidos: 1043, clientes_novos: 412, ticket_medio: 179.62,
    var_receita: 24.1, var_pedidos: 19.8, var_clientes: 31.5,
    despesas: 54200.00, lucro: 133140.20,
    chart_labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
    chart_receita: [12400,14200,15800,13900,16200,17800,15400,18200,16900,19400,17600,9540],
    spark_receita: [12400,14200,15800,13900,16200,17800,15400,18200,16900,19400,17600,9540],
    spark_pedidos: [72,84,91,80,95,103,88,106,97,114,103,10],
    spark_clientes: [22,28,35,31,40,48,38,52,44,58,45,12],
    pix_pct: 52, cartao_pct: 38, boleto_pct: 10,
    receita_prev: 150960.00, pedidos_prev: 870,
  },
}

// ── Helpers ───────────────────────────────────────────────────────
function fmt(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }

function trend(v) {
  const cls = v >= 0 ? 'up' : 'down'
  return `<span class="adm-trend adm-trend--${cls}">${v >= 0 ? '↑' : '↓'} ${Math.abs(v).toFixed(1)}%</span>`
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
function renderDashboard(period) {
  const d = PERIOD_DATA[period]
  const products = typeof MOCK_PRODUCTS !== 'undefined' ? MOCK_PRODUCTS : []
  const lowStock = ADMIN_STOCK.filter(s => s.stock <= s.min_stock)
  const statusCounts = ADMIN_ORDERS.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})
  const topProducts = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4)
  const donutSegments = [
    { label: 'Entregue',     value: statusCounts.entregue    || 0, color: '#16a34a' },
    { label: 'Enviado',      value: statusCounts.enviado      || 0, color: '#2563eb' },
    { label: 'Processando',  value: statusCounts.processando  || 0, color: '#d97706' },
    { label: 'Pendente',     value: statusCounts.pendente     || 0, color: '#9b3b48' },
    { label: 'Cancelado',    value: statusCounts.cancelado    || 0, color: '#9ca3af' },
  ]
  const entregaTaxa = Math.round(((statusCounts.entregue || 0) / ADMIN_ORDERS.length) * 100)
  const cancelTaxa  = Math.round(((statusCounts.cancelado || 0) / ADMIN_ORDERS.length) * 100)
  const stockOk = Math.round(((ADMIN_STOCK.length - lowStock.length) / ADMIN_STOCK.length) * 100)

  return `
  <div class="adm-kpi-grid">
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
      <div class="adm-kpi__body">
        <p class="adm-kpi__label">Receita Total</p>
        <p class="adm-kpi__value">${fmt(d.receita)}</p>
        <p class="adm-kpi__sub">${trend(d.var_receita)} vs anterior</p>
      </div>
      <div class="adm-kpi__spark">${renderSparkline(d.spark_receita, '#e8798c')}</div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
      <div class="adm-kpi__body">
        <p class="adm-kpi__label">Pedidos</p>
        <p class="adm-kpi__value">${d.pedidos}</p>
        <p class="adm-kpi__sub">${trend(d.var_pedidos)} vs anterior</p>
      </div>
      <div class="adm-kpi__spark">${renderSparkline(d.spark_pedidos, '#e8798c')}</div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
      <div class="adm-kpi__body">
        <p class="adm-kpi__label">Clientes Novos</p>
        <p class="adm-kpi__value">${d.clientes_novos}</p>
        <p class="adm-kpi__sub">${trend(d.var_clientes)} vs anterior</p>
      </div>
      <div class="adm-kpi__spark">${renderSparkline(d.spark_clientes, '#3b82f6')}</div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--${lowStock.length > 0 ? 'warn' : '4'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
      <div class="adm-kpi__body">
        <p class="adm-kpi__label">Estoque Crítico</p>
        <p class="adm-kpi__value">${lowStock.length} itens</p>
        <p class="adm-kpi__sub${lowStock.length > 0 ? ' adm-kpi__sub--warn' : ''}">${lowStock.length > 0 ? '⚠️ Reposição necessária' : '✓ Estoque saudável'}</p>
      </div>
    </div>
  </div>

  <div class="adm-row adm-row--wide">
    <div class="adm-card">
      <div class="adm-card__header">
        <h3 class="adm-card__title">Receita — Evolução do Período</h3>
        <span class="adm-card__subtitle">${fmt(d.receita)} total</span>
      </div>
      <div class="adm-chart-wrap">${renderAreaChart(d.chart_receita, d.chart_labels, '#e8798c', 'dash')}</div>
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Status dos Pedidos</h3></div>
      ${renderDonutChart(donutSegments, 130, ADMIN_ORDERS.length.toString())}
    </div>
  </div>

  <div class="adm-row">
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Top Produtos</h3></div>
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
        ${renderRingChart(entregaTaxa, '#16a34a', 'Entregas', 'taxa de sucesso')}
        ${renderRingChart(stockOk, '#2563eb', 'Estoque OK', 'produtos normais')}
        ${renderRingChart(100 - cancelTaxa, '#e8798c', 'Retenção', 'pedidos válidos')}
      </div>
    </div>
  </div>`
}

// ── Section: Vendas ───────────────────────────────────────────────
function renderVendas(period) {
  const d = PERIOD_DATA[period]
  const products = typeof MOCK_PRODUCTS !== 'undefined' ? MOCK_PRODUCTS : []
  const catTotals = {}
  ADMIN_ORDERS.forEach(o => {
    const p = products.find(x => x.name === o.item)
    if (p) catTotals[p.category] = (catTotals[p.category] || 0) + o.total
  })
  const catEntries = Object.entries(catTotals).sort((a, b) => b[1] - a[1])
  const catMax = Math.max(...catEntries.map(([, v]) => v)) || 1
  const donutColors = ['#ffbdc6','#e8798c', '#3b82f6', '#16a34a', '#d97706', '#9b3b48']
  const catSegments = catEntries.map(([cat, val], i) => ({ label: cat, value: Math.round(val), color: donutColors[i % donutColors.length] }))

  return `
  <div class="adm-kpi-grid">
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Receita</p><p class="adm-kpi__value">${fmt(d.receita)}</p><p class="adm-kpi__sub">${trend(d.var_receita)} vs anterior</p></div>
      <div class="adm-kpi__spark">${renderSparkline(d.spark_receita, '#e8798c')}</div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Pedidos</p><p class="adm-kpi__value">${d.pedidos}</p><p class="adm-kpi__sub">${trend(d.var_pedidos)} vs anterior</p></div>
      <div class="adm-kpi__spark">${renderSparkline(d.spark_pedidos, '#e8798c')}</div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Ticket Médio</p><p class="adm-kpi__value">${fmt(d.ticket_medio)}</p><p class="adm-kpi__sub">por pedido</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Clientes Novos</p><p class="adm-kpi__value">${d.clientes_novos}</p><p class="adm-kpi__sub">${trend(d.var_clientes)} vs anterior</p></div>
      <div class="adm-kpi__spark">${renderSparkline(d.spark_clientes, '#3b82f6')}</div>
    </div>
  </div>

  <div class="adm-compare-grid">
    ${[['Receita', fmt(d.receita), fmt(d.receita_prev)], ['Pedidos', d.pedidos, d.pedidos_prev],
       ['Ticket Médio', fmt(d.ticket_medio), '—'], ['Clientes Novos', d.clientes_novos, '—']].map(([l, now, prev]) => `
      <div class="adm-compare-card">
        <p class="adm-compare-card__label">${l}</p>
        <p class="adm-compare-card__now">${now}</p>
        <p class="adm-compare-card__prev">Anterior: ${prev}</p>
      </div>`).join('')}
  </div>

  <div class="adm-row">
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Evolução de Vendas</h3></div>
      <div class="adm-chart-wrap">${renderAreaChart(d.chart_receita, d.chart_labels, '#e8798c', 'vend')}</div>
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Distribuição por Categoria</h3></div>
      ${renderDonutChart(catSegments, 130)}
    </div>
  </div>

  <div class="adm-card">
    <div class="adm-card__header"><h3 class="adm-card__title">Performance por Produto</h3></div>
    <table class="adm-table">
      <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Avaliação</th><th>Popularidade</th><th>Promoção</th></tr></thead>
      <tbody>
        ${[...products].sort((a, b) => b.reviews - a.reviews).map(p => {
          const pct = Math.round((p.reviews / 60) * 100)
          return `<tr>
            <td>${p.name}</td>
            <td><span class="adm-cat-tag">${p.category}</span></td>
            <td class="adm-mono">${fmt(p.price)}</td>
            <td>★ ${p.rating} (${p.reviews})</td>
            <td><div class="adm-stock-cell"><div class="adm-stock-bar-track"><div class="adm-stock-bar-fill" style="width:${pct}%;background:#ffbdc6"></div></div><span class="adm-stock-num">${p.reviews}</span></div></td>
            <td>${p.isSale ? badge('ativo') : '—'}</td>
          </tr>`
        }).join('')}
      </tbody>
    </table>
  </div>`
}

// ── Section: Financeiro ───────────────────────────────────────────
function renderFinanceiro(period) {
  const d = PERIOD_DATA[period]
  const margem = ((d.lucro / d.receita) * 100).toFixed(1)
  const despArr = d.chart_receita.map(v => Math.round(v * 0.27))

  return `
  <div class="adm-kpi-grid">
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Receita</p><p class="adm-kpi__value">${fmt(d.receita)}</p><p class="adm-kpi__sub">${trend(d.var_receita)} vs anterior</p></div>
      <div class="adm-kpi__spark">${renderSparkline(d.spark_receita, '#e8798c')}</div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Despesas</p><p class="adm-kpi__value">${fmt(d.despesas)}</p><p class="adm-kpi__sub">estoque + operação</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Lucro Líquido</p><p class="adm-kpi__value">${fmt(d.lucro)}</p><p class="adm-kpi__sub">margem de ${margem}%</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Ticket Médio</p><p class="adm-kpi__value">${fmt(d.ticket_medio)}</p><p class="adm-kpi__sub">por pedido</p></div>
    </div>
  </div>

  <div class="adm-card">
    <div class="adm-card__header">
      <h3 class="adm-card__title">Receita vs Despesas</h3>
      <div style="display:flex;gap:16px;font-size:.75rem;align-items:center">
        <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:3px;background:#ffbdc6;border-radius:2px;display:inline-block"></span>Receita</span>
        <span style="display:flex;align-items:center;gap:5px"><span style="width:12px;height:3px;background:#d97706;border-radius:2px;display:inline-block;border-top:2px dashed #d97706"></span>Despesas</span>
      </div>
    </div>
    <div class="adm-chart-wrap">${renderDualAreaChart(d.chart_receita, despArr, d.chart_labels)}</div>
  </div>

  <div class="adm-row adm-row--thirds">
    <div class="adm-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
      <h3 class="adm-card__title" style="align-self:flex-start">Margem de Lucro</h3>
      ${renderRingChart(Math.round(+margem), '#16a34a', 'Margem líquida', `${fmt(d.lucro)}`, 110)}
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Métodos de Pagamento</h3></div>
      ${renderDonutChart([
        { label: 'PIX',    value: d.pix_pct,    color: '#00c4b4' },
        { label: 'Cartão', value: d.cartao_pct, color: '#ffbdc6' },
        { label: 'Boleto', value: d.boleto_pct, color: '#d97706' },
      ], 120)}
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Resumo</h3></div>
      <div class="adm-fin-summary">
        <div class="adm-fin-row"><span>Receita Bruta</span><strong>${fmt(d.receita)}</strong></div>
        <div class="adm-fin-row"><span>(−) Despesas</span><strong class="adm-red">(${fmt(d.despesas)})</strong></div>
        <div class="adm-fin-row adm-fin-row--total"><span>Lucro Líquido</span><strong class="adm-green">${fmt(d.lucro)}</strong></div>
      </div>
      <div class="adm-pay-methods" style="margin-top:20px">
        ${[['PIX','pix',d.pix_pct],['Cartão','cartao',d.cartao_pct],['Boleto','boleto',d.boleto_pct]].map(([l,k,v]) => `
        <div class="adm-pay-method">
          <div class="adm-pay-method__label"><span class="adm-pay-dot adm-pay-dot--${k}"></span>${l}</div>
          <div class="adm-pay-bar-track"><div class="adm-pay-bar-fill adm-pay-bar-fill--${k}" style="width:${v}%"></div></div>
          <span class="adm-pay-pct">${v}%</span>
        </div>`).join('')}
      </div>
    </div>
  </div>`
}

// ── Section: Estoque ──────────────────────────────────────────────
function renderEstoque() {
  const low = ADMIN_STOCK.filter(s => s.stock <= s.min_stock)
  const total = ADMIN_STOCK.reduce((a, s) => a + s.stock, 0)
  const val   = ADMIN_STOCK.reduce((a, s) => a + s.stock * s.cost, 0)
  const catTot = {}
  ADMIN_STOCK.forEach(s => { catTot[s.category] = (catTot[s.category] || 0) + s.stock })
  const catArr = Object.entries(catTot).sort((a, b) => b[1] - a[1])
  const catMax = Math.max(...catArr.map(([,v]) => v)) || 1
  const catColors = ['#ffbdc6','#e8798c','#3b82f6','#16a34a','#d97706','#9b3b48']

  return `
  <div class="adm-kpi-grid">
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Total em Estoque</p><p class="adm-kpi__value">${total} unid.</p><p class="adm-kpi__sub">${ADMIN_STOCK.length} produtos</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Valor em Estoque</p><p class="adm-kpi__value">${fmt(val)}</p><p class="adm-kpi__sub">a preço de custo</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--${low.length > 0 ? 'warn' : '4'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Crítico</p><p class="adm-kpi__value">${low.length} itens</p><p class="adm-kpi__sub${low.length > 0 ? ' adm-kpi__sub--warn' : ''}">abaixo de 10 unid.</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Fornecedores Ativos</p><p class="adm-kpi__value">${ADMIN_SUPPLIERS.filter(s => s.status === 'ativo').length}</p><p class="adm-kpi__sub">de ${ADMIN_SUPPLIERS.length} cadastrados</p></div>
    </div>
  </div>

  <div class="adm-row">
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Estoque por Categoria</h3></div>
      <div class="adm-hbar-list">
        ${catArr.map(([cat, qtd], i) => `
          <div class="adm-hbar-item">
            <span class="adm-hbar-label">${cat}</span>
            <div class="adm-hbar-track"><div class="adm-hbar-fill" style="width:${Math.round((qtd/catMax)*100)}%;background:${catColors[i % catColors.length]}"></div></div>
            <span class="adm-hbar-val">${qtd} un.</span>
          </div>`).join('')}
      </div>
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Distribuição de Categorias</h3></div>
      ${renderDonutChart(catArr.map(([cat, qtd], i) => ({ label: cat, value: qtd, color: catColors[i % catColors.length] })), 130, total.toString())}
    </div>
  </div>

  <div class="adm-card">
    <div class="adm-card__header"><h3 class="adm-card__title">Inventário Detalhado</h3></div>
    <table class="adm-table">
      <thead><tr><th>Produto</th><th>Categoria</th><th>Nível</th><th>Custo</th><th>Valor Total</th><th>Fornecedor</th><th>Status</th></tr></thead>
      <tbody>
        ${ADMIN_STOCK.map(s => {
          const pct = Math.min(100, Math.round((s.stock / 80) * 100))
          const color = s.stock <= s.min_stock ? '#dc2626' : s.stock <= s.min_stock * 2 ? '#d97706' : '#16a34a'
          const stLabel = s.stock <= s.min_stock ? 'cancelado' : s.stock <= s.min_stock * 2 ? 'processando' : 'ativo'
          const stText  = s.stock <= s.min_stock ? 'Crítico' : s.stock <= s.min_stock * 2 ? 'Baixo' : 'Normal'
          return `<tr class="${s.stock <= s.min_stock ? 'adm-row--warn' : ''}">
            <td>${s.name}</td>
            <td><span class="adm-cat-tag">${s.category}</span></td>
            <td><div class="adm-stock-cell"><div class="adm-stock-bar-track"><div class="adm-stock-bar-fill" style="width:${pct}%;background:${color}"></div></div><span class="adm-stock-num${s.stock <= s.min_stock ? ' adm-red' : ''}">${s.stock}</span></div></td>
            <td class="adm-mono">${fmt(s.cost)}</td>
            <td class="adm-mono">${fmt(s.stock * s.cost)}</td>
            <td class="adm-muted">${s.supplier}</td>
            <td><span class="adm-badge adm-badge--${stLabel}">${stText}</span></td>
          </tr>`
        }).join('')}
      </tbody>
    </table>
  </div>`
}

// ── Section: Pedidos ──────────────────────────────────────────────
function renderPedidos() {
  const statusCounts = ADMIN_ORDERS.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})
  const statusConfig = [
    { key: 'todos',       label: 'Total',        count: ADMIN_ORDERS.length, color: '#6b5a5f' },
    { key: 'pendente',    label: 'Pendente',      count: statusCounts.pendente    || 0, color: '#9b3b48' },
    { key: 'processando', label: 'Processando',   count: statusCounts.processando || 0, color: '#d97706' },
    { key: 'enviado',     label: 'Enviado',       count: statusCounts.enviado     || 0, color: '#2563eb' },
    { key: 'entregue',    label: 'Entregue',      count: statusCounts.entregue    || 0, color: '#16a34a' },
    { key: 'cancelado',   label: 'Cancelado',     count: statusCounts.cancelado   || 0, color: '#6b7280' },
  ]
  const totalVal = ADMIN_ORDERS.reduce((a, o) => a + o.total, 0)
  const avgVal   = totalVal / ADMIN_ORDERS.length

  return `
  <div class="adm-status-strip">
    ${statusConfig.map(s => `
      <div class="adm-status-pill" data-filter="${s.key === 'todos' ? 'all' : s.key}" id="spill-${s.key}">
        <span class="adm-status-pill__count" style="color:${s.color}">${s.count}</span>
        <span class="adm-status-pill__label">${s.label}</span>
      </div>`).join('')}
  </div>

  <div class="adm-row">
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Distribuição de Status</h3></div>
      ${renderDonutChart(statusConfig.slice(1).map(s => ({ label: s.label, value: s.count, color: s.color })), 130, ADMIN_ORDERS.length.toString())}
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Resumo Financeiro</h3></div>
      <div class="adm-fin-summary">
        <div class="adm-fin-row"><span>Total de Pedidos</span><strong>${ADMIN_ORDERS.length}</strong></div>
        <div class="adm-fin-row"><span>Valor Total</span><strong>${fmt(totalVal)}</strong></div>
        <div class="adm-fin-row"><span>Ticket Médio</span><strong>${fmt(avgVal)}</strong></div>
        <div class="adm-fin-row"><span>Maior Pedido</span><strong>${fmt(Math.max(...ADMIN_ORDERS.map(o => o.total)))}</strong></div>
        <div class="adm-fin-row adm-fin-row--total"><span>Taxa de Entrega</span><strong class="adm-green">${Math.round(((statusCounts.entregue||0)/ADMIN_ORDERS.length)*100)}%</strong></div>
      </div>
    </div>
  </div>

  <div class="adm-card">
    <div class="adm-card__header">
      <h3 class="adm-card__title">Lista de Pedidos</h3>
      <div class="adm-filter-pills" id="order-filter">
        <button class="adm-filter-pill is-active" data-filter="all">Todos</button>
        <button class="adm-filter-pill" data-filter="pendente">Pendente</button>
        <button class="adm-filter-pill" data-filter="processando">Processando</button>
        <button class="adm-filter-pill" data-filter="enviado">Enviado</button>
        <button class="adm-filter-pill" data-filter="entregue">Entregue</button>
        <button class="adm-filter-pill" data-filter="cancelado">Cancelado</button>
      </div>
    </div>
    <table class="adm-table" id="orders-table">
      <thead><tr><th>Pedido</th><th>Cliente</th><th>Produto</th><th>Qtd</th><th>Total</th><th>Pagamento</th><th>Data</th><th>Status</th></tr></thead>
      <tbody>
        ${ADMIN_ORDERS.map(o => `
          <tr data-status="${o.status}">
            <td class="adm-mono">${o.id}</td><td>${o.customer}</td><td>${o.item}</td>
            <td class="adm-mono">${o.qty}</td><td class="adm-mono">${fmt(o.total)}</td>
            <td>${o.payment}</td><td>${o.date}</td><td>${badge(o.status)}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>`
}

// ── Section: Pagamentos ───────────────────────────────────────────
function renderPagamentos() {
  const aprov = ADMIN_PAYMENTS.filter(p => p.status === 'aprovado')
  const pend  = ADMIN_PAYMENTS.filter(p => p.status === 'pendente')
  const canc  = ADMIN_PAYMENTS.filter(p => p.status === 'cancelado')
  const aprovRate = Math.round((aprov.length / ADMIN_PAYMENTS.length) * 100)
  const byMethod  = ADMIN_PAYMENTS.reduce((acc, p) => { acc[p.method] = (acc[p.method] || 0) + p.amount; return acc }, {})

  return `
  <div class="adm-kpi-grid adm-kpi-grid--3">
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Aprovados</p><p class="adm-kpi__value">${fmt(aprov.reduce((a,p) => a + p.amount, 0))}</p><p class="adm-kpi__sub">${aprov.length} transações</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--warn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Pendentes</p><p class="adm-kpi__value">${fmt(pend.reduce((a,p) => a + p.amount, 0))}</p><p class="adm-kpi__sub">${pend.length} aguardando</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--danger"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Cancelados</p><p class="adm-kpi__value">${fmt(canc.reduce((a,p) => a + p.amount, 0))}</p><p class="adm-kpi__sub">${canc.length} estornados</p></div>
    </div>
  </div>

  <div class="adm-row adm-row--thirds">
    <div class="adm-card" style="display:flex;flex-direction:column;align-items:center;gap:12px">
      <h3 class="adm-card__title" style="align-self:flex-start">Taxa de Aprovação</h3>
      ${renderRingChart(aprovRate, '#16a34a', 'Aprovados', `${aprov.length} de ${ADMIN_PAYMENTS.length}`, 110)}
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Por Método</h3></div>
      ${renderDonutChart([
        { label: 'PIX',    value: Math.round(Object.entries(byMethod).find(([k]) => k === 'PIX')?.[1] || 0),    color: '#00c4b4' },
        { label: 'Cartão', value: Math.round(Object.entries(byMethod).find(([k]) => k === 'Cartão')?.[1] || 0), color: '#9b3b48' },
        { label: 'Boleto', value: Math.round(Object.entries(byMethod).find(([k]) => k === 'Boleto')?.[1] || 0), color: '#d97706' },
      ], 120)}
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Receita por Método</h3></div>
      <div class="adm-hbar-list">
        ${Object.entries(byMethod).sort((a,b) => b[1]-a[1]).map(([m, v]) => {
          const mx = Math.max(...Object.values(byMethod))
          const colors = { PIX: '#00c4b4', Cartão: '#ffbdc6', Boleto: '#d97706' }
          return `<div class="adm-hbar-item">
            <span class="adm-hbar-label">${m}</span>
            <div class="adm-hbar-track"><div class="adm-hbar-fill" style="width:${Math.round((v/mx)*100)}%;background:${colors[m]||'#ffbdc6'}"></div></div>
            <span class="adm-hbar-val">${fmt(v)}</span>
          </div>`}).join('')}
      </div>
    </div>
  </div>

  <div class="adm-card">
    <div class="adm-card__header"><h3 class="adm-card__title">Histórico de Pagamentos</h3></div>
    <table class="adm-table">
      <thead><tr><th>ID</th><th>Pedido</th><th>Cliente</th><th>Valor</th><th>Método</th><th>Data</th><th>Status</th></tr></thead>
      <tbody>
        ${ADMIN_PAYMENTS.map(p => `<tr>
          <td class="adm-mono adm-muted">${p.id}</td><td class="adm-mono">${p.order}</td><td>${p.customer}</td>
          <td class="adm-mono">${fmt(p.amount)}</td><td>${p.method}</td><td>${p.date}</td><td>${badge(p.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`
}

// ── Section: Fornecedores ─────────────────────────────────────────
function renderFornecedores() {
  const ativos   = ADMIN_SUPPLIERS.filter(s => s.status === 'ativo').length
  const inativos = ADMIN_SUPPLIERS.length - ativos
  const allCats  = [...new Set(ADMIN_SUPPLIERS.flatMap(s => s.categories.split(', ').map(c => c.trim())))]

  return `
  <div class="adm-kpi-grid adm-kpi-grid--3">
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Total</p><p class="adm-kpi__value">${ADMIN_SUPPLIERS.length}</p><p class="adm-kpi__sub">fornecedores cadastrados</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Ativos</p><p class="adm-kpi__value">${ativos}</p><p class="adm-kpi__sub">${inativos} inativo(s)</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Categorias</p><p class="adm-kpi__value">${allCats.length}</p><p class="adm-kpi__sub">categorias cobertas</p></div>
    </div>
  </div>

  <div class="adm-row">
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Cobertura por Categoria</h3></div>
      <div class="adm-hbar-list">
        ${allCats.map((cat, i) => {
          const colors = ['#ffbdc6','#e8798c','#3b82f6','#16a34a','#d97706','#9b3b48','#8b5cf6']
          return `<div class="adm-hbar-item">
            <span class="adm-hbar-label">${cat}</span>
            <div class="adm-hbar-track"><div class="adm-hbar-fill" style="width:100%;background:${colors[i % colors.length]}"></div></div>
            <span class="adm-hbar-val">Ativo</span>
          </div>`}).join('')}
      </div>
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Status dos Fornecedores</h3></div>
      ${renderDonutChart([
        { label: 'Ativos',   value: ativos,   color: '#16a34a' },
        { label: 'Inativos', value: inativos, color: '#9ca3af' },
      ], 120, ADMIN_SUPPLIERS.length.toString())}
    </div>
  </div>

  <div class="adm-suppliers-grid">
    ${ADMIN_SUPPLIERS.map(s => `
      <div class="adm-supplier-card">
        <div class="adm-supplier-card__header">
          <div class="adm-supplier-avatar">${s.name.charAt(0)}</div>
          <div style="flex:1"><h4 class="adm-supplier-card__name">${s.name}</h4><p class="adm-supplier-card__contact">${s.contact}</p></div>
          ${badge(s.status)}
        </div>
        <div class="adm-supplier-card__body">
          <div class="adm-supplier-info"><span>Categorias</span><strong>${s.categories}</strong></div>
          <div class="adm-supplier-info"><span>Telefone</span><strong>${s.phone}</strong></div>
          <div class="adm-supplier-info"><span>E-mail</span><strong style="font-size:.7rem">${s.email}</strong></div>
          <div class="adm-supplier-info"><span>Prazo</span><strong>${s.terms}</strong></div>
        </div>
      </div>`).join('')}
  </div>`
}

// ── Section: Colaboradores ────────────────────────────────────────
function renderColaboradores() {
  const roles = ADMIN_STAFF.reduce((acc, s) => { acc[s.role] = (acc[s.role] || 0) + 1; return acc }, {})
  const roleColors = ['#ffbdc6','#e8798c','#3b82f6','#16a34a','#d97706','#9b3b48']
  const roleSegments = Object.entries(roles).map(([r, c], i) => ({ label: r, value: c, color: roleColors[i % roleColors.length] }))

  return `
  <div class="adm-kpi-grid adm-kpi-grid--3">
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Colaboradores</p><p class="adm-kpi__value">${ADMIN_STAFF.length}</p><p class="adm-kpi__sub">equipe ativa</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Cargos</p><p class="adm-kpi__value">${Object.keys(roles).length}</p><p class="adm-kpi__sub">diferentes funções</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Ativos</p><p class="adm-kpi__value">${ADMIN_STAFF.filter(s => s.status === 'ativo').length}</p><p class="adm-kpi__sub">todos em atividade</p></div>
    </div>
  </div>

  <div class="adm-row">
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Distribuição por Cargo</h3></div>
      ${renderDonutChart(roleSegments, 130, ADMIN_STAFF.length.toString())}
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Cargos</h3></div>
      <div class="adm-hbar-list">
        ${Object.entries(roles).map(([role, count], i) => `
          <div class="adm-hbar-item">
            <span class="adm-hbar-label">${role}</span>
            <div class="adm-hbar-track"><div class="adm-hbar-fill" style="width:${Math.round((count/ADMIN_STAFF.length)*100)}%;background:${roleColors[i%roleColors.length]}"></div></div>
            <span class="adm-hbar-val">${count}</span>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="adm-staff-grid">
    ${ADMIN_STAFF.map(s => {
      const initials = s.name.split(' ').map(n => n[0]).slice(0, 2).join('')
      return `<div class="adm-staff-card">
        <div class="adm-staff-avatar">${initials}</div>
        <h4 class="adm-staff-card__name">${s.name}</h4>
        <p class="adm-staff-card__role">${s.role}</p>
        ${badge(s.status)}
        <div class="adm-staff-card__details">
          <div class="adm-staff-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>${s.email}</div>
          <div class="adm-staff-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>${s.phone}</div>
          <div class="adm-staff-info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Desde ${s.since}</div>
        </div>
      </div>`}).join('')}
  </div>`
}

// ── Section: Clientes ─────────────────────────────────────────────
function renderClientes() {
  const total  = ADMIN_CUSTOMERS.reduce((a, c) => a + c.total, 0)
  const orders = ADMIN_CUSTOMERS.reduce((a, c) => a + c.orders, 0)
  const top6   = [...ADMIN_CUSTOMERS].sort((a, b) => b.total - a.total).slice(0, 6)
  const states = ADMIN_CUSTOMERS.reduce((acc, c) => { const st = c.city.split(' - ')[1]; acc[st] = (acc[st]||0)+1; return acc }, {})
  const stateArr = Object.entries(states).sort((a,b) => b[1]-a[1]).slice(0, 6)
  const stateMax = Math.max(...stateArr.map(([,v]) => v)) || 1

  return `
  <div class="adm-kpi-grid adm-kpi-grid--3">
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Total de Clientes</p><p class="adm-kpi__value">${ADMIN_CUSTOMERS.length}</p><p class="adm-kpi__sub">na base cadastrada</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Receita Total</p><p class="adm-kpi__value">${fmt(total)}</p><p class="adm-kpi__sub">lifetime value acumulado</p></div>
    </div>
    <div class="adm-kpi">
      <div class="adm-kpi__icon adm-kpi__icon--3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
      <div class="adm-kpi__body"><p class="adm-kpi__label">Total de Pedidos</p><p class="adm-kpi__value">${orders}</p><p class="adm-kpi__sub">média ${(orders/ADMIN_CUSTOMERS.length).toFixed(1)} por cliente</p></div>
    </div>
  </div>

  <div class="adm-row">
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Top 6 Clientes por Valor</h3></div>
      <div class="adm-chart-wrap">${renderBarChart(top6.map(c => c.total), top6.map(c => c.name.split(' ')[0]))}</div>
    </div>
    <div class="adm-card">
      <div class="adm-card__header"><h3 class="adm-card__title">Clientes por Estado</h3></div>
      <div class="adm-hbar-list">
        ${stateArr.map(([st, cnt]) => `
          <div class="adm-hbar-item">
            <span class="adm-hbar-label">${st}</span>
            <div class="adm-hbar-track"><div class="adm-hbar-fill" style="width:${Math.round((cnt/stateMax)*100)}%"></div></div>
            <span class="adm-hbar-val">${cnt}</span>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="adm-card">
    <div class="adm-card__header"><h3 class="adm-card__title">Base de Clientes</h3></div>
    <table class="adm-table">
      <thead><tr><th>Nome</th><th>E-mail</th><th>Cidade</th><th>Pedidos</th><th>Total Gasto</th><th>Desde</th><th>Último Pedido</th></tr></thead>
      <tbody>
        ${[...ADMIN_CUSTOMERS].sort((a, b) => b.total - a.total).map(c => `
          <tr>
            <td><strong>${c.name}</strong></td>
            <td class="adm-muted">${c.email}</td>
            <td>${c.city}</td>
            <td class="adm-mono">${c.orders}</td>
            <td class="adm-mono"><strong>${fmt(c.total)}</strong></td>
            <td>${c.since}</td>
            <td>${c.last}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>`
}

// ── Section: Perfil ───────────────────────────────────────────────
function renderPerfil() {
  const profile = JSON.parse(localStorage.getItem('adm_profile') || '{}')
  const name  = profile.name  || 'Shelly Lopes'
  const role  = profile.role  || 'Administradora'
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
    vendas: () => renderVendas(period),
    financeiro: () => renderFinanceiro(period),
    estoque: renderEstoque,
    pedidos: renderPedidos,
    pagamentos: renderPagamentos,
    fornecedores: renderFornecedores,
    colaboradores: renderColaboradores,
    clientes: renderClientes,
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
  content.innerHTML = await (renderers[section] || (() => ''))()
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
  const canAccessCRM = ['admin', 'hr'].includes(profile?.role) || profile?.is_admin === true

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
async function renderCmsProdutos() {
  const products = await CMS.getProducts()
  const cats = await CMS.getCategories()
  const collections = await CMS.getCollections()
  const collectionsHtml = collections.map(c => `
    <span class="cms-badge" style="display:inline-flex;align-items:center;gap:.4rem;padding:4px 10px;border:1px solid var(--color-border);border-radius:100px;margin:0 .4rem .4rem 0">
      <button type="button" class="cms-star-btn" data-star="${c.id}" title="Marcar como destaque na home" style="background:none;border:none;cursor:pointer;font-size:1rem;color:${c.is_featured ? 'var(--color-primary-mid)' : '#ccc'}">★</button>
      ${c.name}
      <button type="button" class="cms-icon-btn" data-del-col="${c.id}" title="Excluir coleção" style="background:none;border:none;cursor:pointer">✕</button>
    </span>`).join('') || '<span style="color:var(--color-muted);font-size:.85rem">Nenhuma coleção ainda.</span>'

  const rows = products.map(p => `
    <tr data-id="${p.id}" data-cat="${p.category}" data-name="${(p.name||'').toLowerCase()}">
      <td>${p.image ? `<img class="cms-table__thumb" src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">` : '<div class="cms-table__thumb" style="background:#f5f5f5"></div>'}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>R$&nbsp;${Number(p.price).toFixed(2).replace('.',',')}${p.comparePrice ? `<br><small style="text-decoration:line-through;color:var(--color-muted)">R$&nbsp;${Number(p.comparePrice).toFixed(2).replace('.',',')}</small>` : ''}</td>
      <td>${p.isNew ? '<span class="cms-badge cms-badge--new">Novo</span> ' : ''}${p.isSale ? '<span class="cms-badge cms-badge--sale">Promo</span>' : ''}</td>
      <td>
        <button class="cms-icon-btn" data-edit="${p.id}" title="Editar">✏️</button>
        <button class="cms-icon-btn cms-icon-btn--danger" data-del="${p.id}" title="Excluir">🗑</button>
      </td>
    </tr>`).join('')

  return `
    <div class="cms-toolbar">
      <input class="cms-search" id="cms-prod-search" placeholder="Buscar produto…">
      <select class="cms-filter-select cms-cat-select" id="cms-prod-cat-filter">
        <option value="">Todas categorias</option>
        ${cats.map(c => `<option>${c}</option>`).join('')}
        <option value="__new__">+ Nova categoria</option>
      </select>
      <button class="cms-btn cms-btn--primary" id="cms-prod-new">+ Novo Produto</button>
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
        <thead><tr><th>Foto</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Tags</th><th>Ações</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6" class="cms-empty">Nenhum produto cadastrado.</td></tr>'}</tbody>
      </table>
    </div>
    <div class="cms-modal-overlay" id="cms-prod-overlay" style="display:none">
      <div class="cms-modal" style="max-width:600px">
        <div class="cms-modal__header">
          <span id="cms-prod-modal-title">Novo Produto</span>
          <button class="cms-modal__close" id="cms-prod-close">✕</button>
        </div>
        <div class="cms-modal__body">
          <form class="cms-form" id="cms-prod-form">
            <input type="hidden" id="cms-prod-id">
            <div class="cms-field cms-field--full">
              <label class="cms-label">Nome do produto *</label>
              <input class="cms-input" id="cms-prod-name" type="text" required placeholder="Ex.: Vestido Longo Floral">
            </div>
            <div class="cms-form-row">
              <div class="cms-field">
                <label class="cms-label">Categoria *</label>
                <select class="cms-select cms-cat-select" id="cms-prod-cat">
                  ${cats.map(c => `<option>${c}</option>`).join('')}
                  <option value="__new__">+ Nova categoria</option>
                </select>
              </div>
              <div class="cms-field">
                <label class="cms-label">Preço (R$) *</label>
                <input class="cms-input" id="cms-prod-price" type="number" min="0" step="0.01" required>
              </div>
              <div class="cms-field">
                <label class="cms-label">Preço original (R$)</label>
                <input class="cms-input" id="cms-prod-compare" type="number" min="0" step="0.01" placeholder="Opcional">
              </div>
            </div>
            <div class="cms-field cms-field--full">
              <label class="cms-label">Coleções</label>
              <div id="cms-prod-collections" style="display:flex;flex-wrap:wrap;gap:.5rem 1rem">
                ${collections.map(c => `
                  <label style="display:flex;align-items:center;gap:.4rem;cursor:pointer;font-size:var(--font-size-sm)">
                    <input type="checkbox" data-col-check="${c.id}" style="accent-color:var(--color-primary);width:16px;height:16px">
                    ${c.name}
                  </label>`).join('') || '<span style="color:var(--color-muted);font-size:.85rem">Nenhuma coleção cadastrada ainda.</span>'}
              </div>
            </div>
            <div class="cms-form-row" style="gap:2rem">
              <label class="cms-label" style="display:flex;align-items:center;gap:.5rem;cursor:pointer">
                <input type="checkbox" id="cms-prod-isnew" style="accent-color:var(--color-primary);width:16px;height:16px">
                Marcar como NOVO
              </label>
              <label class="cms-label" style="display:flex;align-items:center;gap:.5rem;cursor:pointer">
                <input type="checkbox" id="cms-prod-issale" style="accent-color:var(--color-primary);width:16px;height:16px">
                Marcar como PROMOÇÃO
              </label>
            </div>
            <div class="cms-field cms-field--full">
              <label class="cms-label">Foto do produto</label>
              <div class="cms-img-picker">
                <div class="cms-img-preview cms-img-preview--empty" id="cms-prod-img-preview"><span>Clique ou arraste uma foto</span></div>
                <div class="cms-img-actions">
                  <label class="cms-btn cms-btn--outline cms-btn--sm" style="cursor:pointer">
                    Escolher arquivo<input type="file" id="cms-prod-file" accept="image/*" style="display:none">
                  </label>
                  <span style="color:var(--color-muted);font-size:.8rem">ou</span>
                  <input class="cms-img-url-input" id="cms-prod-url" type="url" placeholder="Cole a URL da imagem">
                </div>
              </div>
              <input type="hidden" id="cms-prod-img">
            </div>
          </form>
        </div>
        <div class="cms-modal__footer">
          <button class="cms-btn cms-btn--outline" id="cms-prod-cancel">Cancelar</button>
          <button class="cms-btn cms-btn--primary" id="cms-prod-save">Salvar produto</button>
        </div>
      </div>
    </div>`
}

function bindCmsProdutos() {
  const search = document.getElementById('cms-prod-search')
  const catFilter = document.getElementById('cms-prod-cat-filter')
  function filterTable() {
    const q = (search?.value || '').toLowerCase()
    const cat = catFilter?.value || ''
    document.querySelectorAll('#cms-prod-table tbody tr[data-id]').forEach(row => {
      row.style.display = (!q || row.dataset.name.includes(q)) && (!cat || row.dataset.cat === cat) ? '' : 'none'
    })
  }
  search?.addEventListener('input', filterTable)
  catFilter?.addEventListener('change', filterTable)

  document.querySelectorAll('.cms-cat-select').forEach(sel => {
    sel.addEventListener('change', async () => {
      if (sel.value !== '__new__') return
      const name = prompt('Nome da nova categoria:')?.trim()
      if (!name) { sel.value = sel.id === 'cms-prod-cat-filter' ? '' : ((await CMS.getCategories())[0] || ''); return }
      await CMS.addCategory(name)
      document.querySelectorAll('.cms-cat-select').forEach(s => {
        const opt = document.createElement('option')
        opt.value = name
        opt.textContent = name
        s.insertBefore(opt, s.querySelector('option[value="__new__"]'))
        s.value = name
      })
    })
  })

  document.getElementById('cms-prod-new')?.addEventListener('click', () => _cmsProdOpenModal(null))

  document.getElementById('cms-add-collection')?.addEventListener('click', async () => {
    const input = document.getElementById('cms-new-collection')
    const name = input?.value.trim()
    if (!name) return
    await CMS.addCollection(name)
    navigate('cms-produtos')
  })
  document.getElementById('cms-new-collection')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('cms-add-collection')?.click() }
  })
  document.getElementById('cms-collections-list')?.addEventListener('click', async e => {
    const starBtn = e.target.closest('[data-star]')
    const delBtn  = e.target.closest('[data-del-col]')
    if (starBtn) {
      await CMS.setFeaturedCollection(starBtn.dataset.star)
      navigate('cms-produtos')
    }
    if (delBtn && confirm('Excluir esta coleção? Ela será removida de todos os produtos.')) {
      await CMS.deleteCollection(delBtn.dataset.delCol)
      navigate('cms-produtos')
    }
  })

  document.getElementById('cms-prod-table')?.addEventListener('click', async e => {
    const editBtn = e.target.closest('[data-edit]')
    const delBtn  = e.target.closest('[data-del]')
    if (editBtn) {
      const products = await CMS.getProducts()
      const p = products.find(x => x.id === editBtn.dataset.edit)
      if (p) {
        const productCollections = await CMS.getProductCollections(p.id)
        _cmsProdOpenModal(p, productCollections)
      }
    }
    if (delBtn && confirm('Excluir este produto? Esta ação não pode ser desfeita.')) {
      await CMS.deleteProduct(delBtn.dataset.del)
      navigate('cms-produtos')
    }
  })

  document.getElementById('cms-prod-close')?.addEventListener('click',  () => _cmsCloseModal('cms-prod-overlay'))
  document.getElementById('cms-prod-cancel')?.addEventListener('click', () => _cmsCloseModal('cms-prod-overlay'))
  document.getElementById('cms-prod-overlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) _cmsCloseModal('cms-prod-overlay') })

  document.getElementById('cms-prod-file')?.addEventListener('change', async e => {
    const file = e.target.files?.[0]
    if (!file) return
    const resized = await CMS.resizeImage(await CMS.fileToDataUrl(file))
    _cmsProdSetImg(resized)
  })
  document.getElementById('cms-prod-url')?.addEventListener('blur', e => {
    const url = e.target.value.trim()
    if (url) _cmsProdSetImg(url)
  })

  document.getElementById('cms-prod-save')?.addEventListener('click', async () => {
    if (!document.getElementById('cms-prod-form').reportValidity()) return
    const idVal = document.getElementById('cms-prod-id').value
    const name  = document.getElementById('cms-prod-name').value.trim()
    const productId = await CMS.upsertProduct({
      id:           idVal || null,
      name,
      slug:         name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''),
      category:     document.getElementById('cms-prod-cat').value,
      price:        parseFloat(document.getElementById('cms-prod-price').value) || 0,
      comparePrice: parseFloat(document.getElementById('cms-prod-compare').value) || null,
      isNew:        document.getElementById('cms-prod-isnew').checked,
      isSale:       document.getElementById('cms-prod-issale').checked,
      image:        document.getElementById('cms-prod-img').value || '',
      rating:       4.5,
      reviews:      0,
    })
    if (productId) {
      const selectedCollections = Array.from(document.querySelectorAll('#cms-prod-collections input[data-col-check]:checked')).map(i => i.dataset.colCheck)
      await CMS.setProductCollections(productId, selectedCollections)
    }
    _cmsCloseModal('cms-prod-overlay')
    navigate('cms-produtos')
  })
}

function _cmsProdOpenModal(p, productCollections = []) {
  document.getElementById('cms-prod-modal-title').textContent = p ? 'Editar Produto' : 'Novo Produto'
  document.getElementById('cms-prod-id').value      = p?.id ?? ''
  document.getElementById('cms-prod-name').value    = p?.name ?? ''
  document.getElementById('cms-prod-cat').value     = p?.category ?? 'Vestidos'
  document.getElementById('cms-prod-price').value   = p?.price ?? ''
  document.getElementById('cms-prod-compare').value = p?.comparePrice ?? ''
  document.getElementById('cms-prod-isnew').checked  = p?.isNew ?? false
  document.getElementById('cms-prod-issale').checked = p?.isSale ?? false
  document.getElementById('cms-prod-url').value = ''
  document.querySelectorAll('#cms-prod-collections input[data-col-check]').forEach(chk => {
    chk.checked = productCollections.includes(chk.dataset.colCheck)
  })
  _cmsProdSetImg(p?.image ?? '')
  _cmsOpenModal('cms-prod-overlay')
}

function _cmsProdSetImg(src) {
  document.getElementById('cms-prod-img').value = src
  const preview = document.getElementById('cms-prod-img-preview')
  if (!preview) return
  if (src) {
    preview.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:6px" onerror="this.parentElement.innerHTML='<span>Imagem inválida</span>'">`
    preview.classList.remove('cms-img-preview--empty')
  } else {
    preview.innerHTML = '<span>Clique ou arraste uma foto</span>'
    preview.classList.add('cms-img-preview--empty')
  }
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
          <button class="cms-modal__close" id="cms-blog-close">✕</button>
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
  _cmsOpenModal('cms-blog-overlay')
}

function _cmsBlogSetImg(src) {
  document.getElementById('cms-blog-img').value = src
  const preview = document.getElementById('cms-blog-img-preview')
  if (!preview) return
  if (src) {
    preview.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:6px">`
    preview.classList.remove('cms-img-preview--empty')
  } else {
    preview.innerHTML = '<span>Clique ou arraste uma foto</span>'
    preview.classList.add('cms-img-preview--empty')
  }
}

// ── Loja Física ───────────────────────────────────────────────────
function renderCmsLojaFisica() {
  const data = CMS.getLojaFisica()
  const galleryItems = (data.gallery || []).map((src, i) => `
    <div class="cms-gallery__item" data-idx="${i}">
      <img src="${src}" alt="Foto ${i+1}" onerror="this.style.display='none'">
      <button class="cms-gallery__del" data-idx="${i}" title="Remover">✕</button>
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

  document.getElementById('cms-loja-save')?.addEventListener('click', () => {
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
    btn.textContent = 'Salvo!'
    btn.disabled = true
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
        <span class="cms-banner-card__label">${b.btnText || 'Ver Coleção'} → ${b.link || ''}</span>
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
          <button class="cms-modal__close" id="cms-banner-close">✕</button>
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

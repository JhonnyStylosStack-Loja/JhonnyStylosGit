document.addEventListener('DOMContentLoaded', () => {
  Toast.init()

  // Handle return from Mercado Pago
  const params = new URLSearchParams(location.search)
  const status = params.get('status')
  if (status === 'success') {
    Cart.clear()
    Toast.show('Pedido confirmado!', 'Seu pagamento foi aprovado. Redirecionando...', 'success')
    setTimeout(() => { location.href = 'index.html' }, 3000)
    return
  }
  if (status === 'failure') {
    Toast.show('Pagamento recusado', 'Tente novamente com outro método de pagamento.', 'error')
  }
  if (status === 'pending') {
    Toast.show('Pagamento pendente', 'Você receberá uma confirmação por e-mail.', 'info')
  }

  const items = Cart.get()

  // Render order items
  const orderItems = document.getElementById('order-items')
  if (orderItems) {
    orderItems.innerHTML = items.map(item => `
    <div class="order-item">
      <div class="order-item__image-wrap">
        <img class="order-item__image" src="${item.image}" alt="${item.name}">
        <span class="order-item__qty-badge">${item.qty}</span>
      </div>
      <div class="order-item__details">
        <p class="order-item__name">${item.name}</p>
        <p class="order-item__variant">Tamanho: ${item.size}</p>
      </div>
      <span class="order-item__price">${Formatter.price(item.price * item.qty)}</span>
    </div>`).join('')
  }

  const subtotal = Cart.total()
  const shipping = subtotal > 100 ? 0 : 9.99
  document.getElementById('order-subtotal').textContent = Formatter.price(subtotal)
  document.getElementById('order-shipping').textContent = shipping === 0 ? 'Grátis' : Formatter.price(shipping)
  document.getElementById('order-total').textContent = Formatter.price(subtotal + shipping)

  // Payment method toggle
  document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('is-selected'))
      method.classList.add('is-selected')
      method.querySelector('input')?.click()
    })
  })

  // Coupon
  let couponCode = ''
  document.getElementById('apply-coupon')?.addEventListener('click', () => {
    const input = document.getElementById('coupon-input')
    const code = input.value.trim().toUpperCase()
    if (!code) return
    couponCode = code
    const discountRow = document.getElementById('order-discount-row')
    discountRow.style.display = ''
    document.getElementById('order-discount').textContent = code
    Toast.show('Cupom adicionado', `Código ${code} será aplicado no pagamento.`, 'success')
  })

  // Place order
  const btn = document.getElementById('place-order')
  btn?.addEventListener('click', async e => {
    e.preventDefault()

    const form = document.getElementById('checkout-form')
    const name = form.querySelector('input[type="text"]').value.trim()
    const email = form.querySelector('input[type="email"]').value.trim()

    if (!name || !email) {
      Toast.show('Campos obrigatórios', 'Preencha nome e e-mail para continuar.', 'error')
      return
    }
    if (items.length === 0) {
      Toast.show('Carrinho vazio', 'Adicione produtos antes de finalizar.', 'error')
      return
    }

    btn.disabled = true
    btn.textContent = 'Processando...'

    try {
      const res = await fetch('/api/criar-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            title: item.name,
            quantity: item.qty,
            unit_price: item.price
          })),
          payer: { name, email },
          ...(couponCode && { coupon: couponCode })
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao criar pagamento')

      location.href = data.sandbox_init_point
    } catch (err) {
      Toast.show('Erro no pagamento', err.message, 'error')
      btn.disabled = false
      btn.textContent = 'Fazer Pedido'
    }
  })
})

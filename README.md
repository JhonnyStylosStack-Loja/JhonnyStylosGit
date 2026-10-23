# 🛍️ Destry Fashion — E-Commerce

> E-commerce de moda completo · HTML5 + CSS3 + Vanilla JS + Supabase

---

## 📋 Visão Geral

Loja virtual de moda inspirada no layout **Destry** (referência anexa), com hero section, vitrine de produtos tabulados (New Arrivals / Best Sellers / Sale Items), banners promocionais, Daily Deals com countdown, blog e rodapé completo.

---

## 🧱 Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5 + CSS3 + JavaScript (Vanilla, sem frameworks) |
| Backend / DB | [Supabase](https://supabase.com) — PostgreSQL + Auth + Storage |
| Hospedagem | Vercel ou Netlify (deploy de arquivos estáticos) |
| Responsividade | Mobile-first · 375px / 768px / 1024px / 1440px |

---

## 🗂️ Estrutura de Arquivos

```
destry-fashion/
│
├── index.html                  # Página principal (homepage)
├── product.html                # Página de detalhe do produto
├── shop.html                   # Listagem / catálogo
├── cart.html                   # Carrinho de compras
├── checkout.html               # Finalização de pedido
├── login.html                  # Login / Cadastro
├── account.html                # Painel do cliente
│
├── css/
│   ├── reset.css               # Normalize / reset
│   ├── variables.css           # Design tokens (cores, tipografia, espaçamento)
│   ├── global.css              # Estilos base e utilitários
│   ├── components/
│   │   ├── header.css
│   │   ├── hero.css
│   │   ├── product-card.css
│   │   ├── tabs.css
│   │   ├── banner.css
│   │   ├── countdown.css
│   │   ├── mini-list.css       # Listas compactas (Best Offer, New Products…)
│   │   ├── blog-card.css
│   │   ├── footer.css
│   │   ├── modal.css           # Quick-view, cart sidebar
│   │   └── toast.css           # Notificações
│   └── pages/
│       ├── shop.css
│       ├── product.css
│       ├── cart.css
│       ├── checkout.css
│       └── auth.css
│
├── js/
│   ├── config/
│   │   └── supabase.js         # Inicialização do client Supabase
│   ├── services/
│   │   ├── auth.js             # signIn, signUp, signOut, getUser
│   │   ├── products.js         # getAll, getById, getByCategory, search
│   │   ├── cart.js             # add, remove, update, getCart
│   │   ├── orders.js           # createOrder, getOrders
│   │   └── storage.js          # Upload de imagens (Supabase Storage)
│   ├── components/
│   │   ├── header.js           # Menu mobile, sticky header, search toggle
│   │   ├── tabs.js             # New Arrivals / Best Sellers / Sale Items
│   │   ├── carousel.js         # Slider de produtos (sem lib externa)
│   │   ├── countdown.js        # Timer regressivo Daily Deals
│   │   ├── quickview.js        # Modal quick-view de produto
│   │   └── toast.js            # Feedback visual (add-to-cart, erros)
│   ├── pages/
│   │   ├── index.js            # Orquestra homepage
│   │   ├── shop.js             # Filtros, ordenação, paginação
│   │   ├── product.js          # Galeria, variantes, add-to-cart
│   │   ├── cart.js             # Atualização dinâmica do carrinho
│   │   ├── checkout.js         # Formulário + criação de pedido
│   │   └── auth.js             # Formulários login/cadastro
│   └── utils/
│       ├── formatter.js        # formatPrice, formatDate
│       └── debounce.js
│
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   ├── banners/
│   │   ├── products/           # Placeholder local (produção usa Supabase Storage)
│   │   ├── blog/
│   │   └── brands/
│   └── icons/
│       └── sprite.svg          # SVG icon sprite
│
├── .env.example                # Variáveis de ambiente (template)
├── .gitignore
└── README.md
```

---

## 🗃️ Schema do Banco de Dados (Supabase / PostgreSQL)

Execute no **SQL Editor** do Supabase:

```sql
-- Categorias
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Produtos
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  compare_price numeric(10,2),          -- preço riscado
  category_id uuid REFERENCES categories(id),
  brand text,
  is_new boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_on_sale boolean DEFAULT false,
  stock integer DEFAULT 0,
  rating numeric(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Imagens de produtos
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text,
  position integer DEFAULT 0
);

-- Usuários (perfil estendido — complementa auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  updated_at timestamptz DEFAULT now()
);

-- Endereços
CREATE TABLE addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  label text,            -- 'Casa', 'Trabalho'
  street text NOT NULL,
  number text,
  complement text,
  neighborhood text,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  is_default boolean DEFAULT false
);

-- Pedidos
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  status text DEFAULT 'pending',        -- pending | paid | shipped | delivered | cancelled
  total numeric(10,2) NOT NULL,
  shipping_address jsonb,
  created_at timestamptz DEFAULT now()
);

-- Itens do pedido
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL
);

-- Posts do blog
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  cover_url text,
  author text,
  published_at timestamptz DEFAULT now()
);
```

### Row Level Security (RLS)

```sql
-- Habilitar RLS nas tabelas sensíveis
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Perfil: usuário vê/edita apenas o próprio
CREATE POLICY "own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Endereços: idem
CREATE POLICY "own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id);

-- Pedidos: idem
CREATE POLICY "own orders" ON orders
  FOR ALL USING (auth.uid() = user_id);

-- Produtos e categorias: leitura pública
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read products"   ON products   FOR SELECT USING (true);
CREATE POLICY "public read categories" ON categories FOR SELECT USING (true);
```

---

## ⚙️ Variáveis de Ambiente

Crie o arquivo `.env` (nunca commitar — já está no `.gitignore`):

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
```

No `js/config/supabase.js`, injetar via build tool ou diretamente:

```js
// js/config/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export const supabase = createClient(
  'SUPABASE_URL',   // substituir pelo valor real
  'SUPABASE_ANON_KEY'
)
```

> Para Vercel/Netlify, cadastre as vars em **Project Settings → Environment Variables**.

---

## 🖼️ Seções da Homepage (wireframe de referência)

| # | Seção | Arquivo responsável |
|---|---|---|
| 1 | Top bar (promoção) + Header + Nav | `header.css` / `header.js` |
| 2 | Hero banner + CTA | `hero.css` |
| 3 | 4 benefícios (free shipping, suporte…) | `global.css` (flexbox strip) |
| 4 | Banners duplos (Office Dress / All Products) | `banner.css` |
| 5 | Tabs de produtos (New Arrivals / Best Sellers / Sale) | `tabs.css` / `tabs.js` |
| 6 | Banner de oferta de verão | `banner.css` |
| 7 | 3 colunas mini-lista (Best Offer, New Products, Best Sellers) | `mini-list.css` |
| 8 | 3 banners promocionais (Sun Hat, Ladies Bag, Smart Watch) | `banner.css` |
| 9 | Daily Deals com countdown timer | `countdown.css` / `countdown.js` |
| 10 | Logos de marcas parceiras | `global.css` |
| 11 | Latest Blog (3 cards) | `blog-card.css` |
| 12 | Footer 4 colunas + redes sociais | `footer.css` |

---

## 🎨 Design Tokens (variables.css)

```css
:root {
  /* Cores */
  /* Paleta da identidade visual: #f8f8f8 · #ffbdc6 · #ffd0d3 */
  --color-primary:      #ffbdc6;   /* rosa — botões, badges (texto escuro por cima) */
  --color-primary-text: #9b3b48;   /* mesma matiz, escuro: texto/links rosa sobre claro */
  --color-accent:       #ffd0d3;   /* rosa claro */
  --color-text:         #2d2226;
  --color-text-muted:   #6b5a5f;
  --color-border:       #ffd0d3;
  --color-bg:           #ffffff;
  --color-bg-alt:       #f8f8f8;

  /* Tipografia */
  --font-heading: 'Playfair Display', serif;
  --font-body:    'DM Sans', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  --font-size-3xl: 2.75rem;

  /* Espaçamento */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  40px;
  --space-2xl: 64px;

  /* Layout */
  --container-max: 1320px;
  --container-pad: clamp(16px, 4vw, 60px);
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* Transições */
  --transition-fast:   150ms ease;
  --transition-base:   250ms ease;
  --transition-slow:   400ms ease;

  /* Sombras */
  --shadow-card: 0 2px 12px rgba(0,0,0,.08);
  --shadow-hover: 0 6px 24px rgba(0,0,0,.14);
}
```

---

## 🚀 Como Rodar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/destry-fashion.git
cd destry-fashion

# 2. Preencha as credenciais do Supabase
cp .env.example .env
# Edite .env com suas chaves

# 3. Inicie um servidor local (escolha um)
npx serve .           # Node
python -m http.server # Python
# ou abra com Live Server no VS Code
```

---

## 📦 Deploy (Vercel)

```bash
npm i -g vercel
vercel --prod
# Siga o prompt e defina as env vars no dashboard
```

---

## 🤖 Prompt de Geração (para IA / Copilot)

Use o prompt abaixo para gerar qualquer página ou componente faltante:

```
Você é um desenvolvedor frontend sênior especializado em e-commerce.

CONTEXTO DO PROJETO:
- E-commerce de moda chamado "Destry Fashion"
- Stack: HTML5 puro + CSS3 (sem frameworks) + Vanilla JS + Supabase
- Design tokens já definidos em css/variables.css (ver README)
- Mobile-first com breakpoints: 375px, 768px, 1024px, 1440px
- Paleta (ID da cliente): #f8f8f8 (cinza), #ffbdc6 (rosa), #ffd0d3 (rosa claro); texto #2d2226
- Fontes: 'Playfair Display' (headings) + 'DM Sans' (body)

WIREFRAME DE REFERÊNCIA:
[descreva ou cole aqui a seção que deseja gerar]

TAREFA:
Gere o código HTML + CSS + JS para [NOME DA SEÇÃO / COMPONENTE].

REQUISITOS:
1. HTML semântico (section, article, header, nav, main, footer)
2. CSS BEM ou com prefixo de componente (.card__, .card--modifier)
3. JS vanilla com async/await para chamadas ao Supabase
4. Skeleton loader durante carregamento
5. Tratamento de erro com toast visual
6. Totalmente responsivo nos 4 breakpoints
7. Acessível: aria-labels, focus-visible, contraste WCAG AA
8. Sem dependências externas (exceto Supabase CDN)

Entregue os três blocos separados: HTML, CSS, JavaScript.
```

---

## ✅ Checklist de Desenvolvimento

- [ ] Configurar projeto no Supabase e executar SQL do schema
- [ ] Criar bucket `product-images` no Supabase Storage (público)
- [ ] Preencher `.env` com URL e Anon Key
- [ ] Implementar `js/config/supabase.js`
- [ ] Header + navegação mobile
- [ ] Hero section
- [ ] Tabs de produtos (New Arrivals / Best Sellers / Sale)
- [ ] Sistema de carrinho (localStorage → sync Supabase pós-login)
- [ ] Página de produto com galeria
- [ ] Página de checkout
- [ ] Auth (login / cadastro / recuperação de senha)
- [ ] Daily Deals countdown
- [ ] Blog posts dinâmicos
- [ ] Deploy na Vercel com env vars

---

## 📄 Licença

MIT © 2024 Destry Fashion

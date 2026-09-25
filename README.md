# 👟 SNEAKERVAULT - Loja de Tênis Mobile & Supabase

Um e-commerce mobile-first de tênis e sneakers de alta performance e edição limitada, pronto para receber dados em tempo real do **Supabase** ou operar em modo demonstração automático.

---

## 📱 Recursos Mobile-First

- **Interface Mobile Nativa**: Barra de navegação inferior (*Bottom Navigation*), header com status de conexão, suporte a entalhes (*safe area insets*) e visual escuro estilo *Nike SNKRS* e *Kith*.
- **Catálogo Inteligente**:
  - Filtro por Marcas com contadores (Nike, Jordan, Adidas, New Balance, Asics, Puma).
  - Filtro por Categorias (Casual & Street, Corrida & Performance, Basquete, Edição Especial).
  - Barra de busca instantânea por modelo, cor ou marca.
- **Detalhes do Modelo**:
  - Galeria de fotos em alta resolução com miniaturas interativas.
  - Seletor de tamanhos brasileiros (37 ao 44 BR).
  - Especificações técnicas, selo de originalidade e cálculo de parcelamento em até 10x sem juros.
- **Sacola de Compras Dinâmica**:
  - Barra de progresso para **Frete Grátis** (a partir de R$ 299).
  - Sistema de cupons com validação instantânea (`KICKS10` = 10% OFF, `PRIMEIRACOMPRA` = 15% OFF).
  - Controle de quantidade e remoção rápida.
- **Checkout Completo**:
  - Cadastro de endereço de entrega e WhatsApp.
  - Pagamento via **PIX** com 5% de desconto adicional, QR Code e código Copia e Cola.
  - Pagamento via **Cartão de Crédito** em até 10x sem juros.
  - Disparo de confetes 🎉 e geração de código de pedido.
  - **Gravação automática do pedido na tabela `orders` do Supabase**.

---

## ⚡ Integração com o Supabase

A loja já vem 100% preparada para comunicar com o Supabase. Você pode configurá-la de duas formas:

### Opção 1: Configuração Direta na Interface (Mais Rápida)
1. Inicie a aplicação com `npm run dev`.
2. Toque no botão **Supabase** na barra superior ou na barra inferior.
3. Insira a **Project URL** e a **Anon Public Key**.
4. Clique em **Salvar & Testar Conexão**.
5. Se a tabela `products` estiver vazia, use o botão **"Popular Catálogo no Supabase (Seed 1-Click)"** para cadastrar os 8 modelos de tênis automaticamente!

### Opção 2: Via Arquivo `.env`
Renomeie ou edite o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica-aqui
```

---

## 🗄️ Estrutura do Banco de Dados (`supabase-schema.sql`)

O arquivo [supabase-schema.sql](file:///C:/Users/adria/OneDrive/Área%20de%20Trabalho/loja%20tennis%20mobile/supabase-schema.sql) contém o script completo e pronto para ser executado no **SQL Editor** do Supabase.

### Tabelas Criadas:
1. `products`:
   - `id` (UUID, Chave Primária)
   - `name` (Texto)
   - `brand` (Texto: Nike, Jordan, Adidas, New Balance, etc.)
   - `category` (Texto: casual, corrida, basquete, edicao_especial)
   - `price` (Numérico)
   - `original_price` (Numérico)
   - `image_url` (Texto)
   - `gallery` (JSONB)
   - `description` (Texto)
   - `rating` (Numérico)
   - `reviews_count` (Inteiro)
   - `sizes` (JSONB, ex: `[38, 39, 40, 41, 42, 43]`)
   - `in_stock` (Booleano)
   - `badge` (Texto: Novo, Hyped, Limitado, Promoção)
   - `colors` (JSONB)

2. `orders`:
   - `id` (UUID, Chave Primária)
   - `customer_name` (Texto)
   - `customer_phone` (Texto)
   - `customer_address` (Texto)
   - `subtotal` (Numérico)
   - `discount` (Numérico)
   - `shipping` (Numérico)
   - `total` (Numérico)
   - `payment_method` (Texto: 'pix' ou 'credit_card')
   - `status` (Texto: 'pending' ou 'paid')
   - `created_at` (Timestamp)

3. `order_items`:
   - `id` (UUID)
   - `order_id` (UUID referenciando `orders`)
   - `product_name` (Texto)
   - `size` (Inteiro)
   - `quantity` (Inteiro)
   - `price` (Numérico)

4. **Políticas RLS (Row Level Security)**:
   - Leitura pública liberada para catálogo de produtos (`SELECT` para `public`).
   - Inserção de novos pedidos liberada para qualquer visitante (`INSERT` para `public`).

---

## 🚀 Como Executar o Projeto

```bash
# 1. Instalar dependências (já instaladas)
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Gerar build de produção
npm run build
```

---

## 🛠️ Tecnologias Utilizadas

- **React 19 & TypeScript**: Componentes tipados e reativos.
- **Vite**: Bundler ultrarrápido com Hot Module Replacement (HMR).
- **Tailwind CSS**: Estilização moderna mobile-first e glassmorphism.
- **@supabase/supabase-js**: Cliente oficial do Supabase para consultas e inserções em tempo real.
- **Lucide Icons**: Ícones minimalistas para interface mobile.
- **Canvas Confetti**: Efeito visual festivo na finalização de compras.

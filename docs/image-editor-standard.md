# Padrão do editor de imagens

Este documento define o padrão visual e de interação para qualquer modal de ajuste, recorte ou reposicionamento de imagens do site.

## Estrutura

- Modal branco, centralizado, com largura máxima de 720 px e cantos de 20 px.
- Cabeçalho compacto com identificação `Editor de imagem`, título do contexto e botão de fechar.
- Prévia grande e central. O formato deve reproduzir a proporção real em que a imagem aparecerá no site.
- Galerias podem exibir uma faixa compacta de miniaturas acima da prévia.
- Apenas um controle de zoom, acompanhado dos botões de diminuir e aumentar.
- Rodapé fixo no modal, com `Cancelar` como ação secundária e `Salvar` como ação principal.
- Se o conteúdo não couber na tela, somente o corpo do modal deve rolar; cabeçalho e rodapé permanecem visíveis.

## Comportamento

- A imagem é reposicionada por arraste direto na prévia.
- A prévia recebe foco e aceita as quatro teclas de direção para ajustes finos.
- O zoom deve ter intervalo de 1 a 3 e passos de 0,05.
- `Esc`, o botão de fechar e `Cancelar` fecham o modal sem salvar.
- O botão `Salvar` fica desabilitado quando não há imagem selecionada.
- O modal nunca pode ultrapassar a área visível: usar `100dvh` com margem de segurança.

## Aparência

- Usar exclusivamente a paleta do projeto: vinho, rosa suave, branco e tons neutros.
- Não usar azul, emojis ou caracteres como substitutos de ícones.
- Ícones devem vir de `UIIcons` e manter o mesmo traço visual do restante do site.
- A instrução de arraste aparece sobre a imagem em uma etiqueta escura translúcida e desaparece durante o movimento.
- Controles secundários são discretos; a ação de salvar é a única com preenchimento forte.
- Avatares usam máscara circular. Fotos de produtos, banners e galerias usam a proporção real do componente de destino.

## Acessibilidade

- Usar `role="dialog"`, `aria-modal="true"` e título associado por `aria-labelledby`.
- Todo botão com apenas ícone precisa de `aria-label`.
- A área de reposicionamento deve ser navegável por teclado e exibir foco visível.
- O texto da prévia deve explicar que arraste e teclas de direção reposicionam a imagem.

## Implementação de referência

O editor da Galeria da Loja Física, em `js/pages/store-gallery.js`, é a implementação de referência. A página de Novidades aplica o mesmo comportamento em `js/pages/novidades-content.js`, adaptando a proporção da prévia ao destino (hero, destaque ou card editorial). A criação de posts também segue o padrão em `js/pages/blog-editor.js`, usando a proporção real da capa. Novos editores devem reutilizar essa estrutura sempre que possível, evitando variações visuais ou comportamentais sem necessidade.

# VENEZA FUOCO — Relatório de Rebranding

**Base:** `SR_OFRELIO(3).rar` (47 entradas no arquivo RAR; projeto HTML/CSS/JavaScript, não React).
**Entrega:** projeto estático com identidade institucional da VENEZA FUOCO.
**Escopo:** marca, aparência visual, informações institucionais, Instagram, WhatsApp e endereço. Nenhuma alteração de regras comerciais foi autorizada.

## 1. Arquivos modificados

| Arquivo | Natureza da mudança |
|---|---|
| `config.js` | Marca, SEO, paleta, tipografia, logos, dados de contato, endereço, coordenadas, rotas Maps, descrição institucional e botões da tela de abertura. |
| `style.css` | Paleta preto/dourado, tons de superfícies, tipografia e apresentação responsiva das logos; detalhe de cores italianas na barra da marca; exibição institucional da logo na seção antes dedicada à fachada. |
| `translations.js` | Somente referências institucionais em inglês e espanhol: marca, cidade, SEO, hero, tela de abertura, localização e direitos autorais. |
| `index.html` | Menção institucional à marca, troca da antiga fachada por logotipo (mesmo componente), texto alternativo e declaração correta do tipo PNG do favicon. |
| `cardapio/config.js` | Marca, títulos, SEO, paleta, tipografia, Instagram, telefone e endereço. |
| `cardapio/style.css` | Paleta e tipografia; detalhes de identidade sem mudar estrutura dos componentes. |
| `cardapio/translations.js` | Marca, cidade, títulos/SEO e apresentação institucional nos três idiomas, sem mudar traduções de ingredientes, preços ou nomes de produtos. |
| `cardapio/index.html` | Title, metadados, logos, texto alternativo, cor do navegador e carregamento de fonte. |
| `cardapio/script.js` | Exclusivamente duas mensagens alternativas de identificação da marca; funções e identificadores intactos. |
| `cardapio/LEIA-ME.txt` | Cabeçalho e referência à paleta/tipografia atualizados para a marca. |
| `logo.png`, `cardapio/logo.png` | Substituídos pelo arquivo **original exato** fornecido (`logo(2).png`), sem alteração dos bytes. |
| `favicon.jpg` | Ícone antigo substituído por versão do logotipo; mantido caminho legado. |

**Recursos visuais novos:** `logo-marca-horizontal.png` (na raiz e no cardápio, recorte proporcional do lettering original), `favicon-veneza.png` (recorte do símbolo tipográfico original), sem redesenho das letras ou das formas.

O antigo arquivo `espaco-sr-ofrelio.png` foi **mantido no pacote por compatibilidade**, mas deixou de aparecer na interface. Não foi inventada uma fotografia do endereço novo: até o envio de uma foto real da VENEZA FUOCO, a seção conserva a estrutura e exibe a identidade enviada.

## 2. Dados institucionais atualizados

- **Marca:** VENEZA FUOCO
- **Instagram:** https://www.instagram.com/venezafuoco/
- **Endereço:** Avenida Brigadeiro Faria Lima, 1461 — São Paulo, SP
- **Mapa/rota:** https://www.google.com/maps/place/Avenida+Brigadeiro+Faria+Lima,+1461/@-23.5581665,-46.6625583,17z/
- **WhatsApp:** `5511916072188` — https://wa.me/5511916072188
- **Favicon:** `favicon-veneza.png`
- **Cores:** preto profundo `#080706`, dourado `#DDAF59`, dourado claro `#F0CE86`, superfície `#191411`, marfim `#FFF3D8` e detalhes verde/vermelho italiano.
- **Tipografia:** Montserrat em textos gerais e Cormorant Garamond nos títulos/assinatura. O carregamento da fonte requer internet e acesso ao Google Fonts; o código tem fallback.

O mapa incorporado usa uma consulta pelo endereço informado, e o link de rota mantém a URL entregue pelo usuário.

## 3. Funcionalidades e conteúdos preservados

- `script.js` (página principal) — **idêntico ao original**.
- `shared-cart.js` — **idêntico ao original**.
- `sr-operacao-live.js` e `cardapio/sr-operacao-live.js` — **idênticos ao original**.
- Objetos `horarios` das duas páginas — **idênticos ao original**, inclusive os valores de teste.
- Modais, condições, gatilhos, tempos, roleta, prêmios, campanhas, promoções, produtos, categorias, ingredientes, preços, adicionais, descontos, regras do checkout e integrações de delivery — **preservados**.
- IDs HTML, elementos e handlers inline — **preservados**, exceto mudanças autorizadas de apresentação/atributos.
- Chaves de `localStorage`, identificadores `SR_OFRELIO_*`, endpoints do Cloudflare Worker e dados de integração — **preservados**.
- Nome comercial **“Veganíssima Ofrélio”** e equivalentes traduzidos — preservados por ser nome de produto do cardápio, cuja alteração foi expressamente proibida.

## 4. Verificações efetivamente executadas

1. **43 arquivos de conteúdo** extraídos do RAR original, com os diretórios complementares mantidos.
2. `node --check` nos scripts JavaScript ativos: **sem erros de sintaxe**.
3. Comparação programática de **42 grupos de dados** originais versus atualizados, incluindo horário, modais, campanhas, roleta, produtos e preços: **sem divergências nos grupos protegidos**.
4. Parsing dos dois CSS: **sem erros de parsing de regras**.
5. Comparação das duas árvores HTML: **todos os IDs, quantidade de elementos e handlers inline preservados**.
6. Comparação de hash dos quatro scripts centrais não modificados: **idênticos aos originais**.
7. Comparação binária da logomarca principal no projeto: **idêntica ao arquivo recebido**.
8. Navegação em navegador Chromium isolado, com conteúdo local carregado inline e sem chamadas de rede: página inicial e cardápio em larguras **390 px e 1366 px**, abertura da tela inicial e seleção de categoria/produto; **nenhum erro JavaScript observado nesses cenários**. No cardápio a lista exibiu os produtos e valores originais; nos testes não houve overflow horizontal.
9. Links DOM gerados para Instagram, WhatsApp e Google Maps foram conferidos na página principal e no cardápio: **correspondem aos dados informados**. As mensagens automáticas foram preservadas em seu teor, com atualização somente das referências à marca.

**Limite importante:** o navegador de testes do ambiente bloqueia navegação HTTP e carregamento de recursos externos. Para simular a interface, o HTML/CSS/JS foi inserido em uma página isolada, e os logos foram carregados como imagens inline. A execução direta por URL pública, os serviços de terceiros, as operações reais do Worker, os links de delivery, o envio efetivo de pedidos/WhatsApp e testes físicos em Android/iOS **não foram realizados**. Não é correto classificá-los como aprovados.

## 5. Pendências e conflitos preexistentes preservados deliberadamente

### Prioridade crítica antes da publicação

**1. Links de delivery do restaurante antigo.** URLs de iFood e Entrega do Chef ainda contêm caminhos referentes a **Cianorte / Sr. Ofrélio**; foram preservadas por proibição explícita de alterar integrações e destinos comerciais. Publicar esses botões sem confirmação pode levar o cliente a outra empresa. O cardápio também conserva a URL genérica de iFood configurada em `integracoes.ifoodUrl`.

**2. Promoções com cidade antiga.** A promoção configurada na barra superior menciona **“Entrega Grátis em Cianorte”**. Ela foi mantida sem alteração por ser conteúdo comercial, inclusive no inglês/espanhol. A validação comercial para São Paulo é indispensável antes de publicar.

**3. Horário de teste ativo na página principal.** O arquivo `config.js` mantém `horarios.horaTeste = "19:00"`, ao passo que `cardapio/config.js` mantém o campo vazio, exatamente como no original. Esse valor provoca divergência entre os estados automáticos de funcionamento e não foi corrigido, conforme solicitação.

### Informações que exigem aprovação

**4. Depoimentos antigos:** há textos que mencionam Cianorte. Não foram reescritos nem apresentados como avaliações reais da nova marca.

**5. Nome de pizza:** “Veganíssima Ofrélio” e versões em outros idiomas continuam no catálogo, sem alteração comercial.

**6. Código de vouchers:** `roleta.prefixoVoucher` continua “Sr. Ofrélio” e `roleta.chaveLocalStorage` continua com o identificador antigo. Mudar o prefixo alteraria a identidade/codificação de prêmios e possivelmente a compatibilidade. Foi preservado como regra de negócio e precisa de autorização específica se houver migração de vouchers.

**7. Mídia histórica:** os vídeos e fotos existentes foram mantidos. Eles podem retratar outro estabelecimento; é necessário verificar a autorização de uso e substituí-los por material real caso o conteúdo não corresponda à VENEZA FUOCO.

**8. Instagram:** o perfil informado não pôde ser visualizado integralmente pela ferramenta de pesquisa no momento da implementação. A imagem oficial enviada foi usada como referência determinante.

**9. CEP/bairro:** não foram inventados dados ausentes; os campos estruturados foram deixados vazios. O endereço principal e as coordenadas seguem o fornecido pelo usuário.

## 6. Conclusão

**Rebranding visual e institucional concluído para validação**, com preservação comprovada dos grupos operacionais auditados. **Não publicar sem confirmar os itens críticos 1–3 e os direitos sobre conteúdos/mídias.** Mudanças futuras nesses itens são outra etapa e requerem autorização expressa, por estarem fora do escopo deste trabalho.

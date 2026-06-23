# 🎸 Escalas na Guitarra

Aplicação web para visualizar as notas de diversas escalas no braço da guitarra.
Não precisa de instalação nem servidor — é só abrir o `index.html` no navegador.

## Funcionalidades

- **Escolha do tom (tônica):** todas as 12 notas cromáticas.
- **Tônicas destacadas:** a nota raiz da escala aparece em vermelho em todo o braço.
- **Escalas disponíveis:**
  - **Principais:** Maior, Menor Natural, Menor Harmônica, Menor Melódica, Alterada (Super Lócrio).
  - **Modos gregos:** Jônio, Dórico, Frígio, Lídio, Mixolídio, Eólio, Lócrio.
  - **Pentatônicas / Blues:** Pentatônica Maior, Pentatônica Menor, Blues Menor, Blues Maior.
  - **Simétricas / exóticas:** Tons Inteiros, Diminuta (T-S e S-T), Frígio Dominante, Menor Húngara, Maior Harmônica.
- **Sobreposição de escalas:** adicione várias escalas (cada uma com seu tom e cor) para estudar troca de escalas no improviso. Notas comuns aparecem com a bolinha dividida nas cores das escalas.
- **Região do braço (box de posição):** ative uma janela de largura e posição configuráveis para focar em uma região do braço — ideal para misturar escalas sem sair da mesma posição. As notas de fora ficam esmaecidas (ou ocultas).
- **Afinações:** Padrão, Drop D, meio tom abaixo, um tom abaixo, DADGAD, Open G, Open D e 7 cordas.
- **Mostrar graus:** alterna entre nome das notas (C, D, E…) e graus (1, b3, 5…).
- **Número de casas:** 12, 15, 18, 22 ou 24.
- **Modo canhoto:** inverte o braço.
- **Áudio:** clique em uma nota para ouvi-la (usando a Web Audio API).

## Como usar

Abra o arquivo `index.html` no navegador. Ou, para servir localmente:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Estrutura

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Estrutura da página e controles. |
| `style.css`  | Estilos (visual do braço, notas, tema). |
| `script.js`  | Teoria musical (escalas/intervalos), render do braço e interação. |

## Adicionando novas escalas

Basta acrescentar uma entrada no objeto `SCALES` em `script.js` com os
intervalos em semitons a partir da tônica e os graus correspondentes:

```js
'minha_escala': {
  name: 'Minha Escala',
  intervals: [0, 2, 3, 5, 7, 9, 10],
  degrees:   ['1', '2', 'b3', '4', '5', '6', 'b7'],
},
```

E incluir a chave no grupo desejado dentro de `populateSelectors()`.

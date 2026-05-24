const imageContainer = document.getElementById("image-container");
const zoomBox = document.getElementById("zoom-box");
const image = document.getElementById("imagem");
const listaContainer = document.getElementById("listamarcadores");
const contadorMarcadores = document.getElementById("contador-marcadores");

const inputImagem = document.getElementById("input-imagem");
const botaoCarregarImagem = document.getElementById("botao-carregar-imagem");
const botaoGirar = document.getElementById("botao-girar");
const botaoSalvar = document.getElementById("botao-salvar");
const botaoTXT = document.getElementById("botao-txt");

const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const zoomResetBtn = document.getElementById("zoom-reset");

const sizeSelect = document.getElementById("size-select");
const colorSelect = document.getElementById("color-select");
const criterioSelect = document.getElementById("criterio-select");

let flags = [];
let currentRotation = 0;
let currentScale = 1;

/* APLICA ROTAÇÃO E ZOOM */
function atualizarTransformacaoImagem() {
    image.style.transform = `rotate(${currentRotation}deg) scale(${currentScale})`;
}

/* ATUALIZA CONTADOR */
function atualizarContador() {
    contadorMarcadores.textContent = flags.length;
}

/* RENUMERA MARCADORES */
function renumerarMarcadores() {
    flags.forEach((item, index) => {
        const indice = item.elemento.querySelector(".flag-index");
        if (indice) {
            indice.textContent = index + 1;
        }
    });
}

/* ATUALIZA LISTA */
function atualizarLista() {
    listaContainer.innerHTML = "";

    if (flags.length === 0) {
        listaContainer.innerHTML = `
            <p class="vazio">Nenhum marcador adicionado ainda.</p>
            <p class="vazio">Clique na imagem para adicionar marcadores.</p>
        `;
        atualizarContador();
        return;
    }

    flags.forEach((item, index) => {
        const itemLista = document.createElement("div");
        itemLista.classList.add("item-marcador");

        itemLista.innerHTML = `
            <strong>${index + 1} - ${item.criterio}</strong>
            <span>Posição: (${item.x}, ${item.y})</span>
            <span>Cor: ${item.cor} | Tamanho: ${item.tamanho}px</span>
        `;

        const btnExcluir = document.createElement("button");
        btnExcluir.classList.add("btn-excluir");
        btnExcluir.textContent = "Excluir";

        btnExcluir.addEventListener("click", () => {
            item.elemento.remove();
            flags.splice(index, 1);
            renumerarMarcadores();
            atualizarLista();
            atualizarContador();
        });

        itemLista.appendChild(btnExcluir);
        listaContainer.appendChild(itemLista);
    });
}

/* ADICIONA MARCADOR */
function adicionarMarcador(event) {
    const rect = image.getBoundingClientRect();

    const clickX = event.clientX;
    const clickY = event.clientY;

    if (
        clickX < rect.left ||
        clickX > rect.right ||
        clickY < rect.top ||
        clickY > rect.bottom
    ) {
        return;
    }

    const xRelativo = clickX - rect.left;
    const yRelativo = clickY - rect.top;

    const tamanho = parseInt(sizeSelect.value);
    const cor = colorSelect.value;
    const criterio = criterioSelect.value;

    const flag = document.createElement("div");
    flag.classList.add("flag");

    const alturaMarcador = Math.max(8, tamanho / 2);

    flag.style.width = `${tamanho}px`;
    flag.style.height = `${alturaMarcador}px`;
    flag.style.backgroundColor = cor;

    const posicaoX = xRelativo - tamanho / 2;
    const posicaoY = yRelativo - alturaMarcador / 2;

    flag.style.left = `${image.offsetLeft + posicaoX}px`;
    flag.style.top = `${image.offsetTop + posicaoY}px`;

    const indice = document.createElement("span");
    indice.classList.add("flag-index");
    indice.textContent = flags.length + 1;

    flag.appendChild(indice);
    imageContainer.appendChild(flag);

    flags.push({
        x: Math.round(xRelativo),
        y: Math.round(yRelativo),
        criterio: criterio,
        cor: cor,
        tamanho: tamanho,
        elemento: flag
    });

    atualizarLista();
    atualizarContador();
}

/* MOUSE MOVE - ZOOM */
imageContainer.addEventListener("mousemove", (event) => {
    const rect = image.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
    ) {
        const bgPosX = ((mouseX - rect.left) / rect.width) * 100;
        const bgPosY = ((mouseY - rect.top) / rect.height) * 100;

        zoomBox.style.opacity = "1";
        zoomBox.style.backgroundImage = `url(${image.src})`;
        zoomBox.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
        zoomBox.style.left = `${mouseX + 20}px`;
        zoomBox.style.top = `${mouseY + 20}px`;
    } else {
        zoomBox.style.opacity = "0";
    }
});

imageContainer.addEventListener("mouseleave", () => {
    zoomBox.style.opacity = "0";
});

/* CLIQUE PARA MARCAR */
imageContainer.addEventListener("click", adicionarMarcador);

/* GIRAR */
botaoGirar.addEventListener("click", () => {
    currentRotation += 180;
    atualizarTransformacaoImagem();
});

/* ZOOM */
zoomInBtn.addEventListener("click", () => {
    currentScale += 0.1;
    atualizarTransformacaoImagem();
});

zoomOutBtn.addEventListener("click", () => {
    if (currentScale > 0.3) {
        currentScale -= 0.1;
        atualizarTransformacaoImagem();
    }
});

zoomResetBtn.addEventListener("click", () => {
    currentScale = 1;
    currentRotation = 0;
    atualizarTransformacaoImagem();
});

/* CARREGAR IMAGEM */
botaoCarregarImagem.addEventListener("click", () => {
    if (inputImagem.files && inputImagem.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            image.src = e.target.result;

            flags.forEach((item) => item.elemento.remove());
            flags = [];

            atualizarLista();
            atualizarContador();

            currentScale = 1;
            currentRotation = 0;
            atualizarTransformacaoImagem();
        };

        reader.readAsDataURL(inputImagem.files[0]);
    } else {
        alert("Selecione uma imagem primeiro.");
    }
});

/* SALVAR IMAGEM */
botaoSalvar.addEventListener("click", () => {
    html2canvas(imageContainer).then((canvas) => {
        const link = document.createElement("a");
        link.download = "imagem-com-marcadores.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});

/* EXPORTAR TXT */
botaoTXT.addEventListener("click", () => {
    let titulo = "Correção";
    let subtitulo = "Erros encontrados";
    let listaTexto = "";

    flags.forEach((flag, index) => {
        listaTexto += `${index + 1} - ${flag.criterio} - (${flag.x}, ${flag.y})\n`;
    });

    const textoCompleto = `${titulo}\n${subtitulo}\n\n${listaTexto}`;

    const element = document.createElement("a");
    element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(textoCompleto)
    );
    element.setAttribute("download", "correcao.txt");
    element.style.display = "none";

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
});

/* INICIALIZA */
atualizarLista();
atualizarContador();
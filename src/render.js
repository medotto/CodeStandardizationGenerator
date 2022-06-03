// Importing dialog module using remote
const { dialog, Menu, MenuItem, getCurrentWindow } = require("@electron/remote");
const bootstrap = require("bootstrap");

//Main Content
const mainContent = document.getElementById("main-content");

//Buttons
const analisarBtn = document.getElementById("analisarBtn");
analisarBtn.onclick = analisar;

const gerarBtn = document.getElementById("gerarBtn");
gerarBtn.onclick = salvar;

//Input
const input = document.getElementById("inputText");

//Tema
const theme_menu = {
  label: "Tema",
  submenu: [
    {
      label: "Claro",
      click: async () => {
        if (analisarBtn.classList.contains("btn-light")) {
          analisarBtn.classList.replace("btn-light", "btn-dark");
        }
        if (mainContent.classList.contains("bg-dark")) {
          mainContent.classList.remove("bg-dark");
          mainContent.classList.remove("text-light");
        }
      },
    },
    {
      label: "Escuro",
      click: async () => {
        if (analisarBtn.classList.contains("btn-dark")) {
          analisarBtn.classList.replace("btn-dark", "btn-light");
        }
        if (!mainContent.classList.contains("bg-dark")) {
          mainContent.classList.add("bg-dark");
          mainContent.classList.add("text-light");
        }
      },
    },
  ],
};
const menu_default = Menu.getApplicationMenu();
menu_default.append(new MenuItem(theme_menu));
Menu.setApplicationMenu(menu_default);

const { writeFile } = require("fs");

const removeChildren = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};

async function analisar() {
  const v = document.querySelector("#variables");
  removeChildren(v);

  const text = input.value;

  let exp = /\$\((.)+?\)/g; // $(...)
  let matches = text.match(exp);
  matches = [...new Set(matches)];

  let fieldset_din, legend_din, div_din, label_din, input_din, div_curr;
  const variables = document.getElementById("variables");

  // fieldset configuração
  fieldset_din = document.createElement("fieldset");
  fieldset_din.setAttribute("id", "fieldset_config");
  fieldset_din.setAttribute("name", "fieldset_config");
  fieldset_din.setAttribute("class", "form-group border p-3 mt-3");
  variables.appendChild(fieldset_din);

  const fieldset_config = document.getElementById("fieldset_config");

  legend_din = document.createElement("legend");
  legend_din.setAttribute("id", "fieldset_config_legend");
  legend_din.setAttribute("name", "fieldset_config_legend");
  legend_din.setAttribute("class", "float-none w-auto px-2 mb-0");
  legend_din.innerHTML = "Configuração";
  fieldset_config.appendChild(legend_din);

  // fieldset variáveis
  fieldset_din = document.createElement("fieldset");
  fieldset_din.setAttribute("id", "fieldset_fields");
  fieldset_din.setAttribute("name", "fieldset_fields");
  fieldset_din.setAttribute("class", "form-group border p-3 mt-3");
  variables.appendChild(fieldset_din);

  const fieldset = document.getElementById("fieldset_fields");

  legend_din = document.createElement("legend");
  legend_din.setAttribute("id", "fieldset_legend");
  legend_din.setAttribute("name", "fieldset_legend");
  legend_din.setAttribute("class", "float-none w-auto px-2 mb-0");
  legend_din.innerHTML = "Variáveis";
  fieldset.appendChild(legend_din);

  // separador
  div_din = document.createElement("div");
  div_din.setAttribute("id", "div_separador");
  div_din.setAttribute("name", "div_separador");

  label_din = document.createElement("label");
  label_din.setAttribute("id", "label_separador");
  label_din.setAttribute("name", "label_separador");
  label_din.setAttribute("for", "input_separador");
  label_din.innerHTML = 'Separador (Em branco = ","): ';

  input_din = document.createElement("input");
  input_din.setAttribute("id", "input_separador");
  input_din.setAttribute("name", "input_separador");
  input_din.setAttribute("type", "text");
  input_din.setAttribute("value", "");
  input_din.setAttribute("class", "form-control d-block");
  input_din.setAttribute("style", "width: 16.66666667% !important");

  fieldset_config.appendChild(div_din);
  div_curr = document.getElementById("div_separador");
  div_curr.appendChild(label_din);
  div_curr.appendChild(input_din);

  // input nome dos arquivos
  div_din = document.createElement("div");
  div_din.setAttribute("id", "div_nomes");
  div_din.setAttribute("name", "div_nomes");

  label_din = document.createElement("label");
  label_din.setAttribute("id", "label_nomes");
  label_din.setAttribute("name", "label_nomes");
  label_din.setAttribute("for", "input_nomes");
  label_din.setAttribute("class", "mt-3");
  label_din.innerHTML = "Nomes dos arquivos (Não repetir. Se repetir, os arquivos serão sobrescritos pelos últimos com mesmo nome. Em branco = 0, 1, 2, etc.): ";

  input_din = document.createElement("input");
  input_din.setAttribute("id", "input_nomes");
  input_din.setAttribute("name", "input_nomes");
  input_din.setAttribute("type", "text");
  input_din.setAttribute("value", "");
  input_din.setAttribute("class", "form-control w-100");

  fieldset_config.appendChild(div_din);
  div_curr = document.getElementById("div_nomes");
  div_curr.appendChild(label_din);
  div_curr.appendChild(input_din);

  // inputs dinâmicos
  for (let index = 0; index < (matches ? matches.length : 0); index++) {
    div_din = document.createElement("div");
    div_din.setAttribute("id", "div_".concat(index));
    div_din.setAttribute("name", "div_".concat(index));
    if (index !== 0) {
      div_din.setAttribute("class", "mt-3");
    }

    label_din = document.createElement("label");
    label_din.setAttribute("id", "label_".concat(index));
    label_din.setAttribute("name", "label_".concat(index));
    label_din.setAttribute("for", "input_".concat(index));
    label_din.innerHTML = matches[index].concat(": ");

    input_din = document.createElement("input");
    input_din.setAttribute("id", "input_".concat(index));
    input_din.setAttribute("name", "input_".concat(index));
    input_din.setAttribute("type", "text");
    input_din.setAttribute("value", "");
    input_din.setAttribute("class", "form-control w-100");

    fieldset.appendChild(div_din);
    div_curr = document.getElementById("div_".concat(index));
    div_curr.appendChild(label_din);
    div_curr.appendChild(input_din);
  }

  gerarBtn.removeAttribute("disabled");
}

async function salvar() {
  const divs = document.querySelectorAll("#fieldset_fields div");
  const separador_default = ",";

  separador = document.getElementById("input_separador").value;
  if (separador === "") {
    separador = separador_default;
  }

  const nomes = document.getElementById("input_nomes").value.split(separador);

  const inputs = document.querySelectorAll("#fieldset_fields input");
  let qtde_arr = [];
  for (let aux = 0; aux < inputs.length; aux++) {
    qtde_arr.push(inputs[aux].value.split(separador).length);
  }
  const qtde = Math.max(...qtde_arr);

  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: "Salvar Arquivos",
  });

  const filePathNorm = filePath.slice(0, filePath.lastIndexOf("/"));

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
  }

  for (let index = 0; index < qtde; index++) {
    let text = input.value;

    for (let i = 0; i < divs.length; i++) {
      let exp = /\$\((.)+?\)/; // $(...)
      const label_cur = divs[i].childNodes[0].innerHTML.match(exp)[0].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      const input_comp = divs[i].childNodes[1].value;
      const input_arr = input_comp.split(separador);

      text = replaceAll(text, label_cur, input_arr[index] ? input_arr[index] : "");
    }

    const end = "/".concat(!nomes[index] || nomes[index] === "" ? index + 1 : nomes[index]);
    writeFile(filePathNorm.concat(end), text, () => console.log("Salvo com sucesso"));
  }
}

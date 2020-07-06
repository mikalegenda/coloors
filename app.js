//Global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const copyPopup = document.querySelector(".copy-container");
const adjustBtn = document.querySelectorAll(".adjust");
const lockBtn = document.querySelectorAll(".lock");
const closeAdjust = document.querySelectorAll(".close-adjustment");
const sliderContainer = document.querySelectorAll(".sliders");
let initialColors;
let savePalettes = [];

//Color generator
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

//Adding event listeners
generateBtn.addEventListener("click", randomColors);
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});

currentHexes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipboard(hex);
  });
});

copyPopup.addEventListener("transitionend", () => {
  const popupBox = copyPopup.children[0];
  copyPopup.classList.remove("active");
  popupBox.classList.remove("active");
});

adjustBtn.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    openAdjustmentPanel(index);
  });
});

closeAdjust.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    closeAdjustmentPanel(index);
  });
});

lockBtn.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    lockColor(index);
  });
});

//Adding the colors to div background and hex code
function randomColors() {
  //initial colors
  initialColors = [];

  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();

    // Add it to the array
    if (div.classList.contains("locked")) {
      initialColors.push(hexText.innerText);
      return;
    } else {
      initialColors.push(chroma(randomColor).hex());
    }

    div.style.background = randomColor;
    hexText.innerText = randomColor;

    //Check for contrast
    checkTextContrast(randomColor, hexText);

    //Initial Colorized Sliders
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const bright = sliders[1];
    const sat = sliders[2];

    colorizeSliders(color, hue, bright, sat);
  });

  //Reset slider inputs
  resetInputs();

  //Check for button contrast
  adjustBtn.forEach((btn, index) => {
    checkTextContrast(initialColors[index], btn);
    checkTextContrast(initialColors[index], lockBtn[index]);
  });
}

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hue, bright, sat) {
  //Scale Saturation Slider
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);

  //Scale Brightness Slider
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  //Input bg update
  sat.style.background = `linear-gradient(to right, ${scaleSat(0)},${scaleSat(1)})`;
  hue.style.background = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
  bright.style.background = `linear-gradient(to right, ${scaleBright(0)},${scaleBright(0.5)},${scaleBright(1)})`;
}

function hslControls(e) {
  const index = e.target.getAttribute("data-bright") || e.target.getAttribute("data-hue") || e.target.getAttribute("data-sat");
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const bright = sliders[1];
  const sat = sliders[2];

  const currentBgColor = initialColors[index];

  let color = chroma(currentBgColor).set("hsl.s", sat.value).set("hsl.l", bright.value).set("hsl.h", hue.value);

  colorDivs[index].style.background = color;

  //Update input colors
  colorizeSliders(color, hue, bright, sat);
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.background);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");

  textHex.innerText = color.hex();

  //Check contrast
  checkTextContrast(color, textHex);

  for (icon of icons) {
    checkTextContrast(color, icon);
  }
}

function resetInputs() {
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    } else if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[1];
      slider.value = Math.floor(brightValue * 100) / 100;
    } else if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

function copyToClipboard(hex) {
  const element = document.createElement("textarea");
  element.value = hex.innerText;
  document.body.appendChild(element);
  element.select();
  document.execCommand("copy");
  document.body.removeChild(element);

  //Pop-up Animation
  const popupBox = copyPopup.children[0];
  copyPopup.classList.add("active");
  popupBox.classList.add("active");
}

function openAdjustmentPanel(index) {
  sliderContainer[index].classList.toggle("active");
}

function closeAdjustmentPanel(index) {
  sliderContainer[index].classList.remove("active");
}

function lockColor(index) {
  colorDivs[index].classList.toggle("locked");
  lockBtn[index].children[0].classList.toggle("fa-lock-open");
  lockBtn[index].children[0].classList.toggle("fa-lock");
}

randomColors();

//Global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");

//Color generator
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

//Adding event listeners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

//Adding the colors to div background and hex code
function randomColors() {
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();

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
  bright.style.background = `linear-gradient(to right, ${scaleBright(0)},${scaleBright(
    0.5
  )},${scaleBright(1)})`;
}

function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-sat");
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const bright = sliders[1];
  const sat = sliders[2];

  const currentBgColor = colorDivs[index].querySelector("h2").innerText;

  let color = chroma(currentBgColor)
    .set("hsl.s", sat.value)
    .set("hsl.l", bright.value)
    .set("hsl.h", hue.value);

  colorDivs[index].style.background = color;
}

randomColors();

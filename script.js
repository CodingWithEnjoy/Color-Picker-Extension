const colorPickerBtn = document.querySelector("#color-picker");
const clearAll = document.querySelector(".clear-all");
const colorList = document.querySelector(".all-colors");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

const copyColor = (elem) => {
  elem.innerText = "Copied";
  navigator.clipboard.writeText(elem.dataset.color);
  setTimeout(() => (elem.innerText = elem.dataset.color), 1000);
};

const showColor = () => {
  if (!pickedColors.length) return;
  colorList.innerHTML = pickedColors
    .map(
      (color) => `
        <li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${
        color == "#ffffff" ? "#ccc" : color
      }"></span>
            <span class="value hex" data-color="${color}">${color}</span>
        </li>
    `
    )
    .join("");
  document.querySelector(".picked-colors").classList.remove("hide");

  document.querySelectorAll(".color").forEach((li) => {
    li.addEventListener("click", (e) =>
      copyColor(e.currentTarget.lastElementChild)
    );
  });
};
showColor();

const activateEyeDropper = () => {
  document.body.style.display = "none";
  setTimeout(async () => {
    try {
      const eyeDropper = new EyeDropper();
      const { sRGBHex } = await eyeDropper.open();
      navigator.clipboard.writeText(sRGBHex);

      if (!pickedColors.includes(sRGBHex)) {
        pickedColors.push(sRGBHex);
        localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
        showColor();
      }
    } catch (error) {
      alert("Failed to copy the color code!");
    }
    document.body.style.display = "block";
  }, 10);
};

const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
  document.querySelector(".picked-colors").classList.add("hide");
};

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);

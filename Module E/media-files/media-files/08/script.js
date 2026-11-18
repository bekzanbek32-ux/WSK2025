const xOffsetInput = document.getElementById('xOffset');
const yOffsetInput = document.getElementById('yOffset');
const spreadInput = document.getElementById('spread');
const blurInput = document.getElementById('blur');
const colorInput = document.getElementById('shadowColor');
const generatorBox = document.getElementById('generatorBox');
const codeOutput = document.getElementById('codeOutput');
const copyBtn = document.getElementById('copyBtn');

function updateShadow() {
    const x = xOffsetInput.value;
    const y = yOffsetInput.value;
    const spread = spreadInput.value;
    const blur = blurInput.value;
    const color = colorInput.value;


    const shadowValue = `${x}px ${y}px ${blur}px ${spread}px ${color}`;

    generatorBox.style.boxShadow = shadowValue;

    codeOutput.value = `box-shadow: ${shadowValue};`;

    document.documentElement.style.setProperty('--thumb-color', color);
}

xOffsetInput.addEventListener('input', updateShadow);
yOffsetInput.addEventListener('input', updateShadow);
spreadInput.addEventListener('input', updateShadow);
blurInput.addEventListener('input', updateShadow);
colorInput.addEventListener('input', updateShadow);

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeOutput.value).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1500);
    });
});

updateShadow();
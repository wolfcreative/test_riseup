// input[type=range]
export function range(){
    let inputs = [...document.querySelectorAll('input[type=range]')]

    for (let input of inputs){
        input.classList.add('margin-remove')

        let caption = ''
        if (input.getAttribute('data-range-caption')){
            caption = input.getAttribute('data-range-caption')
        }

        let value = input.value

        let oldHTML = input.outerHTML
        let newHTML = `
            <div class="range-wrapper flex flex-middle" style="padding-top:9px">
                ${oldHTML}
                <div class="range-value margin-medium-left">${value}${caption}</div>
            </div>
        `;

        input.outerHTML = newHTML;
    }

    let inputs2 = [...document.querySelectorAll('input[type=range]')]
    for (let input of inputs2){
        commonInputRange(input)

        "input change".split(" ").forEach((evt) => 
            input.addEventListener(evt, () => {
                commonInputRange(input)
            })
        );
    }
}

// input[type=range] commons
function commonInputRange(item) {
    let value = item.value

    let caption = ''
    if (item.getAttribute('data-range-caption')){
        caption = item.getAttribute('data-range-caption')
    }

    if (item.nextElementSibling){
        item.nextElementSibling.innerHTML = value + caption
        
        // Для хромоподобных
        if(navigator.userAgent.indexOf('AppleWebKit') != -1){
            let percent = Number(((value - item.getAttribute('min')) * 100) / (item.getAttribute('max') - item.getAttribute('min'))) + '%'
    
            item.style.backgroundImage = `linear-gradient(to right, #2EB670 0%, #2EB670 ${percent}, #dbdcde ${percent}, #dbdcde 100%)`;
        }
    }
}
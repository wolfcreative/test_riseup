document.addEventListener('DOMContentLoaded', () => {
    // JS-сетка
    // Аналог UiKit3 Grid = https://getuikit.com/docs/grid
    // 
    // В чём фича: у нас есть сетка, у нас есть классы ширины которые зависимые от размера экрана.
    // Вручную задавать margin для отступа сверху не получится из-за классов ширины. А значит нужно проставлять в нужный момент нужному блоку отступ сверху.
    //
    // Пока всё написано на jQuery, ибо с ним проще и быстрее. В будущем перепишу на чистый JS. Скорость обработки слишком очень важна.

    function grid(){
        let grids = $('[data-grid]');

        $(grids).each(function( ) {
            let blocks = $(this).children();
            let arr = [];

            $( blocks ).each(function( ) {
                let $this = $(this);

                let y = $this.position().top;
            
                let rowBlocks = $this;
            
                for (let i = $this.index() - 1; i >= 0; i--) {
                    let block = blocks.eq(i);

                    if (block.position().top == y) {
                        rowBlocks = rowBlocks.add(block);
                    } else {
                        break;
                    }
                }
                
                for (let i = $this.index() + 1; i < blocks.length; i++) {
                    let block = blocks.eq(i);
                        
                    if (block.position().top == y || y - block.position().top > 0) {
                        rowBlocks = rowBlocks.add(block);
                    } else {
                        break;
                    }
                }

                rowBlocks.addClass('grid-margin');
                
                arr.push(rowBlocks)
            });

            arr.forEach(function (value, i) {
                if (i == 0){
                    value.removeClass('grid-margin')
                }
            });
        });
    }

    // Инициализация
    window.onload = () => {
        grid()
    };
    
    // Ресайз окна
    window.onresize = () => {
        grid()
    };
})
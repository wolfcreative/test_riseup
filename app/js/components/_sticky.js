// Поддержка position:sticky для IE
export function sticky(){
    if((navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1)){
        let nav = document.querySelector('.position-sticky');
        let offset = nav.getBoundingClientRect();

        ['scroll', 'resize'].forEach(function(e){
            window.addEventListener(e, () => {
                if (window.innerWidth >= 960){
                    if (window.pageYOffset > offset.top - 34) {
                        nav.style.position = 'fixed';
                        nav.style.top = '24px';
                    } else {
                        nav.style.position = 'relative';
                        nav.style.top = '';
                    }
                } else {
                    nav.style.position = 'relative';
                    nav.style.top = '';
                }
            });
        });
    }
}
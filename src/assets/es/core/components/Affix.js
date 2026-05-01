export default function affix() {
    const $affixElement = $('.affix');

    if($affixElement) {

        const offset = parseInt($affixElement.data('affix-offset'), 10) || 0;

        const affixTop = $affixElement.offset()?.top;

        $(window).on("scroll",(function() {
            const scrollTop = $(window).scrollTop();

            if (scrollTop >= affixTop - offset) {
                $affixElement.css({
                    position: 'fixed',
                    top: offset + 'px',
                    width: '100%',
                    zIndex: '30'
                });
            } else {
                $affixElement.css({
                    position: '',
                    top: '',
                    width: '',
                    zIndex: ''
                });
            }
        }));
    }
}
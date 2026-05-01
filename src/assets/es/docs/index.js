import copyToClipboard from '../utils/copyToClipboard'

function docInit () {

    $('.button-show-code').on('click', function() {
        $(this).parent().parent().parent('.demo-action-bar').siblings('.demo-code-snippet').toggleClass('hidden')
    });


    $('.button-copy').on('click', function() {
        const codeContainers = $(this).parent().parent().parent('.demo-action-bar').siblings('.demo-code-snippet');
        let codeText = "";
        const codeToastWrapperId = '#code-copy-toast-wrapper'
        codeContainers.each(function(index, element) {
            const codeElement = $(element).find('code');
            codeText += codeElement.text().trim() + "\n";
        });

        if (codeText.length > 0) {
            copyToClipboard(codeText);
            if ($(`${codeToastWrapperId}`).length == 0) {
                $('body').append('<div id="code-copy-toast-wrapper" class="toast-wrapper top-center"></div>');
            }

            const toastHTML = `<div class="toast fade">
                <div class="notification">
                    <div class="notification-content">
                        <div class="mr-3">
                            <span class="text-2xl text-emerald-400">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                            </span>
                        </div>
                        <div class="mr-4">
                            <div class="notification-title">Copied</div>
                        </div>
                    </div>
                </div>
            </div>`
            $(`${codeToastWrapperId}`).append(toastHTML)
            $(`${codeToastWrapperId} .toast:last-child`).toast('show');
            setTimeout(function(){ 
                $(`${codeToastWrapperId} .toast:first-child`).remove();
            }, 2000);
        }
    });
}

export default { docInit }
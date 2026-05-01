export default function (text) {
    const textArea = $('<textarea/>');
    textArea.val(text);
    $('body').append(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
}
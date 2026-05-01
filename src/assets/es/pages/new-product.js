new Quill('#description', {
    theme: 'snow',
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],               
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],  
        [{ 'align': [] }],
        ['link', 'image']                        
    ]
});

let isSticky = false;
let cachedRef = $('#stickyFooter')[0];

let observer = new IntersectionObserver(
    function(entries) {
        isSticky = entries[0].intersectionRatio < 1;
        $('#stickyFooter').toggleClass('border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700', isSticky);
    },
    {
        threshold: [1]
    }
);

observer.observe(cachedRef);

$(window).on('beforeunload', function() {
    observer.unobserve(cachedRef);
});
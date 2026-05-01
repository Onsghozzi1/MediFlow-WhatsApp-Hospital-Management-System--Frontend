export default function (selector, classes = []) {

    classes.forEach((cls) => {
        $(selector).removeClass(cls)
    })
}
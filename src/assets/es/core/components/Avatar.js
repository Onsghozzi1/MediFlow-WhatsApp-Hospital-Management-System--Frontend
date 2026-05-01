export default function Avatar () {
    const elements = document.querySelectorAll('[data-avatar-size]');

    elements.forEach((element) => {

        const avatarSize = element.getAttribute('data-avatar-size');

        element.style.width = `${avatarSize}px`;
        element.style.height = `${avatarSize}px`;
        element.style.minWidth = `${avatarSize}px`;
        element.style.lineHeight = `${avatarSize}px`;
    });
}
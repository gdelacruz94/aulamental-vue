export function menuDropdownPerfil() {
    const menu = document.getElementById('menuperfil');


    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        document.removeEventListener('click', handleClickOutside);
    } else {
        menu.classList.add('active');

        // Esperar un momento para evitar que el mismo clic lo cierre
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);
    }

    function handleClickOutside(e) {
        if (!menu.contains(e.target)) {
            menu.classList.remove('active');
            document.removeEventListener('click', handleClickOutside);
        }
    }
}

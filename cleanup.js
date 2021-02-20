document.addEventListener('DOMContentLoaded', function() {
    var cleanup_style = document.createElement('style');

    cleanup_style.innerHTML = `
        .unknown,
        #unknown {
            display: none !important;
        }
    `;

    document.head.appendChild(cleanup_style);
});

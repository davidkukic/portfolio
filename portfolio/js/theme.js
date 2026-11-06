(function () {
    var T = [
            [
                'blau', 'Blau'
            ],
            [
                'violett', 'Violett'
            ]
        ],
        root = document.documentElement,
        cur = 'blau';
    try {
        var s = localStorage.getItem('theme');
        if (s && T.some(function (x) {
            return x[0] === s;
        })) 
            cur = s;
        }
    catch (e) {}
    root.setAttribute('data-theme', cur);
    function mark() {
        document
            .querySelectorAll('.swatch')
            .forEach(function (b) {
                b.setAttribute('aria-pressed', b.dataset.theme === cur);
            });
    }
    document.addEventListener('DOMContentLoaded', function () {
        var ul = document.querySelector('.site-nav ul');
        if (!ul) 
            return;
        var li = document.createElement('li');
        li.className = 'themes';
        li.setAttribute('role', 'group');
        li.setAttribute('aria-label', 'Farbschema');
        T.forEach(function (t) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'swatch';
            b.dataset.theme = t[0];
            b.setAttribute('aria-label', 'Farbschema ' + t[1]);
            b.addEventListener('click', function () {
                cur = t[0];
                root.setAttribute('data-theme', cur);
                try {
                    localStorage.setItem('theme', cur);
                } catch (e) {}
                mark();
            });
            li.appendChild(b);
        });
        ul.appendChild(li);
        mark();
    });
})();
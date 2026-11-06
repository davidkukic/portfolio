/*  Start-Animation: Die sechs Seiten des Würfels fliegen heran und setzen sich 
 * zusammen. 
 */
(function () {
    var root = document.documentElement;
    function done() {
        root
            .classList
            .remove('intro');
        root.style.overflow = '';
    }
    if (!root.classList.contains('intro')) 
        return;
    var faces = []
        .slice
        .call(document.querySelectorAll('.cube .face'));
    if (!faces.length || !faces[0].animate) {
        done();
        return;
    }
    window.scrollTo(0, 0);
    var failsafe = setTimeout(done, 6000);
    var dur = 1100,
        gap = 140;
    function rnd(a, b) {
        return a + Math.random() * (b - a);
    }
    // feste Startrichtungen: jede Seite kommt aus einer anderen Ecke
    var dirs = [
        [
            -1, -1
        ],
        [
            1, -1
        ],
        [
            1, 1
        ],
        [
            -1, 1
        ],
        [
            0, -1.3
        ],
        [
            0, 1.3
        ]
    ];
    function go() {
        var anims = faces.map(function (f, i) {
            var end = getComputedStyle(f).transform;
            if (end === 'none') 
                end = '';
            var d = dirs[i % dirs.length],
                dist = 22;
            var from = 'translate3d(' + (
                d[0] * dist
            ) + 'rem,' + (
                d[1] * dist * .6
            ) + 'rem,' + rnd(-18, -8) + 'rem) rotate3d(' + rnd(-1, 1) + ',' + rnd(-1, 1) +
                    ',1,' + rnd(90, 200) + 'deg) scale(.4) ' + end;
            return f.animate([
                {
                    transform: from,
                    opacity: 0
                }, {
                    transform: end,
                    opacity: 1
                }
            ], {
                duration: dur,
                delay: i * gap,
                easing: 'cubic-bezier(.2,.85,.2,1)',
                fill: 'both'
            });
        });
        var total = dur + gap * (faces.length - 1);
        // Text, Menü und Schilder erscheinen kurz bevor der Würfel fertig ist
        setTimeout(function () {
            root
                .classList
                .remove('intro');
            root
                .classList
                .add('intro-end');
        }, total - 500);
        setTimeout(function () {
            anims.forEach(function (a) {
                a.cancel();
            });
            clearTimeout(failsafe);
            root.style.overflow = '';
            setTimeout(function () {
                root
                    .classList
                    .remove('intro-end');
            }, 1500);
        }, total + 50);
    }
    if (document.readyState === 'complete') 
        requestAnimationFrame(go);
    else 
        window.addEventListener('load', function () {
            requestAnimationFrame(go);
        });
    }
)();
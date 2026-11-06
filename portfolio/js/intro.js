/* Start-Animation: Die sechs Seiten setzen sich in der Mitte zum Würfel zusammen, dann gleitet er nach rechts an seinen Platz. */
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
    var stage = document.querySelector('.stage');
    var faces = []
        .slice
        .call(document.querySelectorAll('.cube .face'));
    if (!stage || !faces.length || !faces[0].animate) {
        done();
        return;
    }
    window.scrollTo(0, 0);
    root.style.overflow = 'hidden';
    var failsafe = setTimeout(done, 8000);
    var dur = 1200,
        gap = 150,
        move = 400,
        pause = 300;
    function rnd(a, b) {
        return a + Math.random() * (b - a);
    }
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
        var r = stage.getBoundingClientRect(),
            vw = window.innerWidth,
            vh = window.innerHeight;
        var dx = vw / 2 - (r.left + r.width / 2),
            dy = vh / 2 - (r.top + r.height / 2),
            big = vw < 820
                ? 1.5
                : 1.9;
        var assemble = dur + gap * (faces.length - 1),
            all = assemble + pause + move;
        stage.style.position = 'relative';
        stage.style.zIndex = '40';
        stage.style.pointerEvents = 'none';
        var from = 'translate(' + dx + 'px,' + dy + 'px) scale(' + big + ')';
        var sa = stage.animate([
            {
                transform: from,
                offset: 0,
                easing: 'linear'
            }, {
                transform: from,
                offset: (assemble + pause) / all,
                easing: 'cubic-bezier(.65,0,.25,1)'
            }, {
                transform: 'none',
                offset: 1
            }
        ], {
            duration: all,
            fill: 'both'
        });
        var anims = faces.map(function (f, i) {
            var end = getComputedStyle(f).transform;
            if (end === 'none') 
                end = '';
            var d = dirs[i % dirs.length],
                dist = 22;
            var start = 'translate3d(' + (
                d[0] * dist
            ) + 'rem,' + (
                d[1] * dist * .6
            ) + 'rem,' + rnd(-18, -8) + 'rem) rotate3d(' + rnd(-1, 1) + ',' + rnd(-1, 1) +
                    ',1,' + rnd(90, 200) + 'deg) scale(.4) ' + end;
            return f.animate([
                {
                    transform: start,
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
        // Text, Menü und Schilder erscheinen, während der Würfel nach rechts gleitet
        setTimeout(function () {
            root
                .classList
                .remove('intro');
            root
                .classList
                .add('intro-end');
        }, assemble + pause + move * .4);
        setTimeout(function () {
            anims.forEach(function (a) {
                a.cancel();
            });
            sa.cancel();
            stage.style.position = stage.style.zIndex = stage.style.pointerEvents = '';
            clearTimeout(failsafe);
            root.style.overflow = '';
            setTimeout(function () {
                root
                    .classList
                    .remove('intro-end');
            }, 1500);
        }, all + 50);
    }
    if (document.readyState === 'complete') 
        requestAnimationFrame(go);
    else 
        window.addEventListener('load', function () {
            requestAnimationFrame(go);
        });
    }
)();
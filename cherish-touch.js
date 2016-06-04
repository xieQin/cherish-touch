var touch,
    action,
    diffX,
    diffY,
    endX,
    endY,
    scroll,
    sort,
    startX,
    startY,
    swipe,

function testTouch(e) {
    if (e.type == 'touchstart') {
        touch = true;
    } else if (touch) {
        touch = false;
        return false;
    }
    return true;
}

function onStart(ev) {
    if (testTouch(ev) && !action) {
        action = true;

        startX = getCoord(ev, 'X');
        startY = getCoord(ev, 'Y');
        diffX = 0;
        diffY = 0;

        sortTimer = setTimeout(function () {
            sort = true;
        }, 200);

        if (ev.type == 'mousedown') {
            $(document).on('mousemove', onMove).on('mouseup', onEnd);
        }
    }
}

function onMove(ev) {
    if (action) {
        endX = getCoord(ev, 'X');
        endY = getCoord(ev, 'Y');
        diffX = endX - startX;
        diffY = endY - startY;

        if (!sort && !swipe && !scroll) {
            if (Math.abs(diffY) > 10) { // It's a scroll
                scroll = true;
                // Android 4.0 will not fire touchend event
                $(this).trigger('touchend');
            } else if (Math.abs(diffX) > 7) { // It's a swipe
                swipe = true;
            }
        }

        if (swipe) {
            ev.preventDefault(); // Kill page scroll
            // Handle swipe
            // ...
        }

        if (sort) {
            ev.preventDefault(); // Kill page scroll
            // Handle sort
            // ....
        }

        if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
            clearTimeout(sortTimer);
        }
    }
}

function onEnd(ev) {
    if (action) {
        action = false;

        if (swipe) {
            // Handle swipe end
            // ...
        } else if (sort) {
            // Handle sort end
            // ...
        } else if (!scroll && Math.abs(diffX) < 5 && Math.abs(diffY) < 5) { // Tap
            if (ev.type === 'touchend') { // Prevent phantom clicks
                ev.preventDefault();
            }
            // Handle tap
            // ...
        }

        swipe = false;
        sort = false;
        scroll = false;

        clearTimeout(sortTimer);

        if (ev.type == 'mouseup') {
            $(document).off('mousemove', onMove).off('mouseup', onEnd);
        }
    }
}

element
    .on('touchstart mousedown', onStart)
    .on('touchmove', onMove)
    .on('touchend touchcancel', onEnd)
import React from "react";
import Two from "two.js"

export default function App() {
    const two = new Two({
        type: Two.Types.svg,
        fullscreen: true,
        autostart: true
    }).appendTo(document.body);

    two.renderer.domElement.style.background = '#fcb215';
    two.renderer.domElement.style.cursor = 'none';

    const cx = two.width / 2;
    const cy = two.height / 2;
    const delta = new Two.Vector();
    const mouse = new Two.Vector(cx, cy);
    const drag = 0.33;
    const radius = 50;

    const shape = new Two.Circle(0, 0, radius, 32);

    const shadow = new Two.Path(shape.vertices, true, true);
    shadow.position.set(cx, cy);
    shadow.noStroke().fill = 'rgba(0, 0, 0, 0.2)';
    shadow.offset = new Two.Vector(- radius / 2, radius * 2);
    shadow.scale = 1.2;

    const ball = new Two.Path(shape.vertices, true, true);
    ball.position.set(cx, cy);
    ball.noStroke().fill = 'white';

    for (let i = 0; i < ball.vertices.length; i++) {
        const v = ball.vertices[i];
        v.origin = v.clone();
    }

    two.add(shadow, ball);

    window.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        shadow.offset.x = 5 * radius * (mouse.x - two.width / 2) / two.width;
        shadow.offset.y = 5 * radius * (mouse.y - two.height / 2) / two.height;
    }, false);

    window.addEventListener('touchstart', function(e) {
        e.preventDefault();
        return false;
    }, false);

    window.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        mouse.x = touch.pageX;
        mouse.y = touch.pageY;
        shadow.offset.x = 5 * radius * (mouse.x - two.width / 2) / two.width;
        shadow.offset.y = 5 * radius * (mouse.y - two.height / 2) / two.height;
        return false;
    }, false);

    two.bind('update', function() {

        delta.copy(mouse).subSelf(ball.translation);

        for (let i = 0; i < ball.vertices.length; i++) {

            const v = ball.vertices[i];
            const dist = v.origin.distanceTo(delta);
            const pct = dist / radius;

            const x = delta.x * pct;
            const y = delta.y * pct;

            const destx = v.origin.x - x;
            const desty = v.origin.y - y;

            v.x += (destx - v.x) * drag;
            v.y += (desty - v.y) * drag;

            shadow.vertices[i].copy(v);

        }

        ball.translation.addSelf(delta);

        shadow.translation.copy(ball.translation);
        shadow.translation.addSelf(shadow.offset);

    });

    return (
        <div>
            <h1/>
        </div>
    )
}

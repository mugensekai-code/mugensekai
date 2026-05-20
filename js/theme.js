// theme.js — カーソル追従のみ担当
// <script src="./theme.js" defer></script> で読み込む

document.addEventListener('DOMContentLoaded', () => {

  // カーソル要素を生成
  const cursor = document.createElement('div');
  cursor.className = 'cursor';

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';

  document.body.prepend(ring);
  document.body.prepend(cursor);

  // マウス追従
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // リンク・ボタンホバーでカーソル拡大
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, [data-hover]'))
      document.body.classList.add('hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, [data-hover]'))
      document.body.classList.remove('hovering');
  });

});

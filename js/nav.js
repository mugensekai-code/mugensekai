// nav.js — ハンバーガーメニュー（左上ボタン・左からスライドイン）
// <script src="./js/nav.js" defer></script> で各ページに読み込む

document.addEventListener('DOMContentLoaded', () => {

  // ─── メニュー構造 ───────────────────────────────────
  const menuItems = [
    {
      label: 'TOP',
      href: './top.html',
    },
    {
      label: 'プロフィール',
      children: [
        { label: '詳細', href: './profile.html' },
        { label: '実績', href: './achievements.html' }
      ]
    },
    {
      label: 'ポートフォリオ',
      children: [
        { label: 'Webライティング',       href: './portfolio-writing.html' },
        { label: '図表作成',              href: './portfolio-charts.html' },
        { label: '基本プログラミングコード', href: './portfolio-code.html' },
        { label: '同人活動',              href: './portfolio-doujin.html' },
      ]
    },
    {
      label: 'お問合せ',
      href: './contact.html',
    },
  ];

  // ─── CSS注入 ─────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* ハンバーガーボタン */
    .nav-toggle {
      position: fixed;
      top: 24px;
      left: 24px;
      z-index: 1000;
      width: 40px;
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 6px;
      cursor: none;
      background: none;
      border: none;
      padding: 4px;
    }

    .nav-toggle span {
      display: block;
      width: 24px;
      height: 0.5px;
      background: var(--gold);
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1),
                  opacity 0.3s ease,
                  width 0.3s ease;
      transform-origin: center;
    }

    /* 開いた状態（×に変形） */
    .nav-toggle.is-open span:nth-child(1) {
      transform: translateY(6.5px) rotate(45deg);
    }
    .nav-toggle.is-open span:nth-child(2) {
      opacity: 0;
      width: 0;
    }
    .nav-toggle.is-open span:nth-child(3) {
      transform: translateY(-6.5px) rotate(-45deg);
    }

    /* オーバーレイ（背景暗幕） */
    .nav-overlay {
      position: fixed;
      inset: 0;
      background: rgba(12, 10, 8, 0.6);
      z-index: 900;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
    }
    .nav-overlay.is-open {
      opacity: 1;
      pointer-events: all;
    }

    /* スライドパネル */
    .nav-panel {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: min(280px, 80vw);
      z-index: 950;
      background: rgba(12, 10, 8, 0.92);
      border-right: 0.5px solid var(--gold-dim);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transform: translateX(-100%);
      transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
      display: flex;
      flex-direction: column;
      padding: 88px 0 48px;
      overflow-y: auto;
    }
    .nav-panel.is-open {
      transform: translateX(0);
    }

    /* パネル上部のロゴ */
    .nav-logo {
      font-family: var(--font-display);
      font-size: 10px;
      letter-spacing: 0.4em;
      color: var(--gold-dim);
      text-transform: uppercase;
      padding: 0 32px 32px;
      border-bottom: 0.5px solid var(--gold-dim);
      margin-bottom: 24px;
    }

    /* ナビリスト */
    .nav-list {
      list-style: none;
      padding: 0 0 24px;
    }

    /* 親メニュー */
    .nav-item {
      border-bottom: 0.5px solid rgba(200,169,110,0.1);
    }

    .nav-item-header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .nav-item > .nav-item-header > a,
    .nav-item > a {
      display: block;
      flex: 1;
      padding: 14px 32px;
      font-family: var(--font-display);
      font-size: 11px;
      font-weight: 400;
      letter-spacing: 0.25em;
      color: var(--cream);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .nav-item > .nav-item-header > a:hover,
    .nav-item > a:hover {
      color: var(--gold-light);
    }

    /* アコーディオン矢印 */
    .nav-accordion-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 14px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      min-width: 32px;
      min-height: 48px;
    }

    .nav-accordion-btn::after {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      border-right: 1.5px solid rgba(255,255,255,0.8);
      border-bottom: 1.5px solid rgba(255,255,255,0.8);
      transform: rotate(45deg);
      transition: transform 0.3s ease, border-color 0.3s ease;
    }

    .nav-accordion-btn.is-open::after {
      transform: rotate(-135deg);
      border-color: var(--gold-light);
    }

    /* 子メニュー */
    .nav-children {
      list-style: none;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1);
      background: rgba(200,169,110,0.03);
    }
    .nav-children.is-open {
      max-height: 400px;
    }

    .nav-children li a {
      display: block;
      padding: 10px 32px 10px 44px;
      font-family: var(--font-body);
      font-size: 13px;
      letter-spacing: 0.1em;
      color: var(--cream-dim);
      text-decoration: none;
      transition: color 0.3s ease;
      position: relative;
    }

    .nav-children li a::before {
      content: '—';
      position: absolute;
      left: 28px;
      color: var(--gold-dim);
      font-size: 10px;
    }

    .nav-children li a:hover {
      color: var(--gold-light);
    }

    /* フッターリンク */
    .nav-footer {
      margin-top: auto;
      padding: 24px 32px 0;
      border-top: 0.5px solid var(--gold-dim);
      font-family: var(--font-body);
      font-style: italic;
      font-size: 11px;
      letter-spacing: 0.2em;
      color: var(--gold-dim);
    }
  /* スクロールバー */
.nav-panel::-webkit-scrollbar {
  width: 4px;
}
.nav-panel::-webkit-scrollbar-track {
  background: rgba(12, 10, 8, 0.8);
}
.nav-panel::-webkit-scrollbar-thumb {
  background: var(--gold-dim);
  border-radius: 0;
}
.nav-panel::-webkit-scrollbar-thumb:hover {
  background: var(--gold);
}
  `;
  document.head.appendChild(style);

  // ─── DOM生成 ─────────────────────────────────────────

  // ハンバーガーボタン
  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'メニューを開く');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  // オーバーレイ
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';

  // パネル
  const panel = document.createElement('nav');
  panel.className = 'nav-panel';
  panel.setAttribute('aria-label', 'サイトナビゲーション');

  // ロゴ
  const logo = document.createElement('p');
  logo.className = 'nav-logo';
  logo.textContent = 'Mugen Theatere';
  panel.appendChild(logo);

  // リスト生成
  const ul = document.createElement('ul');
  ul.className = 'nav-list';

  menuItems.forEach(item => {
    const li = document.createElement('li');
    li.className = 'nav-item';

    if (item.children && item.children.length) {
      // 子あり：アコーディオン
      const header = document.createElement('div');
      header.className = 'nav-item-header';

      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;

      const btn = document.createElement('button');
      btn.className = 'nav-accordion-btn';
      btn.setAttribute('aria-label', item.label + 'を開く');

      const children = document.createElement('ul');
      children.className = 'nav-children';

      item.children.forEach(child => {
        const childLi = document.createElement('li');
        const childA = document.createElement('a');
        childA.href = child.href;
        childA.textContent = child.label;
        childLi.appendChild(childA);
        children.appendChild(childLi);
      });

      function toggleAccordion(e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = btn.classList.toggle('is-open');
        children.classList.toggle('is-open', isOpen);
      }
      btn.addEventListener('click', toggleAccordion);
      btn.addEventListener('touchend', toggleAccordion);
      // 親ラベルのテキストをクリックしても開閉する
      a.addEventListener('click', toggleAccordion);

      header.appendChild(a);
      header.appendChild(btn);
      li.appendChild(header);
      li.appendChild(children);

    } else {
      // 子なし
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      li.appendChild(a);
    }

    ul.appendChild(li);
  });

  panel.appendChild(ul);

  // パネルフッター
  const navFooter = document.createElement('p');
  navFooter.className = 'nav-footer';
  navFooter.textContent = '© 2025 · ムゲン劇場';
  panel.appendChild(navFooter);

  // DOM挿入
  document.body.appendChild(overlay);
  document.body.appendChild(panel);
  document.body.appendChild(toggle);

  // ─── 開閉ロジック ────────────────────────────────────
  function openMenu() {
    toggle.classList.add('is-open');
    overlay.classList.add('is-open');
    panel.classList.add('is-open');
    toggle.setAttribute('aria-label', 'メニューを閉じる');
  }

  function closeMenu() {
    toggle.classList.remove('is-open');
    overlay.classList.remove('is-open');
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-label', 'メニューを開く');
  }

  toggle.addEventListener('click', () => {
    toggle.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // ESCキーで閉じる
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

});
// ==UserScript==
// @name         Ctrl Panel
// @description  button api
// @author       SArpnt
// @version      1.0.2
// @namespace    https://boxcrittersmods.ga/authors/sarpnt/
// @homepage     https://boxcrittersmods.ga/projects/ctrl-panel/
// @updateURL    https://github.com/SArpnt/ctrl-panel/raw/master/script.user.js
// @downloadURL  https://github.com/SArpnt/ctrl-panel/raw/master/script.user.js
// @supportURL   https://github.com/SArpnt/ctrl-panel/issues
// @run-at       document-start
// @grant        none
// @match        https://boxcritters.com/play/
// @match        https://boxcritters.com/play/?*
// @match        https://boxcritters.com/play/#*
// @match        https://boxcritters.com/play/index.html
// @match        https://boxcritters.com/play/index.html?*
// @match        https://boxcritters.com/play/index.html#*
// ==/UserScript==

(function () {
	'use strict';

	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	const VERSION = [1, 0, 2];
	if (uWindow.ctrlPanel)
		if (uWindow.ctrlPanel.version < VERSION)
			console.warn(`Ctrl Panel: A mod has an outdated version of Ctrl Panel!`);
		else
			return;

	let ctrlPanel = { GM_info, version: VERSION };
	uWindow.ctrlPanel = ctrlPanel;
	if (cardboard)
		if (cardboard.mods.ctrlPanel)
			cardboard.mods.ctrlPanel = ctrlPanel;
		else
			cardboard.register('ctrlPanel', ctrlPanel, false, GM_info);

	let btnC = {
		top: { location: 'beforebegin', size: 'md', },
		left: { location: 'afterbegin', size: 'lg', },
		right: { location: 'beforeend', size: 'lg', },
		bottom: { location: 'afterend', size: 'md', },
	},
		validSizes = ['xxxxxl', 'xxxxl', 'xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs', 'xxxs', 'xxxxs', 'xxxxxs',],
		validTypes = ['basic',
			'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
			'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 'outline-warning', 'outline-info', 'outline-light', 'outline-dark',
		];


	let functions = ['addButtonGroup', 'addButton', 'removeButtonGroup', 'removeButton'],
		queue = [],
		runQueue = _ => queue.forEach(f => f());
	for (const f of functions)
		ctrlPanel[f] = function () {
			queue.push(_ => ctrlPanel[f].apply(this, arguments));
		};

	function onPageLoad() {
		{
			let sizeStyles = document.createElement('style');
			sizeStyles.innerHTML = `
				.btn-xxxxxl, .btn-group-xxxxxl > .btn {
					padding: 1.125rem 2.25rem;
					font-size: 2.5rem;
					border-radius: 0.55rem;
				}
				.btn-xxxxl, .btn-group-xxxxl > .btn {
					padding: 1rem 2rem;
					font-size: 2.25rem;
					border-radius: 0.5rem;
				}
				.btn-xxxl, .btn-group-xxxl > .btn {
					padding: 0.875rem 1.75rem;
					font-size: 2rem;
					border-radius: 0.45rem;
				}
				.btn-xxl, .btn-group-xxl > .btn {
					padding: 0.75rem 1.5rem;
					font-size: 1.75rem;
					border-radius: 0.4rem;
				}
				.btn-xl, .btn-group-xl > .btn {
					padding: 0.625rem 1.25rem;
					font-size: 1.5rem;
					border-radius: 0.35rem;
				}
				.btn-xs, .btn-group-xs > .btn {
					padding: 0.125rem 0.375rem;
					font-size: 0.75rem;
					border-radius: 0.15rem;
				}
				.btn-xxs, .btn-group-xxs > .btn {
					padding: 0.0625rem 0.25rem;
					font-size: 0.625rem;
					border-radius: 0.1rem;
				}
				.btn-xxxs, .btn-group-xxxs > .btn {
					padding: 0 0;
					font-size: 0.5rem;
					border-radius: 0.05rem;
				}
				.btn-xxxxs, .btn-group-xxxxs > .btn {
					padding: 0 0;
					font-size: 0.375rem;
					border-radius: 0;
				}
				.btn-xxxxxs, .btn-group-xxxxxs > .btn {
					padding: 0 0;
					font-size: 0.25rem;
					border-radius: 0;
				}`;
			document.head.appendChild(sizeStyles);
		}

		let menubar = document.getElementById('chat').parentElement.parentElement,
			sendBtn = document.querySelector('#chat button'),
			chatbar = document.querySelector('#chat form').children[0];

		menubar.classList.add('align-items-center');

		btnC.right.elem = sendBtn.parentElement;
		Array.from(btnC.right.elem.children).forEach(e => e.nodeType == 3 && e.remove());
		btnC.right.elem.classList.add('btn-toolbar');
		btnC.right.elem.style.marginLeft = '-1ch';
		btnC.right.elem.dataset.type = 'btnContainer';

		btnC.left.elem = btnC.right.elem.cloneNode(false);
		btnC.top.elem = btnC.right.elem.cloneNode(false);
		btnC.bottom.elem = btnC.right.elem.cloneNode(false);

		btnC.top.elem.classList.add('input-group');
		btnC.bottom.elem.classList.add('input-group');
		btnC.top.elem.style.alignItems = 'flex-end';
		btnC.bottom.elem.style.alignItems = 'flex-start';
		btnC.right.elem.style.marginLeft = 'calc(-1ch + -1px)';
		//btnC.left.elem.style.marginRight = '-1ch';

		ctrlPanel.addButtonGroup = function (loc, gsize, ...buttons) {
			if (!Object.keys(btnC).includes(loc)) {
				if (Array.isArray(gsize))
					buttons.unshift(gsize);
				else if (typeof gsize != 'undefined')
					throw `Invalid button '${gsize}' or invalid location '${loc}'`;
				gsize = loc;
				loc = 'bottom';
			}
			if (!validSizes.includes(gsize)) {
				if (Array.isArray(gsize))
					buttons.unshift(gsize);
				else if (typeof gsize != 'undefined')
					throw `Invalid button or size '${gsize}'`;
				gsize = btnC[loc].size;
			}

			let btnGroup = document.createElement('div');
			btnGroup.className = 'btn-group';
			btnGroup.style.marginLeft = '1ch';
			btnGroup.dataset.type = 'btnGroup';

			for (let buttonData of buttons) {
				let text, type, size;
				if (Array.isArray(buttonData))
					[text, type, size] = buttonData;
				else
					text = buttonData;

				if (!validTypes.includes(type)) {
					type = 'secondary';
					if (typeof size == 'undefined')
						size = type;
				}
				if (!validSizes.includes(size)) size = gsize;

				let btn = document.createElement('btn');
				btn.innerText = text;
				btn.className = `btn btn-${type} btn-${size}`;
				btn.dataset.type = 'btn';

				btnGroup.appendChild(btn);
			}

			btnC[loc].elem.appendChild(btnGroup);
			if (!document.contains(btnC[loc].elem))
				chatbar.insertAdjacentElement(btnC[loc].location, btnC[loc].elem);

			return btnGroup;
		};

		ctrlPanel.addButton = function (loc, text, type, size) {
			return ctrlPanel.addButtonGroup(loc, size, [text, type]).children[0];
		};

		ctrlPanel.removeButtonGroup = function (group) {
			if (group.dataset.type != 'btnGroup') throw `Ctrl Panel: button not in a button group!`;
			let container = group.parentElement;
			if (container.dataset.type != 'btnContainer') throw `Ctrl Panel: button group not in a container!`;
			group.remove();
			if (!container.childElementCount)
				container.remove();
		};

		ctrlPanel.removeButton = function (btn) {
			if (btn.dataset.type != 'btn') throw `Ctrl Panel: not a button!`;
			let group = btn.parentElement;
			if (group.dataset.type != 'btnGroup') throw `Ctrl Panel: button not in a button group!`;
			let container = group.parentElement;
			if (container.dataset.type != 'btnContainer') throw `Ctrl Panel: button group not in a container!`;
			btn.remove();
			if (!group.childElementCount) {
				group.remove();
				if (!container.childElementCount)
					container.remove();
			}
		};

		sendBtn.remove();
		ctrlPanel.addButtonGroup('right').appendChild(sendBtn);

		runQueue();
	}
	if (document.readyState == 'complete')
		onPageLoad();
	else
		uWindow.addEventListener('load', onPageLoad);
})();
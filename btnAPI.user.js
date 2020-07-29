// ==UserScript==
// @name         btnAPI
// @description  Modding api buttons
// @author       SArpnt
// @version      1.0.0
// @namespace    https://boxcrittersmods.ga/authors/sarpnt/
// @homepage     https://boxcrittersmods.ga/projects/btnAPI/
// @updateURL    https://github.com/SArpnt/btnAPI/raw/master/script.user.js
// @downloadURL  https://github.com/SArpnt/btnAPI/raw/master/script.user.js
// @supportURL   https://github.com/SArpnt/btnAPI/issues

// @run-at       document-start
// @grant        none
// @match        https://boxcritters.com/play/
// @match        https://boxcritters.com/play/?*
// @match        https://boxcritters.com/play/#*
// @match        https://boxcritters.com/play/index.html
// @match        https://boxcritters.com/play/index.html?*
// @match        https://boxcritters.com/play/index.html#*
// ==/UserScript==
// @icon         https://github.com/SArpnt/btnAPI/raw/master/icon16.png
// @icon64       https://github.com/SArpnt/btnAPI/raw/master/icon64.png

(function () {
	let btnAPI = {};

	let btnC = {
		top: { location: 'beforebegin' },
		left: { location: 'afterbegin' },
		right: { location: 'beforeend' },
		bottom: { location: 'afterend' },
	};
	window.addEventListener('load', function () {
		menubar = document.getElementById('chat').parentElement.parentElement;
		sendBtn = document.querySelector('#chat button');
		chatbar = document.querySelector('#chat form').children[0];

		menubar.classList.add('align-items-center');

		btnC.right.elem = sendBtn.parentElement;
		Array.from(btnC.right.elem.children).forEach(e => e.nodeType == 3 && e.remove());
		btnC.right.elem.classList.add('btn-toolbar');
		btnC.right.elem.style.marginLeft = '-1ch';

		btnC.left.elem = btnC.right.elem.cloneNode(false);
		btnC.top.elem = btnC.right.elem.cloneNode(false);
		btnC.bottom.elem = btnC.right.elem.cloneNode(false);

		btnC.top.elem.classList.add('input-group');
		btnC.bottom.elem.classList.add('input-group');
		btnC.top.elem.style.alignItems = 'flex-end';
		btnC.bottom.elem.style.alignItems = 'flex-start';
		btnC.right.elem.style.marginLeft = 'calc(-1ch + -1px)';
		//btnC.left.elem.style.marginRight = '-1ch';

		btnAPI.addButtonGroup = function (loc, ...buttons) {
			let btnGroup = document.createElement('div');
			btnGroup.className = 'btn-group';
			btnGroup.style.marginLeft = '1ch';
			btnC[loc].elem.appendChild(btnGroup);

			if (!document.contains(btnC[loc].elem))
				chatbar.insertAdjacentElement(btnC[loc].location, btnC[loc].elem);

			for (let buttonData of buttons) {
				let text, type, size;
				if (Array.isArray(buttonData))
					[text, type, size] = buttonData;
				else
					text = buttonData;
				type = type || 'secondary';
				size = size || 'sm';

				let btn = document.createElement('btn');
				btn.innerText = text;
				btn.className = `btn btn-${type} btn-${size}`;
				btnGroup.appendChild(btn);
			}
			return btnGroup;
		};

		btnAPI.addButton = (loc, text, type, size) => btnAPI.addButtonGroup(loc, [text, type, size]);

		btnAPI.removeButton = function (elem, loc) { // this doesn't validate input!
			elem.remove();
			if (!btnC[loc].elem.childElementCount)
				btnC[loc].elem.remove();
		};

		sendBtn.remove();
		btnAPI.addButtonGroup('right').appendChild(sendBtn);
	});

	window.btnAPI = btnAPI;
})();
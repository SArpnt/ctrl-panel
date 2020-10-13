# Ctrl Panel

button api

```js
// @require      https://github.com/SArpnt/ctrl-panel/raw/master/script.user.js
```

creates variable ctrlPanel containing useful things.

ctrlPanel.version stores version of ctrlPanel

functions:
- ctrlPanel.addButtonGroup(location, size, ...[text, type, size]) *(if only setting text for a button, an array is unneeded)*
- ctrlPanel.addButton(text, type, location, size)
- ctrlPanel.removeButtonGroup(group tag)
- ctrlPanel.removeButton(button tag)
location, type and size are always optional

locations:
- top
- left
- right
- bottom *(default)*

sizes:
- xxxxxl
- xxxxl
- xxxl
- xxl
- xl
- lg
- md
- sm
- xs
- xxs
- xxxs
- xxxxs
- xxxxxs

types (colors):
- basic *(no background)*
<br><br>
- primary *(blue)*
- secondary *(gray)*
- success *(green)*
- danger *(red)*
- warning *(yellow)*
- info *(cyan)*
- light *(white)*
- dark *(black)*
<br><br>
- outline-primary
- outline-secondary
- outline-success
- outline-danger
- outline-warning
- outline-info
- outline-light
- outline-dark
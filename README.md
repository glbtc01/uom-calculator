# 🧮 CalcUOM — Units of Measure Calculator

A clean, responsive **Units of Measure (UOM) Calculator** built with vanilla HTML, CSS, and JavaScript. Designed for warehouse, logistics, and inventory use cases where converting between packaging units (e.g. PC ↔ KG) is a daily task.

> No build tools, no frameworks, no dependencies — just open `index.html` in a browser.

---

## ✨ Features

- **Conversion Setup** — Define a custom ratio between any two units (e.g. `1 PC = 20 KG`)
- **Customer Quantity** — Enter a quantity in the 2nd unit and instantly see the equivalent in the 1st
- **Divisibility Warning** — Flags results that aren't whole numbers *(partial packaging alert)*
- **Dark Mode** — Easy-on-the-eyes dark theme, toggled from the settings menu
- **Hide Units (UOM) Toggle** — Switch to a plain Denominator / Numerator mode without unit labels
- **Manage Units** — Add, remove, and drag-to-reorder your UOM list
- **Clear Button** — Resets all number fields while keeping your selected units
- **Persistent Settings** — Units, theme, and toggle states are saved to `localStorage` and survive page refresh
- **Fully Responsive** — Works on desktop, tablet, and phone; Manage Units opens as a bottom sheet on mobile
- **Protected UI** — Right-click and common DevTools shortcuts are disabled

---

## 📁 File Structure

```
calcuom/
├── index.html        # Markup — structure and layout
├── styles.css        # Styles — variables, cards, modal, dark mode, responsive
├── app.js            # Logic — calculation, toggles, drag-sort, localStorage
└── README.md
```

---

## 🚀 Getting Started

1. **Download or clone** this repository
   ```bash
   git clone https://github.com/your-username/calcuom.git
   ```

2. **Open the folder** and double-click `index.html`
   — or use VS Code with the **Live Server** extension for auto-reload on save

3. Keep `index.html`, `styles.css`, and `app.js` in the **same folder**. An internet connection is only needed to load the Google Fonts.

---

## 🧮 How the Calculation Works

### 1. Define a Ratio

In the **Conversion Setup** card:

```
[ 1 ]  [ PC ]  |  [ 20 ]  [ KG ]
```

This means: **1 PC = 20 KG**

### 2. Enter a Customer Quantity

The customer quantity is entered in the **2nd unit** (KG in this example):

```
Customer Qty: 2000 KG
```

### 3. Formula

```
ratio  = Numerator ÷ Denominator
       = 20 ÷ 1 = 20

result = Customer Qty ÷ ratio
       = 2000 ÷ 20 = 100 PC
```

### 4. Divisibility Check

```
| result − round(result) | > 0.000000001

| 40.000000 − 40 | = 0          →  ✅ Clean whole number
| 16.666667 − 17 | = 0.333333   →  ⚠️ Not evenly divisible
```

The tiny threshold handles floating-point quirks (e.g. `3.9999999999` is treated as `4`).

### Quick Reference

| Denominator | Numerator | Customer Qty | Result | Warning |
|-------------|-----------|--------------|--------|---------|
| 1 PC | 20 KG | 2000 KG | 100 PC | ✅ |
| 10 PC | 5 KG | 12.5 KG | 25 PC | ✅ |
| 1 PC | 0.25 KG | 3 KG | 12 PC | ✅ |
| 10 PC | 3 KG | 5 KG | 16.666667 PC | ⚠️ |

---

## ⚙️ Settings Menu

Click the **☰ hamburger icon** (top-right) to open the settings drawer:

| Setting | Description |
|---------|-------------|
| **Dark Mode** | Toggles the dark/light theme |
| **Hide Units (UOM)** | Hides unit selectors; inputs become plain Denominator / Numerator fields and results show numbers only |

---

## 📦 Default Units

The calculator ships with these units (alphabetized):

`BOX` · `CTN` · `CON` · `JRC` · `KG` · `PAL` · `PC` · `SHB` · `SHU` · `SLU` · `SMU`

Use **Manage Units** to add new units, remove ones you don't need, or drag the 6-dot handle to reorder the list.

---

## 💾 localStorage Keys

| Key | Value | Description |
|-----|-------|-------------|
| `uom-theme` | `"light"` \| `"dark"` | Saved theme |
| `uom-enabled` | `"1"` \| `"0"` | Whether unit selectors are shown |
| `uom-units` | JSON array | Your custom unit list |

Settings are stored per browser, per device. To reset everything, run this in the browser console and refresh:

```js
localStorage.removeItem('uom-theme');
localStorage.removeItem('uom-enabled');
localStorage.removeItem('uom-units');
```

---

## 🛠️ Built With

- **HTML5** — semantic markup
- **CSS3** — custom properties, `clamp()` fluid sizing, Grid & Flexbox
- **Vanilla JavaScript** — no frameworks or libraries
- **Google Fonts** — Barlow + Barlow Condensed

---

## 📄 License

© AGB — All rights reserved.

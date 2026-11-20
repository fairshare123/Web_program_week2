/* =========================================================
   Dipika Aryal — Portfolio JavaScript
   1. Dark mode   2. Mobile menu   3. Learning journey
   ========================================================= */


/* ---------- 1. DARK MODE ---------- */

const themeButton = document.getElementById("theme-toggle");

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeButton.querySelector(".theme-icon").textContent = theme === "dark" ? "☀" : "☾";
    themeButton.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
}

// The small script in <head> already picked the starting theme; update the button to match
setTheme(document.documentElement.getAttribute("data-theme") || "light");

themeButton.addEventListener("click", function () {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("theme", next); } catch (error) {}
});


/* ---------- 2. MOBILE MENU ---------- */

const menuButton = document.getElementById("menu-button");
const navLinks = document.getElementById("nav-links");

function closeMenu() {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
}

menuButton.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
});


/* ---------- 3. LEARNING JOURNEY (open and close weeks) ---------- */

// The panels are open in the HTML, so the links still work if JavaScript fails.
// Here we close them all, then open one when its week is clicked.
document.querySelectorAll(".week-toggle").forEach(function (button) {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    panel.hidden = true;

    button.addEventListener("click", function () {
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;
    });
});

// Open a week automatically if the address ends with #week7, for example
if (/^#week\d+$/.test(location.hash)) {
    const target = document.querySelector(location.hash + " .week-toggle");
    if (target) target.click();
}


/* ---------- 4. SMALL TOUCHES ---------- */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Header shadow after scrolling a little
const header = document.querySelector(".site-header");
window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });


/* ---------- 5. SECTIONS SLIDE IN WHILE SCROLLING ---------- */

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);   // animate only once
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
} else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
}


/* ---------- 6. HIGHLIGHT THE NAV LINK FOR THE CURRENT SECTION ---------- */

const navMap = {};
document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (link) {
    navMap[link.getAttribute("href").slice(1)] = link;
});

if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            const link = navMap[entry.target.id];
            if (!link) return;
            if (entry.isIntersecting) {
                Object.values(navMap).forEach(function (l) {
                    l.classList.remove("active");
                    l.removeAttribute("aria-current");
                });
                link.classList.add("active");
                link.setAttribute("aria-current", "true");
            }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(navMap).forEach(function (id) {
        const section = document.getElementById(id);
        if (section) spy.observe(section);
    });
}


/* ---------- 7. CUSTOM CURSOR (desktop with a mouse only) ---------- */

const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (hasMouse && !reduceMotion) {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");

    let mouseX = -100, mouseY = -100;   // where the mouse is
    let ringX = -100, ringY = -100;     // where the ring is (it follows a little behind)

    document.documentElement.classList.add("has-cursor");

    window.addEventListener("mousemove", function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        dot.style.transform = "translate(" + mouseX + "px, " + mouseY + "px)";
        dot.classList.remove("cursor-hidden");
        ring.classList.remove("cursor-hidden");
    });

    // The ring glides toward the mouse every frame
    function followMouse() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = "translate(" + ringX + "px, " + ringY + "px)";
        requestAnimationFrame(followMouse);
    }
    followMouse();

    // Hide the cursor when the mouse leaves the window
    document.addEventListener("mouseleave", function () {
        dot.classList.add("cursor-hidden");
        ring.classList.add("cursor-hidden");
    });

    // The ring grows over anything you can click
    document.addEventListener("mouseover", function (event) {
        const overClickable = Boolean(event.target.closest("a, button"));
        ring.classList.toggle("is-hovering", overClickable);
        dot.classList.toggle("is-hidden-dot", overClickable);
    });
}

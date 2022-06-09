const navbar = document.querySelector("nav");
const copyrightEl = document.querySelector("#year");
const sections = document.querySelectorAll("section");
const navLinkItems = document.querySelectorAll(".nav-item > a.nav-link");
const contactForm = document.querySelector("#contact-form");
const navbarBtnLine = document.querySelectorAll(".navbar-cs-icon");
const navbarBtnToggler = document.querySelector(".navbar-toggler");
let lastScrollValue = 0;

// Function Animation in Navbar
const navbarAnimation = () => {
  const currentScrollValue = document.documentElement.scrollTop;
  const navbarListItem = document.querySelector("#navbarNav");

  if (navbarListItem.classList.contains("show")) {
    navbarBtnToggler.classList.add("collapsed");
    navbarListItem.classList.remove("show");

    navbarBtnLine.forEach((line) => {
      line.classList.toggle("toggle-on");
    });
  }

  // Set background when scrollY > 100
  if (currentScrollValue > 100) {
    navbar.classList.add("bg-white");
    navbar.classList.add("shadow-sm");
  } else {
    navbar.classList.remove("bg-white");
    navbar.classList.remove("shadow-sm");
  }

  // Hide navbar if current scroll < last scroll
  if (currentScrollValue > lastScrollValue) {
    navbar.classList.add("scroll-bottom");
    navbar.classList.remove("scroll-top");
  } else {
    navbar.classList.remove("scroll-bottom");
    navbar.classList.add("scroll-top");
  }
  lastScrollValue = currentScrollValue;
};

// Function Scroll Spy
const scrollSpy = () => {
  const currentScrollValue = window.scrollY;
  sections.forEach((section) => {
    if (currentScrollValue >= section.offsetTop - 320) {
      const sectionId = section.getAttribute("id");
      const navEL = document.querySelector(`a[href='#${sectionId}']`);

      navLinkItems.forEach((navLink) => {
        navLink.classList.remove("active");
      });

      if (navEL != null) {
        navEL.classList.add("active");
      }
    }
  });
};

const buttonSubmitAnimation = (buttonStatus) => {
  const buttonSubmit = document.querySelector("button[type='submit']");
  buttonSubmit.classList.toggle("btn-cs-action");
  buttonSubmit.classList.toggle("btn-on-submit");
  buttonSubmit.disabled = buttonStatus;
};

const sendContactForm = (event) => {
  event.preventDefault();

  buttonSubmitAnimation(true);

  const formData = new FormData(event.target);
  const dateNow = new Date().toLocaleString();

  const appearAlert = (msg, className, timeout) => {
    const alertWrapper = document.querySelector("#alertMsg");
    const alertEl = document.createElement("div");
    alertEl.textContent = msg;
    alertEl.setAttribute("class", `alert ${className}`);
    alertWrapper.appendChild(alertEl);

    setTimeout(() => {
      alertEl.style.transition = "0.3s";
      alertEl.style.opacity = "0";

      alertEl.addEventListener("transitionend", (event) => {
        if (event.propertyName === "opacity") {
          alertEl.remove();
        }
      });
    }, timeout);
  };

  const sendEmail = fetch(
    "https://formsubmit.co/ajax/3d8e341b5c3a8232c0f4588e7bdf3eda",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        name: formData.get("name"),
        message: formData.get("message"),
        _subject: `Portfolio |  ${dateNow}`,
      }),
    }
  );

  sendEmail
    .then((response) => response.json())
    .then((data) => {
      data.success
        ? appearAlert(data.message, "alert-success", 3000)
        : appearAlert(data.message, "alert-danger", 3000);
      contactForm.reset();
      buttonSubmitAnimation(false);
    })
    .catch((error) => {
      appearAlert(error.message, "alert-danger", 3000);
      buttonSubmitAnimation(false);
    });
};

// Function Get Current Year for Copyright
const getCurrentYear = () => new Date().getFullYear();

// Function Hamburger Menu
const hamburgerMenu = () => {
  const currentScrollValue = document.documentElement.scrollTop;
  navbarBtnLine.forEach((line) => {
    line.classList.toggle("toggle-on");
  });

  // Set background when scrollY > 100
  if (currentScrollValue < 100) {
    navbar.classList.add("bg-white");
    navbar.classList.add("shadow-sm");

    setTimeout(() => {
      if (!navbarBtnLine[0].classList.contains("toggle-on")) {
        navbar.classList.remove("bg-white");
        navbar.classList.remove("shadow-sm");
      }
    }, 1000);
  }
};

window.addEventListener("scroll", navbarAnimation);
window.addEventListener("scroll", scrollSpy);

contactForm.addEventListener("submit", sendContactForm);

navbarBtnToggler.addEventListener("click", hamburgerMenu);

copyrightEl.textContent = getCurrentYear();
